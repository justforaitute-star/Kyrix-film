/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CinemaPlayer } from './components/CinemaPlayer';
import { KeynoteDeck } from './components/KeynoteDeck';
import { PresentationMode } from './components/PresentationHeader';

export default function App() {
  const params =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

  const autostart = params?.get('autostart') === '1';
  const initialMode: PresentationMode = params?.get('mode') === 'slides' ? 'slides' : 'film';
  const parsedTime = Number(params?.get('t') ?? '0');
  const initialTime = Number.isFinite(parsedTime) && parsedTime > 0 ? parsedTime : 0;
  const parsedSlide = Number(params?.get('slide') ?? '5');
  const initialSlide = Number.isFinite(parsedSlide) && parsedSlide >= 1 ? parsedSlide : 5;

  const [mode, setMode] = useState<PresentationMode>(initialMode);
  const [filmAutostart, setFilmAutostart] = useState<boolean>(autostart);

  const handleChangeMode = (next: PresentationMode) => {
    setMode(next);
    if (next === 'film' && mode === 'slides') {
      setFilmAutostart(true);
    }
  };

  if (mode === 'slides') {
    return <KeynoteDeck initialSlide={initialSlide} onChangeMode={handleChangeMode} />;
  }

  return (
    <CinemaPlayer
      autostart={filmAutostart}
      initialTime={initialTime}
      onChangeMode={handleChangeMode}
    />
  );
}

