import React from 'react';
import { KyrixTabId } from '../KyrixBrand';
import {
  KyrixShellHeader,
  KyrixStatsView,
  KyrixTasksView,
  KyrixTodayView,
} from '../kyrix/KyrixSurfaces';
import {
  easeInOutQuart,
  easeOutExpo,
  easeOutQuart,
  rangeProgress,
  springSettle,
} from '../../film/timeline';
import { DesktopCursor, WindowsDesktopBase } from './WindowsDesktopBase';

interface SceneProps {
  time: number;
}

/**
 * Scene 06 (52-64s): Personal Assistant Showcase across real Today, Tasks, and Stats tabs.
 * 52.0-56.4s: Today dashboard (20:56 clock, Music, 5:00 timer started, OBS offline, Ready).
 * 56.4-60.2s: Cursor clicks Tasks -> shows "No tasks yet" empty state & "+ New task" -> populates tasks.
 * 60.2-64.0s: Cursor clicks Stats -> displays Processor 31%, Memory 46%, Disk 82%, Network & Up gauges.
 */
export const Scene06Assistant: React.FC<SceneProps> = ({ time }) => {
  const panelIn = springSettle(rangeProgress(time, 52.0, 52.9));
  const headlineMask = easeOutExpo(rangeProgress(time, 53.2, 54.6));

  const activeTab: KyrixTabId =
    time < 56.4 ? 'Today' : time < 60.2 ? 'Tasks' : 'Stats';

  // Timer interaction in Today
  const timerRunning = time >= 54.2 && time < 56.4;
  const remainingSecs = timerRunning ? Math.max(0, 300 - Math.floor(time - 54.2)) : 300;
  const mins = Math.floor(remainingSecs / 60);
  const secs = remainingSecs % 60;
  const timerDisplay = `${mins}:${String(secs).padStart(2, '0')}`;

  // Tasks empty -> populated transition
  const tasksPopulated = time >= 58.1;

  // Cursor glides across Today -> Tasks -> "+ New task" -> Stats
  const toTasks = easeInOutQuart(rangeProgress(time, 55.6, 56.3));
  const toNewTask = easeInOutQuart(rangeProgress(time, 57.0, 57.8));
  const toStats = easeInOutQuart(rangeProgress(time, 59.3, 60.1));

  const cursorX = 560 - toTasks * 200 + toNewTask * 20 + toStats * 205;
  const cursorY = 250 - toTasks * 224 + toNewTask * 235 - toStats * 235;
  const clickProgress =
    rangeProgress(time, 56.2, 56.5) ||
    rangeProgress(time, 57.8, 58.15) ||
    rangeProgress(time, 60.05, 60.4);

  return (
    <WindowsDesktopBase dimmed={0.34} scale={1.015}>
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between pb-24">
        <div
          className="liquid-glass w-[780px] overflow-hidden rounded-b-[24px] border-t-0"
          style={{
            opacity: panelIn,
            transform: `translateY(${((1 - panelIn) * -18).toFixed(1)}px)`,
          }}
        >
          <KyrixShellHeader activeTab={activeTab} />

          {activeTab === 'Today' && (
            <KyrixTodayView
              timerDisplay={timerDisplay}
              timerActive={timerRunning}
            />
          )}

          {activeTab === 'Tasks' && (
            <KyrixTasksView mode={tasksPopulated ? 'populated' : 'empty'} />
          )}

          {activeTab === 'Stats' && <KyrixStatsView />}
        </div>

        <div className="overflow-hidden py-1">
          <h2
            className="font-display text-3xl font-semibold tracking-[-0.02em] text-[#FAF8F5] drop-shadow-md"
            style={{
              opacity: headlineMask,
              transform: `translateY(${((1 - headlineMask) * 28).toFixed(1)}px)`,
            }}
          >
            More than an assistant. A smarter way to work.
          </h2>
        </div>
      </div>

      <DesktopCursor
        x={cursorX}
        y={cursorY}
        clickProgress={clickProgress}
        opacity={easeOutQuart(rangeProgress(time, 53.0, 53.5))}
      />
    </WindowsDesktopBase>
  );
};
