import React from 'react';
import { motion } from 'motion/react';
import { soundManager } from '../utils/audio';
import { GameScreen, MascotId } from '../types/game';
import { MascotCharacter } from './MascotCharacter';
import { ArrowLeft, Play, Sparkles } from 'lucide-react';

interface MiniGameSelectProps {
  activeMascot: MascotId;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedOutfit?: string;
  equippedHandheld?: string;
  onSelectGame: (screen: GameScreen) => void;
  onBack: () => void;
}

interface MiniGameCard {
  id: GameScreen;
  title: string;
  subtitle: string;
  icon: string;
  themeColor: string;
  badge: string;
  description: string;
}

const MINI_GAMES: MiniGameCard[] = [
  {
    id: 'MATCHING_GAME',
    title: 'Cocokkan Angka & Jumlah',
    subtitle: 'Membuka kartu dan menemukan pasangan angka & benda',
    icon: '🃏',
    themeColor: 'from-amber-400 to-orange-500',
    badge: 'Memori & Hitung',
    description: 'Buka dua kartu untuk memasangkan angka 1-8 dengan jumlah buah atau bintang yang pas!',
  },
  {
    id: 'PATTERN_GAME',
    title: 'Kereta Pola & Urutan',
    subtitle: 'Menyusun gerbong kereta dengan bilangan dan pola warna',
    icon: '🚂',
    themeColor: 'from-sky-400 to-indigo-500',
    badge: 'Logika & Pola',
    description: 'Lengkapi gerbong kereta yang hilang dengan balon jawaban yang melompat teratur!',
  },
  {
    id: 'SEARCH_COLLECT',
    title: 'Cari & Kumpulkan Benda',
    subtitle: 'Menemukan buah dan bintang di kebun sesuai instruksi',
    icon: '🧺',
    themeColor: 'from-emerald-400 to-teal-500',
    badge: 'Misi Hitung',
    description: 'Sentuh dan kumpulkan buah atau bintang ke dalam keranjang piknik sesuai target misi!',
  },
  {
    id: 'MULTIPLY_GARDEN',
    title: 'Kebun Perkalian Ramah Anak',
    subtitle: 'Konsep kelompok benda berulang dengan pot bunga mekar',
    icon: '🌻',
    themeColor: 'from-rose-400 to-red-500',
    badge: 'Dasar Perkalian',
    description: 'Belajar perkalian 1-5 dengan konsep kelompok pot bunga dan keranjang madu secara visual!',
  },
  {
    id: 'FAIR_SHARE',
    title: 'Piknik Berbagi Adil',
    subtitle: 'Konsep membagi kue sama rata ke piring teman-teman',
    icon: '🍽️',
    themeColor: 'from-yellow-400 to-amber-500',
    badge: 'Dasar Pembagian',
    description: 'Bagi biskuit, apel, dan wortel ke piring hewan agar semua teman mendapat bagian sama banyak!',
  },
];

export const MiniGameSelect: React.FC<MiniGameSelectProps> = ({
  activeMascot,
  equippedHat,
  equippedGlasses,
  equippedOutfit,
  equippedHandheld,
  onSelectGame,
  onBack,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6">
      {/* Top Bar */}
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

        <div className="text-xs sm:text-sm font-bold text-teal-800 bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-200">
          5 Mini-Game Seru Tersedia!
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 text-white p-6 rounded-3xl shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Mini-Game Interaktif Edukatif</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Pusat Mini-Game Zoraa Math
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-lg">
            Pilih game favoritmu! Setiap game dirancang khusus dengan visual lucu, animasi penuh tawa, dan poin hadiah yang berlimpah!
          </p>
        </div>

        <div className="shrink-0">
          <MascotCharacter
            mascotId={activeMascot}
            mood="happy"
            size="md"
            speechBubbleText="Game mana yang mau kita mainkan duluan?"
            equippedHat={equippedHat}
            equippedGlasses={equippedGlasses}
            equippedOutfit={equippedOutfit}
            equippedHandheld={equippedHandheld}
          />
        </div>
      </div>

      {/* Mini-Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {MINI_GAMES.map(game => (
          <motion.div
            key={game.id}
            whileHover={{ y: -4 }}
            className="bg-white p-5 rounded-3xl border-2 border-teal-200 shadow-sm hover:shadow-md hover:border-teal-400 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                  {game.badge}
                </span>
                <span className="text-2xl">{game.icon}</span>
              </div>

              <h3 className="text-lg font-black text-slate-800 leading-snug">
                {game.title}
              </h3>
              <p className="text-xs font-bold text-teal-600 mt-0.5">
                {game.subtitle}
              </p>

              <p className="text-xs text-slate-500 mt-3 line-clamp-3">
                {game.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  soundManager.playPop(1.3);
                  onSelectGame(game.id);
                }}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Mainkan Game</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
