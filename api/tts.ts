import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

const TTS_MODEL = 'gemini-3.8-flash-lite-tts';
const LIVE_VOICE_MODEL = 'gemini-3.8-live';
const TTS_STYLE =
  'Warm, calm, articulate human documentary narrator speaking clearly at an unhurried, natural studio pace without rush or pauses mid-phrase.';
const CACHE_DIR = path.resolve(process.cwd(), '.tts-cache');

const memoryAudioCache = new Map<string, string>();
const inFlightRequests = new Map<string, Promise<string>>();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function getCacheKey(text: string, voiceName: string): string {
  return crypto
    .createHash('sha256')
    .update(`${TTS_MODEL}:${voiceName}:${TTS_STYLE}:${text}`)
    .digest('hex');
}

function wrapPcm24kMonoAsWav(pcm: Buffer): Buffer {
  const header = Buffer.alloc(44);
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.byteLength, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // PCM chunk size
  header.writeUInt16LE(1, 20); // Audio format = PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.byteLength, 40);

  return Buffer.concat([header, pcm]);
}

async function synthesizeViaLiveApi(text: string, voiceName: string): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    const pcmChunks: Buffer[] = [];
    let settled = false;
    let sessionRef: { close: () => void; sendRealtimeInput: (arg: { text: string }) => void } | null =
      null;

    const finish = (err?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      try {
        sessionRef?.close();
      } catch {
        // Ignore close errors
      }
      if (err) {
        reject(err);
      } else if (pcmChunks.length === 0) {
        reject(new Error('Gemini Live voice returned empty audio'));
      } else {
        const wavBuf = wrapPcm24kMonoAsWav(Buffer.concat(pcmChunks));
        resolve(wavBuf.toString('base64'));
      }
    };

    const timeoutId = setTimeout(() => {
      finish(new Error('Gemini Live voice synthesis timed out'));
    }, 18000);

    try {
      const session = await ai.live.connect({
        model: LIVE_VOICE_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
          systemInstruction:
            'You are a calm, warm documentary narrator. Speak ONLY the exact text provided by the user aloud verbatim, word for word, without adding, changing, or skipping any words, and with no greeting or commentary.',
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const parts = message.serverContent?.modelTurn?.parts ?? [];
            for (const part of parts) {
              if (part.inlineData?.data) {
                pcmChunks.push(Buffer.from(part.inlineData.data, 'base64'));
              }
            }
            if (message.serverContent?.turnComplete && pcmChunks.length > 0) {
              finish();
            }
          },
          onerror: (errEvent: unknown) => {
            const msg =
              errEvent instanceof Error ? errEvent.message : 'Gemini Live voice socket error';
            finish(new Error(msg));
          },
          onclose: () => {
            if (!settled) {
              if (pcmChunks.length > 0) {
                finish();
              } else {
                finish(new Error('Gemini Live voice connection closed before audio completed'));
              }
            }
          },
        },
      });

      sessionRef = session;
      session.sendRealtimeInput({
        text: `Read this exact line verbatim: ${text}`,
      });
    } catch (err) {
      finish(err instanceof Error ? err : new Error('Gemini Live voice connection failed'));
    }
  });
}

async function generateOrReadCachedAudio(text: string, voiceName: string): Promise<string> {
  const key = getCacheKey(text, voiceName);

  const memHit = memoryAudioCache.get(key);
  if (memHit) return memHit;

  const cacheFile = path.join(CACHE_DIR, `${key}.wav`);
  try {
    const fileBuf = await fs.readFile(cacheFile);
    if (fileBuf.byteLength > 44) {
      const b64 = fileBuf.toString('base64');
      memoryAudioCache.set(key, b64);
      return b64;
    }
  } catch {
    // Cache miss
  }

  const existing = inFlightRequests.get(key);
  if (existing) return existing;

  const promise = (async () => {
    let base64Audio: string | undefined;

    try {
      const response = await ai.models.generateContent({
        model: TTS_MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text,
                speechMetadata: {
                  style: TTS_STYLE,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (ttsErr: unknown) {
      const rawMsg = ttsErr instanceof Error ? ttsErr.message : '';
      const isQuota =
        rawMsg.includes('429') ||
        rawMsg.includes('RESOURCE_EXHAUSTED') ||
        rawMsg.includes('quota');
      if (!isQuota) throw ttsErr;
      base64Audio = await synthesizeViaLiveApi(text, voiceName);
    }

    if (!base64Audio) {
      throw new Error('Failed to generate audio from Gemini TTS');
    }

    memoryAudioCache.set(key, base64Audio);
    try {
      await fs.mkdir(CACHE_DIR, { recursive: true });
      await fs.writeFile(cacheFile, Buffer.from(base64Audio, 'base64'));
    } catch {
      // Ignore cache write error
    }

    return base64Audio;
  })();

  inFlightRequests.set(key, promise);
  try {
    return await promise;
  } finally {
    inFlightRequests.delete(key);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawText = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    const voiceName =
      typeof req.body?.voiceName === 'string' && req.body.voiceName.trim()
        ? req.body.voiceName.trim()
        : 'Zephyr';

    if (!rawText) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const base64Audio = await generateOrReadCachedAudio(rawText, voiceName);
    return res.status(200).json({ audio: base64Audio, format: 'audio/wav' });
  } catch (err: unknown) {
    const rawMsg = err instanceof Error ? err.message : 'TTS generation failed';
    const isQuota =
      rawMsg.includes('429') || rawMsg.includes('RESOURCE_EXHAUSTED') || rawMsg.includes('quota');
    const status = isQuota ? 429 : 500;
    console.error('Gemini TTS error:', rawMsg);
    return res.status(status).json({
      error: isQuota
        ? 'Gemini TTS free-tier request quota reached. Add a billing-enabled key in Vercel environment variables.'
        : rawMsg,
      quotaExceeded: isQuota,
    });
  }
}
