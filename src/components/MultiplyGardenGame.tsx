import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager, speakText } from '../utils/audio';
import { MascotCharacter } from './MascotCharacter';
import { MascotId } from '../types/game';
import { ArrowLeft, Volume2, Sparkles, RefreshCw } from 'lucide-react';

interface MultiplyGardenGameProps {
  mascotId: MascotId;
  onBack: () => void;
  onAddRewards: (coins: number, stars: number) => void;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedOutfit?: string;
  equippedHandheld?: string;
}

interface MultiplyScenario {
  id: number;
  groups: number; // e.g. 3 pots
  itemsPerGroup: number; // e.g. 2 flowers
  itemEmoji: string;
  groupContainerName: string; // e.g. 'pot bunga'
  itemName: string; // e.g. 'bunga matahari'
  title: string;
  speech: string;
  options: number[];
}

const SCENARIOS: MultiplyScenario[] = [
  {
    id: 1,
    groups: 3,
    itemsPerGroup: 2,
    itemEmoji: '🌻',
    groupContainerName: 'Pot Bunga',
    itemName: 'Bunga Matahari',
    title: '3 Pot dengan Masing-Masing 2 Bunga',
    speech: 'Ada 3 pot bunga. Di setiap pot mekar 2 bunga matahari. Berapa semua bunga matahari? Tiga kali dua sama dengan berapa ya?',
    options: [6, 5, 8],
  },
  {
    id: 2,
    groups: 2,
    itemsPerGroup: 4,
    itemEmoji: '🍯',
    groupContainerName: 'Keranjang',
    itemName: 'Toples Madu',
    title: '2 Keranjang dengan Masing-Masing 4 Madu',
    speech: 'Ada 2 keranjang. Di setiap keranjang ada 4 toples madu. Dua kali empat sama dengan berapa?',
    options: [8, 6, 10],
  },
  {
    id: 3,
    groups: 4,
    itemsPerGroup: 2,
    itemEmoji: '🥕',
    groupContainerName: 'Kantung Sayur',
    itemName: 'Wortel Renyah',
    title: '4 Kantung dengan Masing-Masing 2 Wortel',
    speech: 'Ada 4 kantung. Setiap kantung berisi 2 wortel. Empat kali dua sama dengan berapa?',
    options: [8, 9, 6],
  },
  {
    id: 4,
    groups: 2,
    itemsPerGroup: 3,
    itemEmoji: '🐟',
    groupContainerName: 'Akuarium',
    itemName: 'Ikan Emas',
    title: '2 Akuarium dengan Masing-Masing 3 Ikan',
    speech: 'Ada 2 akuarium. Masing-masing ada 3 ikan emas. Dua kali tiga sama dengan berapa?',
    options: [6, 5, 7],
  },
  {
    id: 5,
    groups: 3,
    itemsPerGroup: 3,
    itemEmoji: '⭐',
    groupContainerName: 'Awan Ajaib',
    itemName: 'Bintang Berkilau',
    title: '3 Awan dengan Masing-Masing 3 Bintang',
    speech: 'Ada 3 awan. Setiap awan punya 3 bintang. Tiga kali tiga sama dengan berapa?',
    options: [9, 6, 12],
  },
];

export const MultiplyGardenGame: React.FC<MultiplyGardenGameProps> = ({
  mascotId,
  onBack,
  onAddRewards,
  equippedHat,
  equippedGlasses,
  equippedOutfit,
  equippedHandheld,
}) => {
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'cheer' | 'thinking'>('idle');
  const [speechBubble, setSpeechBubble] = useState<string>('Hitung jumlah benda di setiap kelompok ya!');
  const [wateredGroups, setWateredGroups] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const scenario = SCENARIOS[currentScenarioIdx];
  const correctAnswer = scenario.groups * scenario.itemsPerGroup;

  const handleWaterGroup = (groupIdx: number) => {
    soundManager.playPop(1.2 + groupIdx * 0.15);
    if (!wateredGroups.includes(groupIdx)) {
      setWateredGroups([...wateredGroups, groupIdx]);
      // Speak the progressive count
      const runningCount = (wateredGroups.length + 1) * scenario.itemsPerGroup;
      speakText(`${runningCount}`);
    }
  };

  const handleSelectOption = (val: number) => {
    if (selectedAnswer !== null) return;

    soundManager.playPop(1.3);
    setSelectedAnswer(val);

    if (val === correctAnswer) {
      // CORRECT!
      setIsCorrect(true);
      soundManager.playCorrect();
      soundManager.playCoin();
      setMascotMood('cheer');
      setSpeechBubble(`Tepat sekali! ${scenario.groups} × ${scenario.itemsPerGroup} = ${correctAnswer}! Bunga bermekaran indah! 🌸✨`);
      setScore(prev => prev + 25);
      onAddRewards(10, 1);

      setTimeout(() => {
        if (currentScenarioIdx < SCENARIOS.length - 1) {
          setCurrentScenarioIdx(prev => prev + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setWateredGroups([]);
          setMascotMood('idle');
          setSpeechBubble('Hebat! Yuk rawat kebun kelompok berikutnya!');
        } else {
          soundManager.playFanfare();
          onAddRewards(30, 2);
          setSpeechBubble('Wah, kamu jago sekali perkalian kelompok benda! 🏆');
        }
      }, 2000);
    } else {
      // WRONG
      setIsCorrect(false);
      soundManager.playWrong();
      setMascotMood('thinking');
      setSpeechBubble(`Hampir pas! Yuk hitung: ada ${scenario.groups} kelompok, masing-masing ada ${scenario.itemsPerGroup}. Coba lagi ya!`);

      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const isCompletedAll = currentScenarioIdx === SCENARIOS.length - 1 && isCorrect === true;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gradient-to-b from-rose-50 to-amber-50 rounded-3xl shadow-sm border border-rose-200">
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
          <div className="text-xs sm:text-sm font-bold text-rose-800 bg-rose-200 px-3 py-1 rounded-xl">
            Tingkat 5: Kelompok {currentScenarioIdx + 1} / {SCENARIOS.length}
          </div>
          <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1 rounded-xl text-sm font-bold border border-amber-300">
            <span>🪙 Poin:</span>
            <span className="tabular-nums">{score}</span>
          </div>
        </div>
      </div>

      {/* Header Info & Mascot */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 bg-white/70 p-4 rounded-2xl border border-rose-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌻</span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              {scenario.title}
            </h2>
            <button
              onClick={() => speakText(scenario.speech)}
              className="p-1.5 text-rose-600 hover:text-rose-800 bg-rose-100 rounded-full hover:bg-rose-200 transition-colors"
              title="Dengarkan Soal"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Konsep Perkalian: {scenario.groups} × {scenario.itemsPerGroup} = (
            {Array.from({ length: scenario.groups }).map((_, i) => (
              <span key={i}>
                {scenario.itemsPerGroup}
                {i < scenario.groups - 1 ? ' + ' : ''}
              </span>
            ))}
            )
          </p>
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

      {/* Visual Equal Groups Garden */}
      <div className="bg-gradient-to-b from-sky-200 to-emerald-100 p-6 rounded-3xl border-3 border-emerald-400 mb-6 shadow-inner relative">
        <div className="text-xs font-bold text-emerald-900 mb-3 bg-white/80 inline-block px-3 py-1 rounded-full shadow-xs">
          💡 Tips: Sentuh tiap pot untuk menyiram dan melihat bunganya mekar!
        </div>

        {/* Pots / Group Containers Grid */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4">
          {Array.from({ length: scenario.groups }).map((_, groupIdx) => {
            const isWatered = wateredGroups.includes(groupIdx);
            return (
              <motion.div
                key={groupIdx}
                onClick={() => handleWaterGroup(groupIdx)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-3xl border-3 flex flex-col items-center justify-center shadow-md cursor-pointer transition-all select-none min-w-[130px] sm:min-w-[150px] ${
                  isWatered
                    ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-300'
                    : 'bg-white/90 border-slate-300 hover:border-amber-400'
                }`}
              >
                <div className="text-xs font-bold text-slate-600 mb-1">
                  {scenario.groupContainerName} {groupIdx + 1}
                </div>

                {/* Items inside this group */}
                <div className="flex items-center justify-center gap-1.5 py-2">
                  {Array.from({ length: scenario.itemsPerGroup }).map((_, itemIdx) => (
                    <motion.span
                      key={itemIdx}
                      animate={isWatered ? { scale: [1, 1.25, 1], rotate: [0, 10, -10, 0] } : {}}
                      transition={{ duration: 0.5, delay: itemIdx * 0.1 }}
                      className="text-3xl sm:text-4xl filter drop-shadow-xs"
                    >
                      {scenario.itemEmoji}
                    </motion.span>
                  ))}
                </div>

                <div className="text-xs font-extrabold text-amber-800 bg-amber-200 px-2.5 py-0.5 rounded-full mt-2 tabular-nums">
                  Isi: {scenario.itemsPerGroup}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Formula Representation for visual clarity */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/95 px-4 py-2 rounded-2xl border-2 border-emerald-400 shadow-sm text-base sm:text-lg font-black text-slate-800">
            <span className="text-rose-600 tabular-nums">{scenario.groups}</span>
            <span className="text-slate-500">kelompok</span>
            <span className="text-slate-400">×</span>
            <span className="text-emerald-600 tabular-nums">{scenario.itemsPerGroup}</span>
            <span className="text-slate-500">buah</span>
            <span className="text-slate-400">=</span>
            <span className="text-amber-600 font-extrabold animate-pulse">?</span>
          </div>
        </div>
      </div>

      {/* Answer Options */}
      <div className="bg-white/80 p-5 rounded-2xl border border-rose-200">
        <h3 className="text-center font-bold text-slate-700 text-sm mb-3">
          Berapa jumlah semua {scenario.itemName}?
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {scenario.options.map((opt, i) => {
            const isSelected = selectedAnswer === opt;
            return (
              <motion.button
                key={i}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleSelectOption(opt)}
                disabled={selectedAnswer !== null}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex flex-col items-center justify-center text-3xl sm:text-4xl font-black shadow-lg border-3 transition-all cursor-pointer relative ${
                  isSelected
                    ? isCorrect
                      ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-300'
                      : 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-300'
                    : 'bg-gradient-to-tr from-rose-300 to-pink-200 text-rose-950 border-rose-400 hover:from-rose-200 hover:to-pink-100'
                }`}
              >
                <span className="tabular-nums filter drop-shadow-xs">{opt}</span>
                <span className="text-[10px] font-bold mt-1 uppercase tracking-wider opacity-75">
                  Pilih
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Finished Banner */}
      <AnimatePresence>
        {isCompletedAll && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-6 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-2xl text-center shadow-lg"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 animate-spin" />
              <h4 className="text-2xl font-black">Luar Biasa! Semua Kelompok Berhasil Dihitung!</h4>
            </div>
            <p className="text-sm font-semibold mb-4 text-rose-100">
              Kamu telah menguasai dasar perkalian ramah anak! Tambahan +30 Koin dan +2 Bintang! 🌟
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setCurrentScenarioIdx(0);
                  setSelectedAnswer(null);
                  setIsCorrect(null);
                  setWateredGroups([]);
                }}
                className="px-5 py-2.5 bg-white text-rose-800 font-bold rounded-xl shadow-md hover:bg-rose-50 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 inline-block mr-1" /> Main Lagi
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onBack();
                }}
                className="px-5 py-2.5 bg-rose-950 text-white font-bold rounded-xl shadow-md hover:bg-black cursor-pointer"
              >
                Kembali ke Menu
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
