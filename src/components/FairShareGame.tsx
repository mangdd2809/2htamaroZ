import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager, speakText } from '../utils/audio';
import { MascotCharacter } from './MascotCharacter';
import { MascotId } from '../types/game';
import { ArrowLeft, Volume2, Sparkles, RefreshCw } from 'lucide-react';

interface FairShareGameProps {
  mascotId: MascotId;
  onBack: () => void;
  onAddRewards: (coins: number, stars: number) => void;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedOutfit?: string;
  equippedHandheld?: string;
}

interface ShareProblem {
  id: number;
  totalItems: number;
  numPlates: number;
  itemEmoji: string;
  itemName: string;
  friendEmojis: string[];
  friendNames: string[];
  title: string;
  speech: string;
  options: number[];
}

const PROBLEMS: ShareProblem[] = [
  {
    id: 1,
    totalItems: 6,
    numPlates: 2,
    itemEmoji: '🍪',
    itemName: 'Kue Biskuit',
    friendEmojis: ['🐱', '🐰'],
    friendNames: ['Kucing', 'Kelinci'],
    title: 'Bagi 6 Biskuit ke 2 Teman',
    speech: 'Ada 6 biskuit lezat. Dibagikan sama rata ke 2 piring teman kita. Berapa biskuit yang didapat masing-masing piring?',
    options: [3, 2, 4],
  },
  {
    id: 2,
    totalItems: 4,
    numPlates: 2,
    itemEmoji: '🥕',
    itemName: 'Wortel Renyah',
    friendEmojis: ['🐰', '🐹'],
    friendNames: ['Kelinci Putih', 'Marmut'],
    title: 'Bagi 4 Wortel ke 2 Teman',
    speech: 'Ada 4 wortel renyah. Dibagi adil untuk 2 teman. Berapa wortel per teman? Empat dibagi dua sama dengan berapa?',
    options: [2, 1, 3],
  },
  {
    id: 3,
    totalItems: 8,
    numPlates: 2,
    itemEmoji: '🍎',
    itemName: 'Apel Manis',
    friendEmojis: ['🐻', '🐼'],
    friendNames: ['Beruang', 'Panda'],
    title: 'Bagi 8 Apel ke 2 Teman',
    speech: 'Ada 8 apel manis. Beruang dan panda ingin berbagi sama rata. Berapa apel untuk setiap teman? Delapan dibagi dua.',
    options: [4, 3, 5],
  },
  {
    id: 4,
    totalItems: 6,
    numPlates: 3,
    itemEmoji: '🍓',
    itemName: 'Stroberi Merah',
    friendEmojis: ['🐱', '🐶', '🐰'],
    friendNames: ['Mimi', 'Dogi', 'Cici'],
    title: 'Bagi 6 Stroberi ke 3 Teman',
    speech: 'Ada 6 stroberi manis untuk 3 teman. Berapa stroberi per orang agar adil? Enam dibagi tiga.',
    options: [2, 3, 1],
  },
  {
    id: 5,
    totalItems: 9,
    numPlates: 3,
    itemEmoji: '🐟',
    itemName: 'Ikan Segar',
    friendEmojis: ['🐧', '🐧', '🐧'],
    friendNames: ['Piko', 'Pepi', 'Palu'],
    title: 'Bagi 9 Ikan ke 3 Penguin',
    speech: 'Ada 9 ikan segar untuk 3 penguin kecil. Sembilan dibagi tiga sama dengan berapa ya?',
    options: [3, 2, 4],
  },
];

export const FairShareGame: React.FC<FairShareGameProps> = ({
  mascotId,
  onBack,
  onAddRewards,
  equippedHat,
  equippedGlasses,
  equippedOutfit,
  equippedHandheld,
}) => {
  const [problemIdx, setProblemIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'cheer' | 'thinking'>('idle');
  const [speechBubble, setSpeechBubble] = useState<string>('Bagi sama rata ke piring ya!');
  const [score, setScore] = useState(0);

  const problem = PROBLEMS[problemIdx];
  const sharePerPlate = problem.totalItems / problem.numPlates;

  const handleSelectOption = (ans: number) => {
    if (selectedAnswer !== null) return;

    soundManager.playPop(1.3);
    setSelectedAnswer(ans);

    if (ans === sharePerPlate) {
      // CORRECT!
      setIsCorrect(true);
      soundManager.playCorrect();
      soundManager.playCoin();
      setMascotMood('cheer');
      setSpeechBubble(`Adil sekali! Setiap teman dapat ${sharePerPlate} ${problem.itemName}! ${problem.totalItems} ÷ ${problem.numPlates} = ${sharePerPlate}! 🎉`);
      setScore(prev => prev + 25);
      onAddRewards(10, 1);

      setTimeout(() => {
        if (problemIdx < PROBLEMS.length - 1) {
          setProblemIdx(prev => prev + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setMascotMood('idle');
          setSpeechBubble('Hebat! Ayo bantu teman berikutnya berbagi makanan!');
        } else {
          soundManager.playFanfare();
          onAddRewards(35, 2);
          setSpeechBubble('Luar biasa! Kamu adalah sahabat paling adil dan pintar! 🏆');
        }
      }, 2000);
    } else {
      // WRONG
      setIsCorrect(false);
      soundManager.playWrong();
      setMascotMood('thinking');
      setSpeechBubble(`Hampir pas! Kalau dibagi rata ke ${problem.numPlates} piring, berapa ya yang didapat masing-masing?`);

      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const isCompletedAll = problemIdx === PROBLEMS.length - 1 && isCorrect === true;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gradient-to-b from-yellow-50 to-amber-100 rounded-3xl shadow-sm border border-yellow-200">
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
          <div className="text-xs sm:text-sm font-bold text-amber-900 bg-amber-200 px-3 py-1 rounded-xl">
            Tingkat 6: Berbagi {problemIdx + 1} / {PROBLEMS.length}
          </div>
          <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1 rounded-xl text-sm font-bold border border-amber-300">
            <span>🪙 Poin:</span>
            <span className="tabular-nums">{score}</span>
          </div>
        </div>
      </div>

      {/* Header Info & Mascot */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 bg-white/70 p-4 rounded-2xl border border-yellow-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧺</span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              {problem.title}
            </h2>
            <button
              onClick={() => speakText(problem.speech)}
              className="p-1.5 text-amber-700 hover:text-amber-900 bg-amber-200 rounded-full hover:bg-amber-300 transition-colors"
              title="Dengarkan Soal"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Konsep Pembagian: {problem.totalItems} ÷ {problem.numPlates} = Berbagi sama banyak ke {problem.numPlates} teman
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

      {/* Visual Picnic Sharing Table */}
      <div className="bg-gradient-to-b from-amber-100 to-orange-100 p-6 rounded-3xl border-3 border-amber-400 mb-6 shadow-inner relative">
        {/* Total Available in the center basket */}
        <div className="text-center mb-6">
          <div className="inline-block bg-white/95 px-5 py-2.5 rounded-2xl border-2 border-amber-300 shadow-md">
            <div className="text-xs font-bold text-slate-500 mb-1">
              Total {problem.itemName} Yang Akan Dibagi:
            </div>
            <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-sm mx-auto py-1">
              {Array.from({ length: problem.totalItems }).map((_, i) => (
                <span key={i} className="text-3xl filter drop-shadow-xs animate-bounce" style={{ animationDelay: `${i * 0.08}s` }}>
                  {problem.itemEmoji}
                </span>
              ))}
            </div>
            <div className="text-sm font-extrabold text-amber-800 mt-1 tabular-nums">
              Ada {problem.totalItems} buah
            </div>
          </div>
        </div>

        {/* Plates for each friend */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {Array.from({ length: problem.numPlates }).map((_, pIdx) => (
            <motion.div
              key={pIdx}
              whileHover={{ scale: 1.03 }}
              className="w-36 sm:w-44 bg-white/90 p-4 rounded-3xl border-3 border-amber-300 shadow-md flex flex-col items-center justify-center text-center select-none"
            >
              <div className="text-3xl mb-1 filter drop-shadow-xs">
                {problem.friendEmojis[pIdx]}
              </div>
              <div className="text-xs font-bold text-slate-700">
                {problem.friendNames[pIdx]}
              </div>

              {/* Plate surface */}
              <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-full bg-amber-50 border-3 border-amber-200 shadow-inner mt-2 flex flex-wrap items-center justify-center p-2 gap-1">
                {selectedAnswer === sharePerPlate ? (
                  // Show items shared equally when correctly answered!
                  Array.from({ length: sharePerPlate }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-2xl filter drop-shadow-xs"
                    >
                      {problem.itemEmoji}
                    </motion.span>
                  ))
                ) : (
                  <span className="text-slate-400 text-xs font-bold">
                    Piring {pIdx + 1}
                  </span>
                )}
              </div>

              <div className="text-xs font-extrabold text-amber-900 mt-2">
                Dapat: <span className="text-base text-amber-600 tabular-nums">{selectedAnswer === sharePerPlate ? sharePerPlate : '?'}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Division Equation */}
        <div className="mt-5 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-2xl border border-amber-300 shadow-xs text-base sm:text-lg font-black text-slate-800">
            <span className="text-amber-700 tabular-nums">{problem.totalItems}</span>
            <span className="text-slate-400">÷</span>
            <span className="text-sky-600 tabular-nums">{problem.numPlates}</span>
            <span className="text-slate-400">=</span>
            <span className="text-emerald-600 font-extrabold animate-pulse">?</span>
          </div>
        </div>
      </div>

      {/* Answer Options */}
      <div className="bg-white/80 p-5 rounded-2xl border border-amber-200">
        <h3 className="text-center font-bold text-slate-700 text-sm mb-3">
          Berapa {problem.itemName} yang didapat setiap piring?
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {problem.options.map((opt, i) => {
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
                    : 'bg-gradient-to-tr from-amber-300 to-yellow-200 text-amber-950 border-amber-400 hover:from-amber-200 hover:to-yellow-100'
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
            className="mt-6 p-6 bg-gradient-to-r from-amber-500 to-yellow-400 text-white rounded-2xl text-center shadow-lg"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 animate-spin" />
              <h4 className="text-2xl font-black">Luar Biasa! Semua Makanan Terbagi Rata & Adil!</h4>
            </div>
            <p className="text-sm font-semibold mb-4 text-amber-950">
              Kamu telah menguasai konsep pembagian ramah anak! Tambahan +35 Koin dan +2 Bintang! ⭐
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setProblemIdx(0);
                  setSelectedAnswer(null);
                  setIsCorrect(null);
                }}
                className="px-5 py-2.5 bg-white text-amber-800 font-bold rounded-xl shadow-md hover:bg-amber-50 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 inline-block mr-1" /> Main Lagi
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onBack();
                }}
                className="px-5 py-2.5 bg-amber-950 text-white font-bold rounded-xl shadow-md hover:bg-black cursor-pointer"
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
