import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager, speakText } from '../utils/audio';
import { MascotCharacter } from './MascotCharacter';
import { MascotId } from '../types/game';
import { ArrowLeft, Volume2, Sparkles, RefreshCw } from 'lucide-react';

interface SearchCollectGameProps {
  mascotId: MascotId;
  onBack: () => void;
  onAddRewards: (coins: number, stars: number) => void;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedOutfit?: string;
  equippedHandheld?: string;
}

interface ItemOnField {
  id: number;
  emoji: string;
  name: string;
  x: number; // percentage 10 - 85
  y: number; // percentage 15 - 80
  size: number;
  isCollected: boolean;
}

interface Mission {
  targetEmoji: string;
  targetName: string;
  targetCount: number;
  story: string;
  mascotPrompt: string;
}

const MISSIONS: Mission[] = [
  {
    targetEmoji: '🍎',
    targetName: 'Apel Merah',
    targetCount: 5,
    story: 'Kumpulkan 5 apel merah manis untuk pesta piknik!',
    mascotPrompt: 'Bantu aku memetik 5 Apel Merah ya! Sentuh apelnya satu per satu.',
  },
  {
    targetEmoji: '🥕',
    targetName: 'Wortel Segar',
    targetCount: 4,
    story: 'Cari 4 wortel renyah di kebun sayur!',
    mascotPrompt: 'Ayo cari 4 Wortel Segar untuk bekal bermain!',
  },
  {
    targetEmoji: '⭐',
    targetName: 'Bintang Emas',
    targetCount: 6,
    story: 'Kumpulkan 6 bintang ajaib yang jatuh di rumput!',
    mascotPrompt: 'Wah ada bintang jatuh! Ayo kumpulkan 6 Bintang Emas!',
  },
  {
    targetEmoji: '🍯',
    targetName: 'Toples Madu',
    targetCount: 3,
    story: 'Temukan 3 toples madu manis untuk sarapan!',
    mascotPrompt: 'Boni lapar nih! Bantu temukan 3 Toples Madu ya!',
  },
  {
    targetEmoji: '🍓',
    targetName: 'Stroberi Manis',
    targetCount: 7,
    story: 'Petik 7 buah stroberi merah yang ranum!',
    mascotPrompt: 'Ada stroberi lezat! Ayo petik 7 buah stroberi!',
  },
];

export const SearchCollectGame: React.FC<SearchCollectGameProps> = ({
  mascotId,
  onBack,
  onAddRewards,
  equippedHat,
  equippedGlasses,
  equippedOutfit,
  equippedHandheld,
}) => {
  const [missionIndex, setMissionIndex] = useState(0);
  const [fieldItems, setFieldItems] = useState<ItemOnField[]>([]);
  const [collectedCount, setCollectedCount] = useState(0);
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'cheer' | 'thinking'>('idle');
  const [speechBubble, setSpeechBubble] = useState<string>('');
  const [isMissionComplete, setIsMissionComplete] = useState(false);
  const [score, setScore] = useState(0);

  const mission = MISSIONS[missionIndex];

  // Initialize meadow field items
  const setupField = (currMission: Mission) => {
    const distractors = ['🌸', '🍄', '🍪', '🎈', '🌼', '🍀'];
    const items: ItemOnField[] = [];
    let idCounter = 1;

    // Add target items (more than targetCount to allow easy finding, e.g. target + 2)
    const totalTargets = currMission.targetCount + 2;
    for (let i = 0; i < totalTargets; i++) {
      items.push({
        id: idCounter++,
        emoji: currMission.targetEmoji,
        name: currMission.targetName,
        x: Math.floor(Math.random() * 75) + 10,
        y: Math.floor(Math.random() * 65) + 15,
        size: Math.floor(Math.random() * 12) + 36, // 36 - 48px
        isCollected: false,
      });
    }

    // Add distractors
    for (let i = 0; i < 8; i++) {
      const dist = distractors[i % distractors.length];
      items.push({
        id: idCounter++,
        emoji: dist,
        name: 'Benda Lain',
        x: Math.floor(Math.random() * 80) + 8,
        y: Math.floor(Math.random() * 65) + 15,
        size: Math.floor(Math.random() * 10) + 32,
        isCollected: false,
      });
    }

    // Shuffle layout
    setFieldItems(items.sort(() => 0.5 - Math.random()));
    setCollectedCount(0);
    setIsMissionComplete(false);
    setMascotMood('idle');
    setSpeechBubble(currMission.mascotPrompt);
  };

  useEffect(() => {
    setupField(mission);
  }, [missionIndex]);

  const handleTapItem = (item: ItemOnField) => {
    if (item.isCollected || isMissionComplete) return;

    if (item.emoji === mission.targetEmoji) {
      // Correct item!
      const nextCount = collectedCount + 1;
      soundManager.playPop(1.0 + nextCount * 0.1);
      speakText(`${nextCount}`);

      setFieldItems(prev =>
        prev.map(i => (i.id === item.id ? { ...i, isCollected: true } : i))
      );
      setCollectedCount(nextCount);
      setScore(prev => prev + 10);
      onAddRewards(3, 0);

      if (nextCount < mission.targetCount) {
        setMascotMood('happy');
        setSpeechBubble(`Dapat ${nextCount}! Kurang ${mission.targetCount - nextCount} lagi! 👍`);
      } else {
        // MISSION COMPLETE!
        setIsMissionComplete(true);
        soundManager.playCorrect();
        soundManager.playFanfare();
        setMascotMood('cheer');
        setSpeechBubble(`Luar biasa! ${mission.targetCount} ${mission.targetName} sudah terkumpul semua! 🧺✨`);
        onAddRewards(15, 1);
      }
    } else {
      // Wrong item
      soundManager.playWrong();
      setMascotMood('thinking');
      setSpeechBubble(`Itu ${item.emoji}, yang kita cari adalah ${mission.targetEmoji} ${mission.targetName} ya!`);
    }
  };

  const handleNextMission = () => {
    soundManager.playClick();
    if (missionIndex < MISSIONS.length - 1) {
      setMissionIndex(prev => prev + 1);
    } else {
      setMissionIndex(0); // Loop back
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gradient-to-b from-emerald-100 to-sky-100 rounded-3xl shadow-sm border border-emerald-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2 mb-4">
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

        <div className="flex items-center gap-3">
          <div className="text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-200 px-3 py-1 rounded-xl">
            Misi {missionIndex + 1} / {MISSIONS.length}
          </div>
          <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1 rounded-xl text-sm font-bold border border-amber-300">
            <span>🪙 Poin:</span>
            <span className="tabular-nums">{score}</span>
          </div>
        </div>
      </div>

      {/* Mission Banner & Mascot */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 bg-white/70 p-4 rounded-2xl border border-emerald-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧺</span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              Cari & Kumpulkan Benda
            </h2>
            <button
              onClick={() => speakText(mission.mascotPrompt)}
              className="p-1.5 text-emerald-600 hover:text-emerald-800 bg-emerald-100 rounded-full hover:bg-emerald-200 transition-colors"
              title="Dengarkan Suara"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            {mission.story}
          </p>

          {/* Progress Tracker Pill */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm font-bold bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-xs">
              <span className="text-xl">{mission.targetEmoji}</span>
              <span className="text-slate-700">Terkumpul:</span>
              <span className="text-emerald-600 font-extrabold text-base tabular-nums">
                {collectedCount} / {mission.targetCount}
              </span>
            </div>
            {/* Basket icons */}
            <div className="flex gap-1">
              {Array.from({ length: mission.targetCount }).map((_, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm border ${
                    i < collectedCount
                      ? 'bg-emerald-200 border-emerald-500 scale-105'
                      : 'bg-slate-100 border-slate-300 text-slate-300'
                  }`}
                >
                  {i < collectedCount ? mission.targetEmoji : '○'}
                </div>
              ))}
            </div>
          </div>
        </div>

        <MascotCharacter
          mascotId={mascotId}
          mood={mascotMood}
          size="sm"
          speechBubbleText={speechBubble}
          equippedHat={equippedHat}
          equippedGlasses={equippedGlasses}
          equippedOutfit={equippedOutfit}
          equippedHandheld={equippedHandheld}
        />
      </div>

      {/* Interactive Meadow Canvas */}
      <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-sky-200 via-emerald-100 to-emerald-300 rounded-3xl border-3 border-emerald-400 overflow-hidden shadow-inner select-none p-4">
        {/* Decorative Nature Props */}
        <div className="absolute top-2 left-6 text-2xl opacity-60">☁️</div>
        <div className="absolute top-4 right-12 text-3xl opacity-60">☁️</div>
        <div className="absolute bottom-2 left-4 text-3xl opacity-40">🌿</div>
        <div className="absolute bottom-3 right-6 text-3xl opacity-40">🌱</div>

        {/* Picnic Basket target indicator at bottom right */}
        <div className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-2xl border-2 border-amber-300 shadow-md flex items-center gap-2 pointer-events-none z-10">
          <span className="text-3xl">🧺</span>
          <div className="text-xs font-bold text-amber-900">
            <div>Keranjang Piknik</div>
            <div className="text-emerald-600 font-extrabold text-sm tabular-nums">
              {collectedCount} {mission.targetName}
            </div>
          </div>
        </div>

        {/* Floating Items scattered in meadow */}
        {fieldItems.map(item => {
          if (item.isCollected) return null;
          return (
            <motion.button
              key={item.id}
              onClick={() => handleTapItem(item)}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.85 }}
              animate={{
                y: [0, -6, 0],
                rotate: [0, 4, -4, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5 + (item.id % 3) * 0.5,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                left: `${item.x}%`,
                top: `${item.y}%`,
                fontSize: `${item.size}px`,
              }}
              className="cursor-pointer filter drop-shadow-md select-none transition-transform hover:z-20"
              title={item.name}
            >
              {item.emoji}
            </motion.button>
          );
        })}
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {isMissionComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-6 p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl text-center shadow-lg border-2 border-emerald-300"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 animate-spin text-yellow-300" />
              <h3 className="text-2xl font-black">
                Misi Berhasil! Keranjang Sudah Penuh!
              </h3>
            </div>
            <p className="text-sm font-semibold mb-4 text-emerald-100">
              Kamu telah mengumpulkan semua {mission.targetCount} {mission.targetName}! Kamu dapat +15 Koin dan +1 Bintang! ⭐
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleNextMission}
                className="px-6 py-2.5 bg-yellow-400 text-yellow-950 font-black rounded-xl shadow-md hover:bg-yellow-300 cursor-pointer transition-transform hover:scale-105"
              >
                Misi Selanjutnya ➔
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setupField(mission);
                }}
                className="px-4 py-2.5 bg-white text-emerald-800 font-bold rounded-xl shadow-md hover:bg-emerald-50 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 inline-block mr-1" /> Ulangi
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
