import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager, speakText } from '../utils/audio';
import { MascotCharacter } from './MascotCharacter';
import { MascotId } from '../types/game';
import { ArrowLeft, Volume2, Sparkles, RefreshCw } from 'lucide-react';

interface PatternTrainGameProps {
  mascotId: MascotId;
  onBack: () => void;
  onAddRewards: (coins: number, stars: number) => void;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedOutfit?: string;
  equippedHandheld?: string;
}

interface PatternPuzzle {
  id: number;
  type: 'number' | 'visual';
  title: string;
  instruction: string;
  speech: string;
  sequence: (string | number)[];
  missingIndex: number;
  options: (string | number)[];
  correctAnswer: string | number;
}

const PUZZLES: PatternPuzzle[] = [
  {
    id: 1,
    type: 'number',
    title: 'Urutan Bilangan 1 sampai 5',
    instruction: 'Angka berapa yang hilang di gerbong kereta?',
    speech: 'Angka berapa yang hilang di gerbong ketiga? Satu, dua, titik-titik, empat, lima.',
    sequence: [1, 2, '?', 4, 5],
    missingIndex: 2,
    options: [3, 6, 2],
    correctAnswer: 3,
  },
  {
    id: 2,
    type: 'visual',
    title: 'Pola Buah Apel dan Pisang',
    instruction: 'Buah apa yang melengkapi pola berulang ini?',
    speech: 'Apel, pisang, apel, pisang, lalu apa selanjutnya?',
    sequence: ['🍎', '🍌', '🍎', '🍌', '?'],
    missingIndex: 4,
    options: ['🍎', '🍇', '🥕'],
    correctAnswer: '🍎',
  },
  {
    id: 3,
    type: 'number',
    title: 'Lompat Bilangan Dua-Dua',
    instruction: 'Cari angka berikutnya dalam kelipatan 2!',
    speech: 'Dua, empat, enam, lalu berapa?',
    sequence: [2, 4, 6, '?', 10],
    missingIndex: 3,
    options: [8, 7, 5],
    correctAnswer: 8,
  },
  {
    id: 4,
    type: 'visual',
    title: 'Pola Bintang dan Bunga',
    instruction: 'Bentuk apa yang seharusnya ada di gerbong kosong?',
    speech: 'Bintang, bunga, bintang, lalu apa?',
    sequence: ['⭐', '🌸', '⭐', '🌸', '?'],
    missingIndex: 4,
    options: ['⭐', '🎈', '🍪'],
    correctAnswer: '⭐',
  },
  {
    id: 5,
    type: 'number',
    title: 'Hitung Mundur Roket',
    instruction: 'Yuk bantu roket menghitung mundur dari 5 ke 1!',
    speech: 'Lima, empat, titik-titik, dua, satu.',
    sequence: [5, 4, '?', 2, 1],
    missingIndex: 2,
    options: [3, 6, 0],
    correctAnswer: 3,
  },
  {
    id: 6,
    type: 'number',
    title: 'Urutan Bilangan 6 sampai 10',
    instruction: 'Lengkapi angka di gerbong kereta!',
    speech: 'Enam, tujuh, delapan, titik-titik, sepuluh.',
    sequence: [6, 7, 8, '?', 10],
    missingIndex: 3,
    options: [9, 5, 8],
    correctAnswer: 9,
  },
];

export const PatternTrainGame: React.FC<PatternTrainGameProps> = ({
  mascotId,
  onBack,
  onAddRewards,
  equippedHat,
  equippedGlasses,
  equippedOutfit,
  equippedHandheld,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'cheer' | 'thinking'>('idle');
  const [speechBubble, setSpeechBubble] = useState<string>('Pilih gerbong yang cocok ya!');
  const [trainMoving, setTrainMoving] = useState(false);
  const [score, setScore] = useState(0);

  const puzzle = PUZZLES[currentIdx];

  const handleSelectOption = (opt: string | number) => {
    if (selectedAnswer !== null) return; // Prevent multiple taps

    soundManager.playPop(1.3);
    setSelectedAnswer(opt);

    if (opt === puzzle.correctAnswer) {
      // CORRECT!
      setIsAnswerCorrect(true);
      soundManager.playCorrect();
      soundManager.playCoin();
      setMascotMood('cheer');
      setSpeechBubble('Hebat sekali! Kereta siap meluncur kencang! 🚂✨');
      setScore(prev => prev + 20);
      onAddRewards(10, 1);
      setTrainMoving(true);

      setTimeout(() => {
        // Next puzzle
        if (currentIdx < PUZZLES.length - 1) {
          setCurrentIdx(prev => prev + 1);
          setSelectedAnswer(null);
          setIsAnswerCorrect(null);
          setTrainMoving(false);
          setMascotMood('idle');
          setSpeechBubble('Bagus! Sekarang susun pola kereta berikutnya!');
        } else {
          // Finished all puzzles
          soundManager.playFanfare();
          onAddRewards(25, 2);
          setSpeechBubble('Luar biasa! Kamu adalah masinis pola terbaik! 🏆');
        }
      }, 1800);
    } else {
      // WRONG
      setIsAnswerCorrect(false);
      soundManager.playWrong();
      setMascotMood('thinking');
      setSpeechBubble('Wah hampir pas! Coba perhatikan urutannya lagi ya!');

      setTimeout(() => {
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
      }, 1000);
    }
  };

  const isAllFinished = currentIdx === PUZZLES.length - 1 && isAnswerCorrect === true;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gradient-to-b from-sky-100 to-indigo-50 rounded-3xl shadow-sm border border-sky-200">
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
          <div className="text-xs sm:text-sm font-bold text-sky-800 bg-sky-200 px-3 py-1 rounded-xl">
            Tantangan {currentIdx + 1} / {PUZZLES.length}
          </div>
          <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1 rounded-xl text-sm font-bold border border-amber-300">
            <span>🪙 Poin:</span>
            <span className="tabular-nums">{score}</span>
          </div>
        </div>
      </div>

      {/* Header Info & Mascot */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white/70 p-4 rounded-2xl border border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚂</span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              {puzzle.title}
            </h2>
            <button
              onClick={() => speakText(puzzle.speech)}
              className="p-1.5 text-sky-600 hover:text-sky-800 bg-sky-100 rounded-full hover:bg-sky-200 transition-colors"
              title="Dengarkan Soal"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            {puzzle.instruction}
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

      {/* Train Interactive Track Zone */}
      <div className="relative overflow-hidden bg-gradient-to-b from-sky-200 to-emerald-200 p-6 rounded-3xl border-2 border-sky-300 mb-6 shadow-inner">
        {/* Sky Clouds */}
        <div className="absolute top-2 left-6 text-2xl opacity-60">☁️</div>
        <div className="absolute top-4 right-10 text-3xl opacity-60">☁️</div>

        {/* The Train with Carriages */}
        <motion.div
          animate={trainMoving ? { x: [0, 400] } : { y: [0, -3, 0] }}
          transition={trainMoving ? { duration: 1.5, ease: 'easeIn' } : { repeat: Infinity, duration: 1.2 }}
          className="flex items-end justify-center gap-2 sm:gap-3 py-4 overflow-x-auto select-none"
        >
          {/* Locomotive Engine */}
          <div className="flex flex-col items-center shrink-0">
            <motion.div
              animate={{ y: [-2, -8, -2], opacity: [0.7, 0.2, 0.7] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="text-lg text-slate-400 font-bold"
            >
              💨
            </motion.div>
            <div className="w-20 sm:w-24 h-24 sm:h-28 bg-rose-500 rounded-t-2xl border-3 border-rose-700 flex flex-col items-center justify-between p-2 shadow-md relative">
              <div className="w-6 h-6 bg-sky-100 rounded-md border border-rose-800"></div>
              <span className="text-2xl filter drop-shadow">🚂</span>
              {/* Wheels */}
              <div className="flex gap-2 -mb-4">
                <div className="w-6 h-6 bg-slate-800 rounded-full border-2 border-slate-600 animate-spin"></div>
                <div className="w-6 h-6 bg-slate-800 rounded-full border-2 border-slate-600 animate-spin"></div>
              </div>
            </div>
          </div>

          {/* Carriages */}
          {puzzle.sequence.map((item, idx) => {
            const isMissing = idx === puzzle.missingIndex;
            const displayItem = isMissing && isAnswerCorrect ? puzzle.correctAnswer : item;

            return (
              <div key={idx} className="flex flex-col items-center shrink-0">
                <div
                  className={`w-16 sm:w-20 h-20 sm:h-24 rounded-2xl flex flex-col items-center justify-center p-2 border-3 shadow-md relative ${
                    isMissing
                      ? isAnswerCorrect
                        ? 'bg-emerald-300 border-emerald-600 scale-105 transition-transform'
                        : 'bg-amber-100 border-amber-500 border-dashed animate-pulse ring-2 ring-amber-300'
                      : 'bg-white border-sky-400'
                  }`}
                >
                  {displayItem === '?' ? (
                    <span className="text-3xl sm:text-4xl font-black text-amber-600 animate-bounce">
                      ?
                    </span>
                  ) : (
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-800 tabular-nums filter drop-shadow-xs">
                      {displayItem}
                    </span>
                  )}
                  {/* Carriage Wheels */}
                  <div className="flex justify-between w-full px-1 -mb-6 mt-auto">
                    <div className="w-5 h-5 bg-slate-800 rounded-full border-2 border-slate-500"></div>
                    <div className="w-5 h-5 bg-slate-800 rounded-full border-2 border-slate-500"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Railway Track */}
        <div className="w-full h-3 bg-amber-800 rounded-full mt-4 relative">
          <div className="absolute inset-0 flex justify-between px-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-1.5 h-4 -top-0.5 bg-amber-950 rounded-xs"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Answer Balloon Choices */}
      <div className="bg-white/80 p-5 rounded-2xl border border-sky-200">
        <h3 className="text-center font-bold text-slate-700 text-sm mb-3">
          Pilih gerbong jawaban yang benar:
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {puzzle.options.map((opt, i) => {
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
                    ? isAnswerCorrect
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

      {/* Finish All Banner */}
      <AnimatePresence>
        {isAllFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-6 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-2xl text-center shadow-lg"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 animate-spin" />
              <h4 className="text-2xl font-black">Hore! Semua Gerbong Berhasil Disusun!</h4>
            </div>
            <p className="text-sm font-semibold mb-4 text-emerald-950">
              Kamu mendapatkan tambahan +25 Koin dan +2 Bintang!
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setCurrentIdx(0);
                  setSelectedAnswer(null);
                  setIsAnswerCorrect(null);
                }}
                className="px-5 py-2.5 bg-white text-emerald-800 font-bold rounded-xl shadow-md hover:bg-emerald-50 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 inline-block mr-1" /> Main Lagi
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onBack();
                }}
                className="px-5 py-2.5 bg-emerald-900 text-white font-bold rounded-xl shadow-md hover:bg-emerald-950 cursor-pointer"
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
