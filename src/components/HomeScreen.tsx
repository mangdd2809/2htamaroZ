import React from 'react';
import { motion } from 'motion/react';
import { soundManager, speakText } from '../utils/audio';
import { GameScreen, MascotId } from '../types/game';
import { MascotCharacter } from './MascotCharacter';
import { MASCOTS } from '../data/gameData';
import { Play, Sparkles, Volume2, Award, ShoppingBag, Star, Flame } from 'lucide-react';

interface HomeScreenProps {
  playerName: string;
  coins: number;
  stars: number;
  highestStreak: number;
  activeMascot: MascotId;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedOutfit?: string;
  equippedHandheld?: string;
  onNavigate: (screen: GameScreen) => void;
  onOpenCertificate: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  playerName,
  coins,
  stars,
  highestStreak,
  activeMascot,
  equippedHat,
  equippedGlasses,
  equippedOutfit,
  equippedHandheld,
  onNavigate,
  onOpenCertificate,
}) => {
  const currentMascot = MASCOTS[activeMascot] || MASCOTS.zora;

  const handleSpeakGreeting = () => {
    soundManager.playPop(1.2);
    speakText(`Halo ${playerName || 'Zora'} dan anak-anak pinter lainnya! Selamat datang di Zoraa Math! Ayo kita belajar matematika sambil bermain seru!`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg border-2 border-teal-400">
        {/* Decorative Floating Clouds and Stars */}
        <div className="absolute top-2 left-6 text-3xl opacity-30 select-none pointer-events-none">☁️</div>
        <div className="absolute top-4 right-16 text-4xl opacity-30 select-none pointer-events-none">☁️</div>
        <div className="absolute bottom-2 left-1/3 text-2xl opacity-40 select-none pointer-events-none">⭐</div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-3 max-w-xl">
            {/* Friendly Greeting Tag */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black text-yellow-200 shadow-xs">
              <Sparkles className="w-4 h-4" />
              <span>Hai {playerName || 'Zora'} & Anak-Anak Pinter! 👋</span>
              <button
                onClick={handleSpeakGreeting}
                className="ml-1 p-1 bg-yellow-400 text-teal-900 rounded-full hover:bg-yellow-300 transition-colors cursor-pointer"
                title="Dengarkan Sapaan"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Selamat Datang di <span className="text-yellow-300">Zoraa Math</span>!
            </h1>

            <p className="text-sm sm:text-base text-teal-50 font-medium leading-relaxed">
              Belajar matematika jadi sangat menyenangkan bersama Zora dan sahabat-sahabat lucu! Hitung benda, selesaikan pola, pecahkan teka-teki, dan kumpulkan poin hadiahnya!
            </p>

            {/* Quick Stats Pill Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-extrabold">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>{stars} Bintang Juara</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-extrabold">
                <span className="text-base">🪙</span>
                <span>{coins} Koin Emas</span>
              </div>
              {highestStreak > 0 && (
                <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-extrabold">
                  <Flame className="w-4 h-4 fill-orange-400 text-orange-400" />
                  <span>Rekor {highestStreak} Beruntun!</span>
                </div>
              )}
            </div>
          </div>

          {/* Featured Animated Mascot */}
          <div className="flex flex-col items-center shrink-0">
            <MascotCharacter
              mascotId={activeMascot}
              mood="cheer"
              size="lg"
              speechBubbleText={`Hai Zora! Ayo main bareng ${currentMascot.name}!`}
              equippedHat={equippedHat}
              equippedGlasses={equippedGlasses}
              equippedOutfit={equippedOutfit}
              equippedHandheld={equippedHandheld}
            />
            <div className="mt-2 text-center">
              <span className="text-xs font-black text-teal-100 bg-teal-800/40 px-3 py-1 rounded-full">
                Maskot: {currentMascot.name} ({currentMascot.species})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Hub Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Peta Tingkat Belajar Bertingkat */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-3xl border-2 border-teal-200 shadow-sm hover:shadow-md hover:border-teal-400 flex flex-col justify-between transition-all"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-3xl mb-4 shadow-xs">
              🗺️
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-1">
              Peta Tingkat Belajar
            </h3>
            <p className="text-xs font-semibold text-teal-600 mb-2">
              Level 1 sampai 6 Bertingkat
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mulai dari mengenal angka 1-10, penjumlahan, pengurangan, pola, hingga perkalian dan pembagian ramah anak.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                soundManager.playPop(1.3);
                onNavigate('LEVEL_SELECT');
              }}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-102"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Mulai Belajar</span>
            </button>
          </div>
        </motion.div>

        {/* Card 2: 5 Mini-Game Seru */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-3xl border-2 border-amber-200 shadow-sm hover:shadow-md hover:border-amber-400 flex flex-col justify-between transition-all"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl mb-4 shadow-xs">
              🎮
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-1">
              5 Mini-Game Edukatif
            </h3>
            <p className="text-xs font-semibold text-amber-600 mb-2">
              Cocokkan, Pola, Cari Benda & Kebun
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mainkan game kartu memori angka, kereta pola bilangan, misi mencari buah di kebun, dan kebun bunga perkalian!
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                soundManager.playPop(1.3);
                onNavigate('MINI_GAME_SELECT');
              }}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-102"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Pilih Mini-Game</span>
            </button>
          </div>
        </motion.div>

        {/* Card 3: Lemari Kostum & Hadiah */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-3xl border-2 border-purple-200 shadow-sm hover:shadow-md hover:border-purple-400 flex flex-col justify-between transition-all"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-3xl mb-4 shadow-xs">
              👗
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-1">
              Lemari Kostum & Toko
            </h3>
            <p className="text-xs font-semibold text-purple-600 mb-2">
              Kustomisasi Topi, Kacamata & Jubah
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tukarkan koin emas hasil belajarmu dengan mahkota berkilau, kacamata keren, jubah terbang, dan aksesoris seru!
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                soundManager.playPop(1.3);
                onNavigate('WARDROBE_SHOP');
              }}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-102"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buka Lemari Kostum</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Diploma Certificate Banner */}
      <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-5 rounded-3xl border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white text-amber-600 flex items-center justify-center text-2xl shadow-xs border border-amber-200 shrink-0">
            🏆
          </div>
          <div>
            <h4 className="text-base font-black text-amber-950">
              Sertifikat Bintang Juara Matematika
            </h4>
            <p className="text-xs text-amber-800">
              Cetak piagam penghargaan resmi dengan nama {playerName || 'Zora'} dan jumlah bintang yang kamu kumpulkan!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onOpenCertificate();
          }}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 shrink-0"
        >
          <Award className="w-4 h-4" />
          <span>Lihat Sertifikat 📜</span>
        </button>
      </div>
    </div>
  );
};
