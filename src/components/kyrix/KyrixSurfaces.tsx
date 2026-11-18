import React from 'react';
import {
  Check,
  ChevronDown,
  MessageSquare,
  Mic,
  Music,
  Pause,
  Play,
  Plus,
  Power,
  Search,
  SkipBack,
  SkipForward,
  X,
} from 'lucide-react';
import { KyrixMascot, KyrixSilkWave, KyrixTabId } from '../KyrixBrand';
import { MascotMood } from '../../film/timeline';

export type KyrixStyleSubTab =
  | 'Look'
  | 'Glass'
  | 'Layout'
  | 'Motion'
  | 'Mascot'
  | 'Voice'
  | 'Toggles'
  | 'Icon';

export const KYRIX_STYLE_SUBTABS: KyrixStyleSubTab[] = [
  'Look',
  'Glass',
  'Layout',
  'Motion',
  'Mascot',
  'Voice',
  'Toggles',
  'Icon',
];

export const KYRIX_STYLE_PRESETS = [
  'Classic',
  'Midnight',
  'Crystal',
  'Neon',
  'Minimal',
  'Focus',
] as const;

export const KYRIX_LOOK_SWATCHES_ROW1 = [
  '#22B8CF',
  '#38BDF8',
  '#3B82F6',
  '#6366F1',
  '#8B5CF6',
  '#C026D3',
  '#EC4899',
  '#F43F5E',
  '#E04F26',
];

export const KYRIX_LOOK_SWATCHES_ROW2 = [
  '#F59E0B',
  '#EAB308',
  '#84CC16',
  '#4ADE80',
  '#10B981',
  '#14B8A6',
  '#06B6D4',
  '#94A3B8',
  '#38BDF8',
];

interface KyrixShellHeaderProps {
  activeTab: KyrixTabId;
  accentColor?: string;
  accentSecondary?: string;
  micActive?: boolean;
  searchActive?: boolean;
  onSelectTab?: (tab: KyrixTabId) => void;
}

const ALL_TABS: KyrixTabId[] = [
  'Today',
  'Tasks',
  'Chat',
  'Apps',
  'Wallpaper',
  'Stats',
  'Style',
];

/**
 * Straight-on digital recreation of the KYRIX dashboard top navigation bar.
 * Preserves exact tab order and the 4 right-hand circular orb/action controls.
 */
export const KyrixShellHeader: React.FC<KyrixShellHeaderProps> = ({
  activeTab,
  accentColor = '#E05A2B',
  accentSecondary = '#C44522',
  micActive = false,
  searchActive = false,
  onSelectTab,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-white/12 bg-white/[0.04] px-4 py-2.5">
      <div className="flex items-center gap-1">
        {ALL_TABS.map((tab) => {
          const isActive = tab === activeTab;
          const Tag = onSelectTab ? 'button' : 'span';
          return (
            <Tag
              key={tab}
              type={onSelectTab ? 'button' : undefined}
              onClick={onSelectTab ? () => onSelectTab(tab) : undefined}
              className={`rounded-full px-3 py-1 text-[11px] font-medium whitespace-nowrap transition-colors ${
                onSelectTab ? 'cursor-pointer' : ''
              }`}
              style={
                isActive
                  ? {
                      background: `linear-gradient(180deg, ${accentColor}, ${accentSecondary})`,
                      color: '#FFFFFF',
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), 0 2px 6px rgba(0,0,0,0.35)`,
                    }
                  : { color: 'rgba(244,246,250,0.84)' }
              }
            >
              {tab}
            </Tag>
          );
        })}
      </div>

      {/* Right circular action cluster: [Accent Orb] [Search] [Mic] [Power] */}
      <div className="flex items-center gap-1.5">
        <div
          className="h-7 w-7 rounded-full border border-white/20 shadow-inner"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${accentColor}, ${accentSecondary} 70%, #1F2430 100%)`,
          }}
        />
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/18 text-[#FAF8F5]/90"
          style={{
            background: searchActive
              ? `linear-gradient(180deg, ${accentColor}, ${accentSecondary})`
              : 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
          }}
        >
          <Search className="h-3.5 w-3.5" />
        </div>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/18 text-[#FAF8F5]/95"
          style={{
            background: micActive
              ? `linear-gradient(180deg, ${accentColor}, ${accentSecondary})`
              : 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
          }}
        >
          <Mic className="h-3.5 w-3.5" />
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/18 bg-gradient-to-b from-[#E05A47]/65 to-[#8F2D24]/70 text-[#FAF8F5]">
          <Power className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};

interface KyrixTodayViewProps {
  accentColor?: string;
  accentSecondary?: string;
  hour?: string;
  minute?: string;
  dateLabel?: string;
  timerDisplay?: string;
  timerActive?: boolean;
  musicTitle?: string;
  musicSub?: string;
  obsStatus?: 'offline' | 'recording';
}

/**
 * Exact digital Today view matching the real KYRIX Windows screenshot:
 * Left: Vertical stacked Clock (20 : 56 / Monday, 16 Nov)
 * Center: Now Playing card + 2-card bottom row (Timer 5:00 + OBS offline)
 * Right: Ready status & timestamps card
 */
export const KyrixTodayView: React.FC<KyrixTodayViewProps> = ({
  accentColor = '#E05A2B',
  accentSecondary = '#B83E1B',
  hour = '20',
  minute = '56',
  dateLabel = 'Monday, 16 Nov',
  timerDisplay = '5:00',
  timerActive = false,
  musicTitle = 'Nothing playing',
  musicSub = 'Play anything — these controls follow it',
  obsStatus = 'offline',
}) => {
  return (
    <div className="grid grid-cols-12 gap-3 p-4">
      {/* Left Tall Stacked Clock */}
      <div className="col-span-3 flex flex-col items-center justify-between rounded-2xl border border-white/12 bg-black/22 px-3 py-5 text-center">
        <div className="my-auto flex flex-col items-center">
          <div className="font-display text-4xl font-bold leading-none text-[#F3F5F8] tabular-nums">
            {hour}
          </div>
          <div className="my-2 flex flex-col gap-1.5">
            <span className="h-1 w-1 rounded-full bg-[#E06D44]" />
            <span className="h-1 w-1 rounded-full bg-[#E06D44]" />
          </div>
          <div className="font-display text-4xl font-bold leading-none text-[#F3F5F8] tabular-nums">
            {minute}
          </div>
        </div>
        <div className="mt-3 text-[11px] text-[#E5E9F0]/75">{dateLabel}</div>
      </div>

      {/* Center Column: Music Player + Timer & OBS split */}
      <div className="col-span-6 space-y-3">
        <div className="rounded-2xl border border-white/12 bg-black/22 p-3.5 text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-inner"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, #EC4899)`,
                }}
              >
                <Music className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#F8FAFC]">{musicTitle}</div>
                <div className="text-[11px] text-[#CBD5E1]/70">{musicSub}</div>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#CBD5E1]/60" />
          </div>

          <div className="mt-3 flex items-center gap-2 text-[10px] text-[#CBD5E1]/65 tabular-nums">
            <span>0:00</span>
            <div className="h-[3px] flex-1 rounded-full bg-white/12" />
            <span>--:--</span>
          </div>

          <div className="mt-2.5 flex items-center justify-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/14 bg-white/[0.06] text-[#F1F5F9]/85">
              <SkipBack className="h-3.5 w-3.5" />
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/18 bg-white/[0.10] text-white">
              <Play className="h-3.5 w-3.5 fill-current" />
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/14 bg-white/[0.06] text-[#F1F5F9]/85">
              <SkipForward className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* 5:00 Timer */}
          <div className="flex items-center justify-between rounded-2xl border border-white/12 bg-black/22 px-4 py-3.5 text-left">
            <div>
              <div className="font-display text-lg font-bold text-[#F8FAFC] tabular-nums">
                {timerDisplay}
              </div>
              <div className="text-[11px] text-[#CBD5E1]/65">
                {timerActive ? 'Timer running' : 'Tap to start'}
              </div>
            </div>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-white shadow"
              style={{
                background: `linear-gradient(180deg, ${accentColor}, ${accentSecondary})`,
              }}
            >
              {timerActive ? (
                <Pause className="h-3.5 w-3.5 fill-current" />
              ) : (
                <Play className="h-3.5 w-3.5 fill-current" />
              )}
            </div>
          </div>

          {/* OBS Status */}
          <div className="flex items-center justify-between rounded-2xl border border-white/12 bg-black/22 px-4 py-3.5 text-left">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F8FAFC]">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    obsStatus === 'recording' ? 'bg-[#EF4444]' : 'bg-[#CBD5E1]/75'
                  }`}
                />
                <span>{obsStatus === 'recording' ? 'OBS live' : 'OBS offline'}</span>
              </div>
              <div className="mt-0.5 text-[11px] text-[#CBD5E1]/65">
                {obsStatus === 'recording' ? 'Recording active' : "OBS isn't running"}
              </div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-gradient-to-b from-[#E05A47]/65 to-[#8F2D24]/70">
              <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Ready Status Card */}
      <div className="col-span-3 flex flex-col rounded-2xl border border-white/12 bg-black/22 p-3.5 text-left">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs font-semibold text-[#F8FAFC]">
          <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
          <span>Ready</span>
        </div>
        <div className="mt-3 space-y-2.5 text-[11px]">
          <div>
            <div className="font-mono-tabular text-[10px] text-[#CBD5E1]/55">13:43</div>
            <div className="text-[#E2E8F0]/88">Sign Up button</div>
          </div>
          <div>
            <div className="font-mono-tabular text-[10px] text-[#CBD5E1]/55">13:43</div>
            <div className="text-[#E2E8F0]/88">Pricing</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface KyrixTasksViewProps {
  accentColor?: string;
  accentSecondary?: string;
  mode?: 'empty' | 'populated';
  checkedSecond?: boolean;
}

/**
 * Exact digital Tasks view: shows authentic "No tasks yet" empty card + "+ New task" CTA,
 * or active task items once created.
 */
export const KyrixTasksView: React.FC<KyrixTasksViewProps> = ({
  accentColor = '#E05A2B',
  accentSecondary = '#B83E1B',
  mode = 'empty',
  checkedSecond = false,
}) => {
  if (mode === 'empty') {
    return (
      <div className="flex flex-col justify-between p-5">
        <div className="mx-auto my-2 flex w-full max-w-[390px] flex-col items-center rounded-2xl border border-white/12 bg-black/20 px-6 py-7 text-center">
          <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-full border border-white/14 bg-white/[0.06] text-[#CBD5E1]/80">
            <Check className="h-3.5 w-3.5" />
          </div>
          <div className="text-xs font-semibold text-[#F8FAFC]">No tasks yet</div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-[#CBD5E1]/75">
            Ask KYRIX for something big — &ldquo;research electric cars and save a report&rdquo; — or start one here.
          </p>
        </div>

        <div className="mt-4 flex justify-start">
          <div
            className="inline-flex min-w-[230px] items-center justify-center gap-1.5 rounded-full px-5 py-2 text-xs font-medium text-white shadow"
            style={{
              background: `linear-gradient(180deg, ${accentColor}, ${accentSecondary})`,
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New task</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-5 text-left">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#F8FAFC]">Active Tasks</span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-3.5 py-1 text-[11px] font-medium text-white"
          style={{
            background: `linear-gradient(180deg, ${accentColor}, ${accentSecondary})`,
          }}
        >
          <Plus className="h-3 w-3" />
          <span>New task</span>
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-xl border border-white/12 bg-black/22 px-3.5 py-2.5 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#34D399]/25 text-[#34D399]">
              <Check className="h-2.5 w-2.5" />
            </span>
            <span className="text-[#CBD5E1]/65 line-through">
              Research electric cars and save a report
            </span>
          </div>
          <span className="text-[10px] text-[#34D399]">Saved</span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-white/12 bg-black/22 px-3.5 py-2.5 text-xs">
          <div className="flex items-center gap-2.5">
            {checkedSecond ? (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#34D399]/25 text-[#34D399]">
                <Check className="h-2.5 w-2.5" />
              </span>
            ) : (
              <span className="h-4 w-4 rounded-full border border-white/35" />
            )}
            <span className={checkedSecond ? 'text-[#CBD5E1]/65 line-through' : 'text-[#F8FAFC]'}>
              Review afternoon schedule &amp; notes
            </span>
          </div>
          <span className="font-mono-tabular text-[10px] text-[#CBD5E1]/55">Today</span>
        </div>
      </div>
    </div>
  );
};

interface ChatMsg {
  speaker: 'You' | 'KYRIX';
  text: string;
}

interface KyrixChatViewProps {
  accentColor?: string;
  accentSecondary?: string;
  messages?: ChatMsg[];
}

/**
 * Exact digital Chat view: empty state ("No messages yet") or chronological messages,
 * plus exact bottom bar ("Type a message to KYRIX..." + send arrow + Clear button).
 */
export const KyrixChatView: React.FC<KyrixChatViewProps> = ({
  accentColor = '#E05A2B',
  accentSecondary = '#B83E1B',
  messages = [],
}) => {
  return (
    <div className="flex flex-col justify-between p-5">
      {messages.length === 0 ? (
        <div className="mx-auto my-3 flex w-full max-w-[330px] flex-col items-center rounded-2xl border border-white/12 bg-black/20 px-6 py-7 text-center">
          <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-full border border-white/14 bg-white/[0.06] text-[#CBD5E1]/80">
            <MessageSquare className="h-3.5 w-3.5" />
          </div>
          <div className="text-xs font-semibold text-[#F8FAFC]">No messages yet</div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-[#CBD5E1]/75">
            Talk to KYRIX with your voice, or type below — the thread stays here.
          </p>
        </div>
      ) : (
        <div className="my-1 space-y-2 text-left">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 rounded-xl border border-white/12 bg-black/24 px-3.5 py-2.5 text-xs"
            >
              <span
                className="mt-0.5 font-bold whitespace-nowrap"
                style={{ color: m.speaker === 'KYRIX' ? '#38BDF8' : '#94A3B8' }}
              >
                {m.speaker}
              </span>
              <span className="text-[#F8FAFC]/92">{m.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Exact bottom input + Clear control */}
      <div className="mt-4 flex items-center gap-2.5">
        <div className="flex flex-1 items-center justify-between rounded-full border border-white/14 bg-black/35 py-1.5 pl-4 pr-1.5">
          <span className="text-[11px] text-[#CBD5E1]/55">Type a message to KYRIX...</span>
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{
              background: `linear-gradient(180deg, ${accentColor}, ${accentSecondary})`,
            }}
          >
            &rarr;
          </span>
        </div>
        <div className="rounded-full border border-white/14 bg-white/[0.06] px-4 py-1.5 text-[11px] font-medium text-[#E2E8F0]/85">
          Clear
        </div>
      </div>
    </div>
  );
};

export const KYRIX_DEFAULT_APPS = [
  { name: 'Chrome', badge: 'C', color: '#2563EB' },
  { name: 'VS Code', badge: 'V', color: '#0284C7' },
  { name: 'Spotify', badge: 'S', color: '#22C55E' },
  { name: 'Discord', badge: 'D', color: '#3B48F6' },
  { name: 'Notepad', badge: 'N', color: '#EAB308' },
  { name: 'Calculator', badge: 'C', color: '#EF4444' },
  { name: 'Terminal', badge: 'T', color: '#64748B' },
  { name: 'Files', badge: 'F', color: '#06B6D4' },
];

interface KyrixAppsViewProps {
  editMode?: boolean;
  activeAppNames?: string[];
  showAddModal?: boolean;
  newAppName?: string;
  newAppPath?: string;
  accentColor?: string;
  accentSecondary?: string;
}

/**
 * Exact digital Apps launcher (4x2 square letter-badge cards) with Edit state & Add an app modal.
 */
export const KyrixAppsView: React.FC<KyrixAppsViewProps> = ({
  editMode = false,
  activeAppNames = [],
  showAddModal = false,
  newAppName = 'Notion',
  newAppPath = 'C:\\Program Files\\Notion\\Notion.exe',
  accentColor = '#E05A2B',
  accentSecondary = '#B83E1B',
}) => {
  return (
    <div className="relative p-4">
      {/* Top toolbar matching screenshot */}
      <div className="mb-3 flex items-center justify-between text-[11px]">
        <div>
          {editMode && (
            <span className="rounded-full border border-white/14 bg-white/[0.06] px-3 py-1 text-[#E2E8F0]/85">
              Reset apps
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/14 bg-white/[0.06] px-3 py-1 text-[#E2E8F0]/90">
            + Add app
          </span>
          <span
            className="rounded-full border px-3.5 py-1 font-medium text-white"
            style={
              editMode
                ? {
                    background: `linear-gradient(180deg, ${accentColor}, ${accentSecondary})`,
                    borderColor: 'rgba(255,255,255,0.25)',
                  }
                : {
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderColor: 'rgba(255,255,255,0.14)',
                  }
            }
          >
            {editMode ? 'Done' : 'Edit'}
          </span>
        </div>
      </div>

      {/* Exact 4x2 grid with single-letter rounded app tiles */}
      <div className="grid grid-cols-4 gap-2.5">
        {KYRIX_DEFAULT_APPS.map((app) => {
          const isActive = activeAppNames.includes(app.name);
          return (
            <div
              key={app.name}
              className={`relative flex flex-col items-center justify-center rounded-2xl border py-3 transition-colors ${
                isActive
                  ? 'border-white/35 bg-white/14'
                  : 'border-white/10 bg-black/22'
              }`}
            >
              {editMode && (
                <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#EF4444] text-white">
                  <X className="h-2.5 w-2.5" />
                </span>
              )}
              {isActive && !editMode && (
                <span className="absolute right-2 top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#34D399]/25 text-[#34D399]">
                  <Check className="h-2.5 w-2.5" />
                </span>
              )}
              <div
                className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white shadow"
                style={{ backgroundColor: app.color }}
              >
                {app.badge}
              </div>
              {editMode && (
                <span className="text-[9px] text-[#CBD5E1]/60">tap to edit</span>
              )}
              <span className="text-[11px] font-medium text-[#F8FAFC]">{app.name}</span>
            </div>
          );
        })}
      </div>

      {/* Exact "Add an app" Window Dialog overlay matching reference screenshot */}
      {showAddModal && (
        <div className="absolute left-1/2 top-4 z-30 w-[330px] -translate-x-1/2 overflow-hidden rounded-xl border border-white/18 bg-[#0D1017]/96 text-left shadow-[0_24px_54px_rgba(0,0,0,0.75)]">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-3.5 py-2 text-[11px] text-[#E2E8F0]">
            <span className="font-medium">Add app</span>
            <X className="h-3.5 w-3.5 text-[#CBD5E1]/70" />
          </div>
          <div className="space-y-3 p-4 text-[11px]">
            <div className="text-xs font-semibold text-white">Add an app</div>
            <div>
              <div className="mb-1 text-[10px] text-[#CBD5E1]/75">Name</div>
              <div className="rounded-lg border border-white/14 bg-white/[0.04] px-2.5 py-1.5 text-[#F8FAFC]">
                {newAppName}
              </div>
            </div>
            <div>
              <div className="mb-1 text-[10px] text-[#CBD5E1]/75">
                What to open (app, file, folder, command or web address)
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 truncate rounded-lg border border-white/14 bg-white/[0.04] px-2.5 py-1.5 text-[#CBD5E1]/80">
                  {newAppPath}
                </div>
                <span className="rounded-lg border border-white/14 bg-white/[0.08] px-2.5 py-1.5 text-[#F8FAFC]">
                  Browse...
                </span>
              </div>
            </div>
            <div>
              <div className="mb-1 text-[10px] text-[#CBD5E1]/75">Logo</div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB] text-xs font-bold text-white">
                  {newAppName.charAt(0).toUpperCase() || '?'}
                </span>
                <span className="rounded-lg border border-white/14 bg-white/[0.06] px-2.5 py-1 text-[10px] text-[#F8FAFC]">
                  Upload logo...
                </span>
                <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-[#CBD5E1]/70">
                  Remove logo
                </span>
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-[10px] text-[#CBD5E1]/75">
                Colour (used when there is no logo)
              </div>
              <div className="flex items-center gap-1.5">
                {['#2563EB', '#0284C7', '#22C55E', '#4F46E5', '#EAB308', '#EF4444', '#8B5CF6', '#06B6D4'].map(
                  (c, i) => (
                    <span
                      key={c}
                      className={`h-4 w-4 rounded-full ${
                        i === 0 ? 'ring-2 ring-white' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ),
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <span className="rounded-lg border border-white/14 bg-white/[0.06] px-3 py-1 text-[11px] text-[#E2E8F0]">
                Cancel
              </span>
              <span className="rounded-lg bg-[#2563EB] px-3 py-1 text-[11px] font-medium text-white">
                Save
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const KYRIX_WALLPAPERS = [
  {
    id: 'amber',
    label: 'ChatGPT Image Oct...',
    bg: 'linear-gradient(145deg, #D97706 0%, #7C2D12 58%, #1C1917 100%)',
  },
  {
    id: 'steel',
    label: 'ChatGPT Image Sep...',
    bg: 'linear-gradient(145deg, #E2E8F0 0%, #3B82F6 42%, #0F172A 100%)',
  },
  {
    id: 'grid',
    label: 'Get Things Done Grid',
    bg: 'linear-gradient(145deg, #DC2626 0%, #991B1B 60%, #450A0A 100%)',
  },
  {
    id: 'kyrix',
    label: 'KYRIX',
    bg: 'linear-gradient(155deg, #CBD5E1 0%, #64748B 52%, #334155 100%)',
  },
  {
    id: 'ribbon',
    label: 'Sculpted Silver Rib...',
    bg: 'linear-gradient(145deg, #F8FAFC 0%, #94A3B8 48%, #1E293B 100%)',
  },
];

interface KyrixWallpaperViewProps {
  selectedId?: string;
  accentColor?: string;
  accentSecondary?: string;
}

/**
 * Exact digital Wallpaper gallery matching the 5-card strip in the KYRIX screenshot.
 */
export const KyrixWallpaperView: React.FC<KyrixWallpaperViewProps> = ({
  selectedId = 'kyrix',
  accentColor = '#E05A2B',
  accentSecondary = '#B83E1B',
}) => {
  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/14 bg-white/[0.06] px-3 py-0.5 text-[#E2E8F0]">
            wallpapers
          </span>
          <span
            className="rounded-full px-3 py-0.5 font-medium text-white"
            style={{
              background: `linear-gradient(180deg, ${accentColor}, ${accentSecondary})`,
            }}
          >
            + Add
          </span>
          <span className="text-[#CBD5E1]/70">5 pictures</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full border border-white/14 bg-white/[0.06] px-3 py-0.5 text-[#E2E8F0]">
            Random
          </span>
          <span className="rounded-full border border-white/14 bg-white/[0.06] px-3 py-0.5 text-[#E2E8F0]">
            Next
          </span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2.5">
        {KYRIX_WALLPAPERS.map((wp) => {
          const active = wp.id === selectedId;
          return (
            <div
              key={wp.id}
              className="relative h-[138px] overflow-hidden rounded-2xl border transition-all"
              style={{
                background: wp.bg,
                borderColor: active ? accentColor : 'rgba(255,255,255,0.16)',
                borderWidth: active ? '2px' : '1px',
              }}
            >
              {wp.id === 'grid' && (
                <div className="flex h-full items-center justify-center px-2 text-center text-[8px] font-medium text-white/85">
                  Get things done.
                </div>
              )}
              {active && (
                <span
                  className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  <Check className="h-2.5 w-2.5" />
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-2 py-1.5 text-center text-[9px] font-medium text-white truncate">
                {wp.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface KyrixStatsViewProps {
  accentColor?: string;
}

/**
 * Exact digital Stats view matching the 3 circular gauges + Network/Up/Kyrix footer.
 */
export const KyrixStatsView: React.FC<KyrixStatsViewProps> = ({
  accentColor = '#E05A2B',
}) => {
  const gauges = [
    { label: 'Processor', value: 31, sub: '8 cores · 4.0 GHz' },
    { label: 'Memory', value: 46, sub: '14.7 of 32 GB used' },
    { label: 'Disk', value: 82, sub: '767 of 931 GB used' },
  ];

  const radius = 29;
  const circ = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col justify-between p-5">
      <div className="grid grid-cols-3 gap-4 py-2">
        {gauges.map((g) => {
          const offset = circ * (1 - g.value / 100);
          return (
            <div key={g.label} className="flex flex-col items-center text-center">
              <div className="relative flex h-[72px] w-[72px] items-center justify-center">
                <svg width="72" height="72" className="-rotate-90">
                  <circle
                    cx="36"
                    cy="36"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="5"
                  />
                  <circle
                    cx="36"
                    cy="36"
                    r={radius}
                    fill="none"
                    stroke={accentColor}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circ.toFixed(1)}
                    strokeDashoffset={offset.toFixed(1)}
                  />
                </svg>
                <span className="absolute font-display text-sm font-bold text-[#F8FAFC] tabular-nums">
                  {g.value}%
                </span>
              </div>
              <div className="mt-2 text-xs font-semibold text-[#F8FAFC]">{g.label}</div>
              <div className="text-[10px] text-[#CBD5E1]/65 tabular-nums">{g.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-[#CBD5E1]/75 tabular-nums">
        <div className="flex items-center gap-4">
          <span>Network</span>
          <span className="text-[#F8FAFC]/90">&darr; 2.3 KB/s &nbsp;&uarr; 45.9 KB/s</span>
          <span className="text-[#CBD5E1]/60">Up &nbsp;<strong className="text-[#F8FAFC]">1 d 2 h</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#CBD5E1]/60">Kyrix</span>
          <span className="font-semibold text-[#F8FAFC]">39.9% CPU · 730 MB</span>
        </div>
      </div>
    </div>
  );
};

interface KyrixStyleViewProps {
  subTab?: KyrixStyleSubTab;
  onSelectSubTab?: (tab: KyrixStyleSubTab) => void;
  accentColor?: string;
  accentSecondary?: string;
  tint?: 'pearl' | 'mint' | 'coral' | 'violet' | 'cyan';
  voiceStyle?: 'Silk' | 'Lines' | 'Ribbon' | 'Glow';
  time?: number;
}

/**
 * Exact digital Style panel supporting all 8 real KYRIX customization sub-tabs:
 * Look, Glass, Layout, Motion, Mascot, Voice, Toggles, Icon + Presets + Reset/Save + Live preview.
 */
export const KyrixStyleView: React.FC<KyrixStyleViewProps> = ({
  subTab = 'Look',
  onSelectSubTab,
  accentColor = '#E05A2B',
  accentSecondary = '#B83E1B',
  tint = 'mint',
  voiceStyle = 'Silk',
  time = 68,
}) => {
  const mascotColorHex =
    tint === 'mint'
      ? '#4ADE80'
      : tint === 'coral'
        ? '#E05A2B'
        : tint === 'violet'
          ? '#8B5CF6'
          : tint === 'cyan'
            ? '#22D3EE'
            : '#E2E8F0';

  return (
    <div className="p-4">
      {/* Sub-tabs bar + Reset page */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-1 rounded-full border border-white/10 bg-black/30 px-1.5 py-1 text-[11px]">
          {KYRIX_STYLE_SUBTABS.map((t) => {
            const active = t === subTab;
            const Tag = onSelectSubTab ? 'button' : 'span';
            return (
              <Tag
                key={t}
                type={onSelectSubTab ? 'button' : undefined}
                onClick={onSelectSubTab ? () => onSelectSubTab(t) : undefined}
                className={`rounded-full px-2.5 py-0.5 font-medium whitespace-nowrap transition-colors ${
                  onSelectSubTab ? 'cursor-pointer' : ''
                }`}
                style={
                  active
                    ? {
                        background: `linear-gradient(180deg, ${accentColor}, ${accentSecondary})`,
                        color: '#FFFFFF',
                      }
                    : { color: 'rgba(241,245,249,0.78)' }
                }
              >
                {t}
              </Tag>
            );
          })}
        </div>
        <span className="rounded-full border border-white/14 bg-white/[0.06] px-3 py-1 text-[10px] text-[#E2E8F0] whitespace-nowrap">
          Reset page
        </span>
      </div>

      {/* Presets bar + Save mine */}
      <div className="mt-2 flex items-center justify-between px-2 text-[10px]">
        <div className="flex items-center gap-4 text-[#CBD5E1]/70">
          {KYRIX_STYLE_PRESETS.map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
        <span className="rounded-full border border-white/14 bg-white/[0.06] px-3 py-0.5 text-[10px] text-[#E2E8F0]">
          Save mine
        </span>
      </div>

      {/* Left Sub-Tab Controls + Right Live Preview */}
      <div className="mt-3 grid grid-cols-12 items-start gap-4">
        <div className="col-span-7 space-y-2.5 text-left text-[11px]">
          {subTab === 'Look' && (
            <>
              <div className="flex items-start gap-3">
                <span className="w-20 pt-1 text-[#CBD5E1]/75">Colour</span>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    {KYRIX_LOOK_SWATCHES_ROW1.map((c, idx) => (
                      <span
                        key={idx}
                        className="h-3.5 w-3.5 rounded-full"
                        style={{
                          backgroundColor: c,
                          boxShadow:
                            idx === 8 ? '0 0 0 1.5px #FFFFFF' : undefined,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {KYRIX_LOOK_SWATCHES_ROW2.map((c, idx) => (
                      <span
                        key={idx}
                        className="h-3.5 w-3.5 rounded-full"
                        style={{
                          backgroundColor: c,
                          boxShadow:
                            tint === 'mint' && idx === 3
                              ? '0 0 0 1.5px #FFFFFF'
                              : undefined,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 text-[#CBD5E1]/75">Shade</span>
                <div className="relative h-1.5 flex-1 rounded-full bg-white/14">
                  <div
                    className="h-full w-[57%] rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span className="absolute left-[57%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow" />
                </div>
                <span className="w-12 text-right font-mono-tabular text-[10px] text-[#CBD5E1]/80">
                  57 · true
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 text-[#CBD5E1]/75">Size</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  {(['Small', 'Medium', 'Large', 'XL'] as const).map((sz) => (
                    <span
                      key={sz}
                      className="rounded-full border px-2.5 py-0.5"
                      style={
                        sz === 'Large'
                          ? {
                              backgroundColor: accentColor,
                              borderColor: 'rgba(255,255,255,0.35)',
                              color: '#FFFFFF',
                            }
                          : {
                              borderColor: 'rgba(255,255,255,0.12)',
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              color: '#CBD5E1',
                            }
                      }
                    >
                      {sz}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 text-[#CBD5E1]/75">Corners</span>
                <div className="relative h-1.5 flex-1 rounded-full bg-white/14">
                  <div
                    className="h-full w-[31%] rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span className="absolute left-[31%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow" />
                </div>
                <span className="w-12 text-right font-mono-tabular text-[10px] text-[#CBD5E1]/80">
                  31%
                </span>
              </div>
            </>
          )}

          {subTab === 'Glass' && (
            <>
              {[
                { label: 'Liquid glass', on: true },
                { label: 'Blur behind it', on: true },
                { label: 'Tint with the accent', on: false },
              ].map((sw) => (
                <div key={sw.label} className="flex items-center gap-2.5">
                  <span
                    className="relative inline-flex h-4 w-7 items-center rounded-full px-0.5"
                    style={{
                      backgroundColor: sw.on ? accentColor : 'rgba(255,255,255,0.16)',
                    }}
                  >
                    <span
                      className={`h-3 w-3 rounded-full bg-white transition-transform ${
                        sw.on ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </span>
                  <span className="text-[#E2E8F0]">{sw.label}</span>
                </div>
              ))}
              {[
                { label: 'Opacity', val: '10%' },
                { label: 'Blur', val: '0%' },
                { label: 'Glare', val: '0%' },
                { label: 'Thickness', val: '0%' },
              ].map((sl) => (
                <div key={sl.label} className="flex items-center gap-3">
                  <span className="w-16 text-[#CBD5E1]/75">{sl.label}</span>
                  <div className="h-1 flex-1 rounded-full bg-white/14" />
                  <span className="w-8 text-right font-mono-tabular text-[10px] text-[#CBD5E1]/75">
                    {sl.val}
                  </span>
                </div>
              ))}
            </>
          )}

          {subTab === 'Layout' && (
            <>
              <div className="flex items-center gap-3">
                <span className="w-20 text-[#CBD5E1]/75">Position</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  {(['Left', 'Centre', 'Right'] as const).map((pos) => (
                    <span
                      key={pos}
                      className="rounded-full border px-3 py-0.5"
                      style={
                        pos === 'Centre'
                          ? {
                              backgroundColor: accentColor,
                              borderColor: 'rgba(255,255,255,0.3)',
                              color: '#FFFFFF',
                            }
                          : {
                              borderColor: 'rgba(255,255,255,0.12)',
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              color: '#CBD5E1',
                            }
                      }
                    >
                      {pos}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 text-[#CBD5E1]/75">Left / right</span>
                <div className="relative h-1.5 flex-1 rounded-full bg-white/14">
                  <div
                    className="h-full w-1/2 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </div>
                <span className="w-8 text-right font-mono-tabular text-[10px]">0%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 text-[#CBD5E1]/75">From the top</span>
                <div className="h-1.5 flex-1 rounded-full bg-white/14" />
                <span className="w-8 text-right font-mono-tabular text-[10px]">0 px</span>
              </div>
              <p className="text-[10px] text-[#CBD5E1]/60">
                0 px keeps it attached to the top like a notch.
              </p>
              <div className="flex items-center gap-2.5 pt-0.5">
                <span className="inline-flex h-4 w-7 items-center rounded-full bg-white/18 px-0.5">
                  <span className="h-3 w-3 rounded-full bg-white" />
                </span>
                <span className="text-[#E2E8F0]">Include in screenshots</span>
              </div>
            </>
          )}

          {subTab === 'Motion' && (
            <>
              {[
                { label: 'Animation speed', pct: 45, val: '100%' },
                { label: 'Open delay', pct: 25, val: '220 ms' },
                { label: 'Close delay', pct: 22, val: '380 ms' },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-3">
                  <span className="w-24 text-[#CBD5E1]/75">{m.label}</span>
                  <div className="relative h-1.5 flex-1 rounded-full bg-white/14">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${m.pct}%`, backgroundColor: accentColor }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono-tabular text-[10px]">{m.val}</span>
                </div>
              ))}
              <div className="flex items-center gap-2.5">
                <span
                  className="inline-flex h-4 w-7 items-center justify-end rounded-full px-0.5"
                  style={{ backgroundColor: accentColor }}
                >
                  <span className="h-3 w-3 rounded-full bg-white" />
                </span>
                <span className="text-[#E2E8F0]">Open the dashboard on hover</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-[#CBD5E1]/75">
                <span className="w-24">Fade after</span>
                <span className="rounded-full border border-white/14 px-2 py-0.5">-</span>
                <span className="font-mono-tabular text-white">10 s</span>
                <span className="rounded-full border border-white/14 px-2 py-0.5">+</span>
              </div>
            </>
          )}

          {subTab === 'Mascot' && (
            <>
              <div className="flex items-center gap-3">
                <span className="w-14 text-[#CBD5E1]/75">Shape</span>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                    <span
                      key={idx}
                      className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${
                        idx === 2
                          ? 'bg-white text-[#0F172A] ring-2 ring-[#4ADE80]'
                          : 'bg-white/25 text-white'
                      }`}
                    >
                      {idx === 2 ? '✦' : '•'}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-14 text-[#CBD5E1]/75">Colour</span>
                <div className="flex items-center gap-1.5">
                  {['#F8FAFC', '#F472B6', '#38BDF8', '#4ADE80', '#FACC15', '#A78BFA', '#FB923C', '#EF4444', '#0F172A'].map(
                    (c, i) => (
                      <span
                        key={c}
                        className="h-3.5 w-3.5 rounded-full border border-white/20"
                        style={{
                          backgroundColor: c,
                          boxShadow: i === 3 ? '0 0 0 1.5px #FFFFFF' : undefined,
                        }}
                      />
                    ),
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span
                  className="inline-flex h-4 w-7 items-center justify-end rounded-full px-0.5"
                  style={{ backgroundColor: accentColor }}
                >
                  <span className="h-3 w-3 rounded-full bg-white" />
                </span>
                <span className="text-[#E2E8F0]">Eyes follow the cursor</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span
                  className="inline-flex h-4 w-7 items-center justify-end rounded-full px-0.5"
                  style={{ backgroundColor: accentColor }}
                >
                  <span className="h-3 w-3 rounded-full bg-white" />
                </span>
                <span className="text-[#E2E8F0]">Soft glow</span>
              </div>
            </>
          )}

          {subTab === 'Voice' && (
            <>
              <div className="flex items-center gap-3">
                <span className="w-14 text-[#CBD5E1]/75">Style</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  {(['Silk', 'Lines', 'Ribbon', 'Glow'] as const).map((vs) => (
                    <span
                      key={vs}
                      className="rounded-full border px-2.5 py-0.5"
                      style={
                        vs === voiceStyle
                          ? {
                              backgroundColor: accentColor,
                              borderColor: 'rgba(255,255,255,0.3)',
                              color: '#FFFFFF',
                            }
                          : {
                              borderColor: 'rgba(255,255,255,0.12)',
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              color: '#CBD5E1',
                            }
                      }
                    >
                      {vs}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-14 text-[#CBD5E1]/75">Colour</span>
                <div className="flex items-center gap-1.5">
                  {['#4ADE80', '#6366F1', '#8B5CF6', '#EC4899', '#38BDF8', '#22D3EE', '#FDE047', '#F8FAFC'].map(
                    (c, i) => (
                      <span
                        key={c}
                        className="h-3.5 w-3.5 rounded-full"
                        style={{
                          backgroundColor: c,
                          boxShadow: i === 0 ? '0 0 0 1.5px #FFFFFF' : undefined,
                        }}
                      />
                    ),
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-14 text-[#CBD5E1]/75">Custom</span>
                <div className="h-1.5 flex-1 rounded-full bg-white/14">
                  <div
                    className="h-full w-3/4 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </div>
                <span className="font-mono-tabular text-[10px] text-[#CBD5E1]/80">#8C7CFF</span>
              </div>
              <p className="text-[10px] text-[#CBD5E1]/60">
                Follows the microphone, and KYRIX&apos;s own voice while it speaks.
              </p>
            </>
          )}

          {(subTab === 'Toggles' || subTab === 'Icon') && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
              {[
                { label: 'Captions of speech', on: false },
                { label: 'Private mode', on: false },
                { label: 'Notification cards', on: true },
                { label: 'Speak up on its own', on: true },
                { label: 'Idle bar when resting', on: true },
                { label: 'Offline mode', on: false },
                { label: 'Screen awareness', on: true },
                { label: 'Say "Kyrix" first', on: false },
                { label: 'Notifications', on: true },
                { label: 'Click guides', on: true },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-3.5 w-6 shrink-0 items-center rounded-full px-0.5 ${
                      t.on ? 'justify-end' : 'justify-start'
                    }`}
                    style={{
                      backgroundColor: t.on ? accentColor : 'rgba(255,255,255,0.16)',
                    }}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  </span>
                  <span className="truncate text-[#E2E8F0]">{t.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exact Live Preview Box matching KYRIX's Style screenshot */}
        <div
          className="col-span-5 relative overflow-hidden rounded-2xl border border-white/18 p-3.5"
          style={{
            background:
              'linear-gradient(135deg, #1D4ED8 0%, #7E22CE 48%, #EA580C 100%)',
          }}
        >
          <div className="flex items-center gap-2.5 rounded-xl bg-black/25 px-2.5 py-2">
            <KyrixMascot
              mood="speaking"
              time={time}
              size={34}
              tint={tint}
              className="shrink-0"
            />
            <KyrixSilkWave
              time={time}
              amplitude={12}
              primaryColor={mascotColorHex}
              secondaryColor={accentSecondary}
              className="h-8 flex-1"
            />
          </div>
          <div className="mt-12 text-left text-[10px] font-medium text-white/90">
            Live preview
          </div>
        </div>
      </div>
    </div>
  );
};

interface KyrixWebResultsCardProps {
  query?: string;
  activeFilter?: 'All' | 'Images' | 'Videos' | 'Web' | 'Apps';
  accentColor?: string;
  results?: Array<{
    title: string;
    source: string;
    image: string;
  }>;
}

/**
 * Exact digital recreation of the KYRIX web results card screenshot.
 */
export const KyrixWebResultsCard: React.FC<KyrixWebResultsCardProps> = ({
  query = 'Search the web...',
  activeFilter = 'All',
  accentColor = '#4ADE80',
  results,
}) => {
  const filters: Array<'All' | 'Images' | 'Videos' | 'Web' | 'Apps'> = [
    'All',
    'Images',
    'Videos',
    'Web',
    'Apps',
  ];

  return (
    <div className="w-[720px] overflow-hidden rounded-[20px] border border-white/16 bg-[#0B0D13]/95 p-5 text-left shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
      <div className="mb-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="font-display font-semibold text-[#F8FAFC]">KYRIX</span>
          <span className="text-[#CBD5E1]/55">web results</span>
        </div>
        <span className="text-[11px] text-[#CBD5E1]/50">&times;</span>
      </div>

      <div className="flex items-center gap-2.5 rounded-full border border-white/14 bg-white/[0.04] px-4 py-2 text-xs text-[#F8FAFC]">
        <Search className="h-3.5 w-3.5 text-[#CBD5E1]/65" />
        <span className={query === 'Search the web...' ? 'text-[#CBD5E1]/55' : 'text-[#F8FAFC]'}>
          {query}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] font-medium">
        {filters.map((f) => {
          const active = f === activeFilter;
          return (
            <span
              key={f}
              className="rounded-full px-3 py-1"
              style={
                active
                  ? { backgroundColor: accentColor, color: '#090B10', fontWeight: 600 }
                  : {
                      border: '1px solid rgba(255,255,255,0.12)',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      color: 'rgba(241,245,249,0.78)',
                    }
              }
            >
              {f}
            </span>
          );
        })}
      </div>

      {!results || results.length === 0 ? (
        <p className="mt-4 text-xs text-[#CBD5E1]/65">
          Type a question and press Enter. Results open as a card, not in a browser.
        </p>
      ) : (
        <>
          <div className="mt-3.5 grid grid-cols-3 gap-3">
            {results.map((item) => (
              <div
                key={item.title}
                className="overflow-hidden rounded-xl border border-white/12 bg-white/[0.04]"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#151821]">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-2.5">
                  <div className="truncate text-xs font-semibold text-[#F8FAFC]">{item.title}</div>
                  <div className="mt-0.5 truncate text-[10px] text-[#CBD5E1]/65">{item.source}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2.5 text-[10px] text-[#CBD5E1]/50">
            Results open as a card, not in a browser.
          </p>
        </>
      )}
    </div>
  );
};
