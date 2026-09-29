import React from 'react';
import { motion } from 'motion/react';
import { soundManager } from '../utils/audio';
import { LevelInfo, DifficultyTier, MascotId } from '../types/game';
import { LEVELS_DATA } from '../data/gameData';
import { MascotCharacter } from './MascotCharacter';
import { ArrowLeft, Lock, Star, Play, Sparkles } from 'lucide-react';

interface LevelSelectProps {
  userStars: number;
  completedLevels: Record<number, { stars: number; highScore: number; completed: boolean }>;
  activeMascot: MascotId;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedOutfit?: string;
  equippedHandheld?: string;
  onSelectLevel: (levelId: number, tier: DifficultyTier) => void;
  onBack: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  userStars,
  completedLevels,
  activeMascot,
  equippedHat,
  equippedGlasses,
  equippedOutfit,
  equippedHandheld,
  onSelectLevel,
  onBack,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <button
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-700 hover:text-slate-900 rounded-xl shadow-xs border border-slate-200 text-sm font-semibold transition-all hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2 bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-2xl border border-amber-300 font-black text-sm shadow-xs">
          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span>Total Bintang Kamu:</span>
          <span className="tabular-nums text-base">{userStars}</span>
        </div>
      </div>

      {/* Hero Intro Banner */}
      <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 text-white p-6 rounded-3xl shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Petualangan Tingkat Belajar Bertahap</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Peta Belajar Matematika Ceria
          </h2>
          <p className="text-xs sm:text-sm text-cyan-100 mt-1 max-w-lg">
            Mulai dari pengenalan angka dasar, lalu tingkatkan kemampuan ke penjumlahan, pengurangan, pola, hingga perkalian dan pembagian ramah anak!
          </p>
        </div>

        <div className="shrink-0">
          <MascotCharacter
            mascotId={activeMascot}
            mood="cheer"
            size="md"
            speechBubbleText="Ayo pilih level yang ingin kamu jelajahi!"
            equippedHat={equippedHat}
            equippedGlasses={equippedGlasses}
            equippedOutfit={equippedOutfit}
            equippedHandheld={equippedHandheld}
          />
        </div>
      </div>

      {/* Levels Pathway Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {LEVELS_DATA.map((lvl, index) => {
          const isUnlocked = userStars >= lvl.requiredStarsToUnlock;
          const levelProgress = completedLevels[lvl.id];
          const starsEarned = levelProgress ? levelProgress.stars : 0;

          return (
            <motion.div
              key={lvl.id}
              whileHover={{ y: isUnlocked ? -4 : 0 }}
              className={`p-5 rounded-3xl border-2 flex flex-col justify-between transition-all relative ${
                isUnlocked
                  ? 'bg-white border-teal-200 shadow-sm hover:shadow-md hover:border-teal-400'
                  : 'bg-slate-100 border-slate-200 opacity-80'
              }`}
            >
              {/* Level Number & World Name */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                    Tingkat {lvl.tier}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < starsEarned
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-2xl shadow-xs shrink-0">
                    {lvl.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 leading-snug">
                      {lvl.title}
                    </h3>
                    <p className="text-xs font-semibold text-teal-600 mt-0.5">
                      {lvl.worldName}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-3 line-clamp-2">
                  {lvl.conceptSubtitle}
                </p>
              </div>

              {/* Action Button / Lock Status */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                {isUnlocked ? (
                  <button
                    onClick={() => {
                      soundManager.playPop(1.3);
                      onSelectLevel(lvl.id, lvl.tier);
                    }}
                    className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{starsEarned > 0 ? 'Main Ulang' : 'Mulai Petualangan'}</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 px-4 bg-slate-200 text-slate-500 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 select-none">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Butuh {lvl.requiredStarsToUnlock} Bintang ⭐</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
