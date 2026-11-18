import React from 'react';
import { KyrixCompactNotch, KyrixTabId } from '../KyrixBrand';
import {
  KyrixShellHeader,
  KyrixStyleSubTab,
  KyrixStyleView,
  KyrixWallpaperView,
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
 * Scene 07 (64-76s): Wallpaper Selection + Style Customization + Collapse to Compact Notch.
 * 64.0-67.0s: Wallpaper tab showing 5 gallery items & selecting Sculpted Silver Ribbon.
 * 67.0-72.8s: Style tab stepping through Look -> Glass -> Mascot -> Voice with live preview.
 * 72.8-74.3s: Power collapse smoothly retracts into the compact top-center notch.
 */
export const Scene07Future: React.FC<SceneProps> = ({ time }) => {
  const panelIn = springSettle(rangeProgress(time, 64.0, 64.7));
  const collapse = springSettle(rangeProgress(time, 73.0, 74.2));
  const contentFade = 1 - easeOutQuart(rangeProgress(time, 73.0, 73.55));
  const compactNotchIn = easeOutQuart(rangeProgress(time, 73.75, 74.2));
  const headlineMask = easeOutExpo(rangeProgress(time, 65.0, 66.4));

  const mainTab: KyrixTabId = time < 67.2 ? 'Wallpaper' : 'Style';
  const styleSubTab: KyrixStyleSubTab =
    time < 68.8 ? 'Look' : time < 70.3 ? 'Glass' : time < 71.7 ? 'Mascot' : 'Voice';

  const wallpaperId = time < 65.6 ? 'kyrix' : 'ribbon';
  const isMintPhase = time >= 68.0;
  const accentPrimary = isMintPhase ? '#22C55E' : '#E05A2B';
  const accentSecondary = isMintPhase ? '#15803D' : '#B83E1B';

  const toStyleTab = easeInOutQuart(rangeProgress(time, 66.5, 67.1));
  const toCollapse = easeInOutQuart(rangeProgress(time, 72.0, 72.8));

  const cursorX = 560 + toStyleTab * 14 + toCollapse * 424;
  const cursorY = 175 - toStyleTab * 149 - toCollapse * 2;
  const clickT =
    rangeProgress(time, 65.4, 65.7) ||
    rangeProgress(time, 67.1, 67.4) ||
    rangeProgress(time, 72.7, 73.0);

  const width = 760 - collapse * (760 - 154);
  const height = 368 - collapse * (368 - 50);

  return (
    <WindowsDesktopBase dimmed={0.34 - collapse * 0.14} scale={1.015 - collapse * 0.015}>
      {compactNotchIn > 0.01 && (
        <KyrixCompactNotch
          time={time}
          mood="idle"
          tint={isMintPhase ? 'mint' : 'pearl'}
          widenProgress={0}
          opacity={compactNotchIn}
        />
      )}

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between pb-24">
        {compactNotchIn < 0.99 && (
          <div
            className="liquid-glass overflow-hidden rounded-b-[24px] border-t-0"
            style={{
              width: `${width.toFixed(1)}px`,
              height: `${height.toFixed(1)}px`,
              opacity: panelIn * (1 - compactNotchIn),
              transform: `translateY(${((1 - panelIn) * -18).toFixed(1)}px)`,
            }}
          >
            <div
              className="relative left-1/2 top-0 w-[760px] -translate-x-1/2"
              style={{ opacity: contentFade }}
            >
              <KyrixShellHeader
                activeTab={mainTab}
                accentColor={accentPrimary}
                accentSecondary={accentSecondary}
                micActive={true}
              />

              {mainTab === 'Wallpaper' ? (
                <KyrixWallpaperView
                  selectedId={wallpaperId}
                  accentColor={accentPrimary}
                  accentSecondary={accentSecondary}
                />
              ) : (
                <KyrixStyleView
                  subTab={styleSubTab}
                  accentColor={accentPrimary}
                  accentSecondary={accentSecondary}
                  tint={isMintPhase ? 'mint' : 'coral'}
                  time={time}
                />
              )}
            </div>
          </div>
        )}

        <div className="mt-auto overflow-hidden py-1">
          <h2
            className="max-w-4xl px-6 text-center font-display text-3xl font-semibold tracking-[-0.025em] text-[#FAF8F5] drop-shadow-md sm:text-4xl"
            style={{
              opacity: headlineMask,
              transform: `translateY(${((1 - headlineMask) * 28).toFixed(1)}px)`,
              textWrap: 'balance',
            }}
          >
            Your computer. Your intelligence. Your way.
          </h2>
        </div>
      </div>

      {collapse < 0.7 && (
        <DesktopCursor
          x={cursorX}
          y={cursorY}
          clickProgress={clickT}
          opacity={easeOutQuart(rangeProgress(time, 64.5, 65.0)) * (1 - collapse)}
        />
      )}
    </WindowsDesktopBase>
  );
};
