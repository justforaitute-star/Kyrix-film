export interface KeynoteSlideMeta {
  number: number;
  code: string;
  title: string;
  section: string;
  summary: string;
}

export const KEYNOTE_SLIDES: KeynoteSlideMeta[] = [
  {
    number: 1,
    code: '01',
    title: 'KYRIX',
    section: 'Opening',
    summary: 'A Customizable Real-Time AI Desktop Agent for Windows.',
  },
  {
    number: 2,
    code: '02',
    title: 'Desktop Friction',
    section: 'Context',
    summary: 'Modern workflows span editors, browsers, notes, and status tools.',
  },
  {
    number: 3,
    code: '03',
    title: 'Always Within Reach',
    section: 'Context',
    summary: 'A calm top-edge presence docked flush at 0 px without blocking work.',
  },
  {
    number: 4,
    code: '04',
    title: 'Design Principles',
    section: 'Philosophy',
    summary: 'Restrained liquid glass, crisp typography, and user-owned controls.',
  },
  {
    number: 5,
    code: '05',
    title: 'Meet KYRIX',
    section: 'Product',
    summary: 'Your floating desktop assistant identity combining compact notch and dashboard.',
  },
  {
    number: 6,
    code: '06',
    title: 'The Interface',
    section: 'Product',
    summary: 'Compact top-edge pill expanding cleanly into the 7-tab main navigation.',
  },
  {
    number: 7,
    code: '07',
    title: 'Voice-First Experience',
    section: 'Voice',
    summary: 'Chronological voice loop: Listening notch, user caption, and KYRIX response.',
  },
  {
    number: 8,
    code: '08',
    title: 'Multilingual Intelligence',
    section: 'Voice',
    summary: 'Natural voice and typed conversation persisted cleanly inside the Chat thread.',
  },
  {
    number: 9,
    code: '09',
    title: 'PC Control',
    section: 'Control',
    summary: 'Application launcher, edit mode, and the Add an app creation dialog.',
  },
  {
    number: 10,
    code: '10',
    title: 'Real-Time Screen Awareness',
    section: 'Awareness',
    summary: 'Freeform screen region capture contrasted clearly against future roadmap goals.',
  },
  {
    number: 11,
    code: '11',
    title: 'Intelligent Search',
    section: 'Search',
    summary: 'KYRIX web results open directly as an inline card with image & filter pills.',
  },
  {
    number: 12,
    code: '12',
    title: 'Personal Assistant',
    section: 'Productivity',
    summary: 'Today dashboard clock, music controls, timer, OBS status, Ready list, and Tasks.',
  },
  {
    number: 13,
    code: '13',
    title: 'The Mascot',
    section: 'Identity',
    summary: 'Compact star mascot notch, cursor-tracking eyes, waveform styles, and shapes.',
  },
  {
    number: 14,
    code: '14',
    title: 'The Experience',
    section: 'End-to-End',
    summary: 'Activation, listening, user speech, processing, and response in one flow.',
  },
  {
    number: 15,
    code: '15',
    title: 'Technology',
    section: 'Architecture',
    summary: 'Desktop overlay, voice pipeline, live system stats, and inline search cards.',
  },
  {
    number: 16,
    code: '16',
    title: 'Customization',
    section: 'Style',
    summary: 'Complete Style studio across all 8 sub-tabs alongside the Wallpaper gallery.',
  },
  {
    number: 17,
    code: '17',
    title: 'Real-World Applications',
    section: 'Workflows',
    summary: 'Practical daily workflows uniting Today, Apps, Tasks, and visual Search.',
  },
  {
    number: 18,
    code: '18',
    title: 'KYRIX for Windows',
    section: 'Closing',
    summary: 'Your computer. Your intelligence. Your way.',
  },
];

export function getSlideByNumber(num: number): KeynoteSlideMeta {
  const clamped = Math.max(1, Math.min(KEYNOTE_SLIDES.length, Math.round(num)));
  return KEYNOTE_SLIDES[clamped - 1];
}
