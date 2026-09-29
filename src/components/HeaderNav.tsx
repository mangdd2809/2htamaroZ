import React, { useState } from 'react';
import { GameScreen } from '../types/game';
import { soundManager } from '../utils/audio';
import { Sparkles, Volume2, VolumeX, Music, Award } from 'lucide-react';

interface HeaderNavProps {
  currentScreen: GameScreen;
  onNavigate: (screen: GameScreen) => void;
  coins: number;
  stars: number;
  playerName: string;
  onOpenCertificate: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentScreen,
  onNavigate,
  coins,
  stars,
  playerName,
  onOpenCertificate,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getIsMuted());
  const [isBgmOn, setIsBgmOn] = useState(soundManager.getIsBgmPlaying());

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
    if (!nextMuted) {
      soundManager.playPop(1.2);
    }
  };

  const toggleMusic = () => {
    soundManager.playClick();
    const state = soundManager.toggleBgm();
    setIsBgmOn(state);
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-sky-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Zone 1: Single text element Brand Wordmark */}
        <button
          onClick={() => {
            soundManager.playClick();
            onNavigate('HOME');
          }}
          className="flex items-center gap-2 cursor-pointer group text-left"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <span className="text-xl">🐸</span>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-teal-800">
              Zoraa Math
            </span>
            <span className="hidden sm:inline-block text-[11px] font-bold text-amber-600 ml-2 bg-amber-100 px-2 py-0.5 rounded-full">
              Hai Zora & Anak Pinter!
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Clean single line) */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-600">
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('HOME');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentScreen === 'HOME'
                ? 'bg-teal-100 text-teal-900 font-extrabold'
                : 'hover:text-teal-700 hover:bg-slate-100'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('LEVEL_SELECT');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentScreen === 'LEVEL_SELECT' || currentScreen === 'QUIZ_PLAY'
                ? 'bg-teal-100 text-teal-900 font-extrabold'
                : 'hover:text-teal-700 hover:bg-slate-100'
            }`}
          >
            Tingkat Kesulitan
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('MINI_GAME_SELECT');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              ['MATCHING_GAME', 'PATTERN_GAME', 'SEARCH_COLLECT', 'MULTIPLY_GARDEN', 'FAIR_SHARE', 'MINI_GAME_SELECT'].includes(currentScreen)
                ? 'bg-teal-100 text-teal-900 font-extrabold'
                : 'hover:text-teal-700 hover:bg-slate-100'
            }`}
          >
            Mini-Game Seru
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('WARDROBE_SHOP');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentScreen === 'WARDROBE_SHOP'
                ? 'bg-teal-100 text-teal-900 font-extrabold'
                : 'hover:text-teal-700 hover:bg-slate-100'
            }`}
          >
            Lemari Kostum
          </button>
        </nav>

        {/* Zone 3: Rewards & Controls */}
        <div className="flex items-center gap-2">
          {/* Stars Pill */}
          <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-xl text-xs font-black border border-amber-200">
            <span className="text-amber-500">⭐</span>
            <span className="tabular-nums">{stars}</span>
          </div>

          {/* Coins Pill */}
          <div className="flex items-center gap-1 bg-yellow-50 text-yellow-950 px-2.5 py-1 rounded-xl text-xs font-black border border-yellow-300">
            <span>🪙</span>
            <span className="tabular-nums">{coins}</span>
          </div>

          {/* Certificate Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenCertificate();
            }}
            className="p-1.5 text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors cursor-pointer"
            title="Sertifikat Juara"
          >
            <Award className="w-4 h-4" />
          </button>

          {/* Music Toggle */}
          <button
            onClick={toggleMusic}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              isBgmOn
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
            title={isBgmOn ? 'Matikan Musik Melodi' : 'Nyalakan Musik Melodi'}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              !isMuted
                ? 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
            title={isMuted ? 'Nyalakan Efek Suara' : 'Matikan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
