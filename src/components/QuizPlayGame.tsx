import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager, speakText } from '../utils/audio';
import { MascotCharacter } from './MascotCharacter';
import { MascotId, DifficultyTier } from '../types/game';
import { ArrowLeft, Volume2, Sparkles, Lightbulb, Flame } from 'lucide-react';
import { LEVELS_DATA, ENCOURAGING_PHRASES, RETRY_PHRASES } from '../data/gameData';

interface QuizPlayGameProps {
  levelId: number;
  tier: DifficultyTier;
  mascotId: MascotId;
  onBack: () => void;
  onCompleteLevel: (levelId: number, starsEarned: number, coinsEarned: number) => void;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedOutfit?: string;
  equippedHandheld?: string;
}

interface Question {
  id: number;
  prompt: string;
  speech: string;
  num1?: number;
  num2?: number;
  operator?: '+' | '-' | '×' | '÷';
  emoji: string;
  options: number[];
  correct: number;
  hint: string;
}

export const QuizPlayGame: React.FC<QuizPlayGameProps> = ({
  levelId,
  tier,
  mascotId,
  onBack,
  onCompleteLevel,
  equippedHat,
  equippedGlasses,
  equippedOutfit,
  equippedHandheld,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [tappedItems, setTappedItems] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'cheer' | 'thinking'>('idle');
  const [speechBubble, setSpeechBubble] = useState<string>('Sentuh bendanya untuk menghitung ya!');
  const [isLevelFinished, setIsLevelFinished] = useState(false);

  const levelInfo = LEVELS_DATA.find(l => l.id === levelId) || LEVELS_DATA[0];

  // Generate 5 questions appropriate for the given level/tier
  const generateQuestions = (levelTier: DifficultyTier): Question[] => {
    const emojis = ['🍎', '🍓', '🥕', '⭐', '🎈', '🍪', '🌸', '🐝', '🐟'];
    const generated: Question[] = [];

    for (let i = 0; i < 5; i++) {
      const em = emojis[i % emojis.length];

      if (levelTier === 1) {
        // Tier 1: Counting 1-10
        const target = Math.floor(Math.random() * 8) + 2; // 2 to 9
        const distractors = [target - 1, target + 1, target + 2].filter(n => n > 0 && n !== target);
        const options = [target, ...distractors.slice(0, 2)].sort(() => 0.5 - Math.random());

        generated.push({
          id: i + 1,
          prompt: `Berapa banyak ${em} di dalam kotak?`,
          speech: `Berapa banyak buah di dalam kotak? Ayo hitung!`,
          num1: target,
          emoji: em,
          options,
          correct: target,
          hint: `Sentuh setiap gambar satu per satu sambil menghitung ya!`,
        });
      } else if (levelTier === 2) {
        // Tier 2: Addition (sum <= 10)
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 4) + 1;
        const sum = a + b;
        const opts = [sum, sum - 1 > 0 ? sum - 1 : sum + 2, sum + 1].sort(() => 0.5 - Math.random());

        generated.push({
          id: i + 1,
          prompt: `Berapa ${a} + ${b}?`,
          speech: `Berapa ${a} ditambah ${b}?`,
          num1: a,
          num2: b,
          operator: '+',
          emoji: em,
          options: opts,
          correct: sum,
          hint: `Gabungkan kelompok pertama sebanyak ${a} dan kelompok kedua sebanyak ${b}!`,
        });
      } else if (levelTier === 3) {
        // Tier 3: Subtraction (1-10)
        const a = Math.floor(Math.random() * 5) + 4; // 4 to 8
        const b = Math.floor(Math.random() * 3) + 1; // 1 to 3
        const diff = a - b;
        const opts = [diff, diff + 1, diff - 1 > 0 ? diff - 1 : diff + 2].sort(() => 0.5 - Math.random());

        generated.push({
          id: i + 1,
          prompt: `Ada ${a} ${em}, diambil ${b}. Berapa sisanya?`,
          speech: `Ada ${a}, lalu diambil ${b}. Berapa sisanya?`,
          num1: a,
          num2: b,
          operator: '-',
          emoji: em,
          options: opts,
          correct: diff,
          hint: `Dari ${a} buah, bayangkan ${b} buah hilang. Hitung yang masih tersisa!`,
        });
      } else if (levelTier === 4) {
        // Tier 4: Pattern & Sequence
        const start = Math.floor(Math.random() * 4) + 1;
        const step = Math.random() > 0.5 ? 1 : 2;
        const seq = [start, start + step, start + step * 2, start + step * 3];
        const missingIndex = 2; // third item is missing
        const ans = seq[missingIndex];
        const opts = [ans, ans + 1, ans - 1 > 0 ? ans - 1 : ans + 2].sort(() => 0.5 - Math.random());

        generated.push({
          id: i + 1,
          prompt: `Lengkapi barisan bilangan: ${seq[0]}, ${seq[1]}, [ ? ], ${seq[3]}`,
          speech: `Angka berapa setelah ${seq[1]} sebelum ${seq[3]}?`,
          num1: seq[0],
          num2: seq[1],
          emoji: em,
          options: opts,
          correct: ans,
          hint: `Perhatikan selisih angkanya! Angkanya meloncat secara teratur lho.`,
        });
      } else if (levelTier === 5) {
        // Tier 5: Multiplication 1-5
        const groups = Math.floor(Math.random() * 3) + 2; // 2 or 3 or 4
        const perGroup = Math.floor(Math.random() * 2) + 2; // 2 or 3
        const total = groups * perGroup;
        const opts = [total, total - 1, total + 2].sort(() => 0.5 - Math.random());

        generated.push({
          id: i + 1,
          prompt: `Ada ${groups} kelompok, masing-masing berisi ${perGroup} ${em}. Berapa ${groups} × ${perGroup}?`,
          speech: `Berapa ${groups} kali ${perGroup}?`,
          num1: groups,
          num2: perGroup,
          operator: '×',
          emoji: em,
          options: opts,
          correct: total,
          hint: `Hitung kelompoknya: ada ${groups} kelompok. Setiap kelompok ada ${perGroup}!`,
        });
      } else {
        // Tier 6: Division / Fair Share
        const divShare = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4
        const plates = Math.floor(Math.random() * 2) + 2; // 2 or 3
        const total = divShare * plates;
        const opts = [divShare, divShare + 1, divShare - 1 > 0 ? divShare - 1 : divShare + 2].sort(() => 0.5 - Math.random());

        generated.push({
          id: i + 1,
          prompt: `${total} ${em} dibagi sama rata ke ${plates} teman. Berapa ${total} ÷ ${plates}?`,
          speech: `Berapa ${total} dibagi ${plates}?`,
          num1: total,
          num2: plates,
          operator: '÷',
          emoji: em,
          options: opts,
          correct: divShare,
          hint: `Bagi ${total} buah sama rata ke ${plates} piring! Masing-masing dapat berapa ya?`,
        });
      }
    }

    return generated;
  };

  useEffect(() => {
    const qList = generateQuestions(tier);
    setQuestions(qList);
    setCurrentQIndex(0);
    setStreak(0);
    setCorrectCount(0);
    setIsLevelFinished(false);
    setSpeechBubble(levelInfo.description);
  }, [levelId, tier]);

  const currentQ = questions[currentQIndex];

  const handleTapVisualItem = (idx: number) => {
    soundManager.playPop(1.1 + (idx % 5) * 0.1);
    if (!tappedItems.includes(idx)) {
      setTappedItems([...tappedItems, idx]);
      speakText(`${tappedItems.length + 1}`);
    }
  };

  const handleSelectAnswer = (ans: number) => {
    if (selectedAnswer !== null || !currentQ) return;

    soundManager.playPop(1.2);
    setSelectedAnswer(ans);

    if (ans === currentQ.correct) {
      // CORRECT!
      setIsCorrect(true);
      soundManager.playCorrect();
      soundManager.playCoin();
      const newStreak = streak + 1;
      const newCorrect = correctCount + 1;
      setStreak(newStreak);
      setCorrectCount(newCorrect);

      setMascotMood('cheer');
      const cheerWord = ENCOURAGING_PHRASES[Math.floor(Math.random() * ENCOURAGING_PHRASES.length)];
      setSpeechBubble(cheerWord);

      setTimeout(() => {
        if (currentQIndex < questions.length - 1) {
          setCurrentQIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setTappedItems([]);
          setShowHint(false);
          setMascotMood('idle');
          setSpeechBubble('Bagus sekali! Lanjut ke soal berikutnya yuk!');
        } else {
          // Finished level!
          finishLevel(newCorrect);
        }
      }, 1600);
    } else {
      // WRONG
      setIsCorrect(false);
      soundManager.playWrong();
      setStreak(0);
      setMascotMood('thinking');
      const retryWord = RETRY_PHRASES[Math.floor(Math.random() * RETRY_PHRASES.length)];
      setSpeechBubble(retryWord);

      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const finishLevel = (finalCorrect: number) => {
    setIsLevelFinished(true);
    soundManager.playFanfare();

    let starsEarned = 1;
    if (finalCorrect >= 5) starsEarned = 3;
    else if (finalCorrect >= 3) starsEarned = 2;

    const coinsEarned = finalCorrect * 10 + starsEarned * 10;
    onCompleteLevel(levelId, starsEarned, coinsEarned);
    setSpeechBubble(`Selamat! Kamu menyelesaikan level ini dan mendapat ${starsEarned} Bintang! ⭐`);
  };

  if (!currentQ && !isLevelFinished) {
    return <div className="text-center p-8">Memuat petualangan...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gradient-to-b from-sky-50 to-amber-50 rounded-3xl shadow-sm border border-sky-200">
      {/* Top Header */}
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
          {/* Streak indicator */}
          {streak > 1 && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex items-center gap-1 bg-amber-500 text-white px-3 py-1 rounded-xl text-xs font-black shadow-xs"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{streak} Beruntun!</span>
            </motion.div>
          )}

          <div className="text-xs sm:text-sm font-bold text-sky-800 bg-sky-200 px-3 py-1 rounded-xl">
            Soal {currentQIndex + 1} / {questions.length}
          </div>
        </div>
      </div>

      {/* Level Header Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 bg-white/80 p-4 rounded-2xl border border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{levelInfo.icon}</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                {levelInfo.title}
              </h2>
              <p className="text-xs font-medium text-slate-500">
                {levelInfo.conceptSubtitle}
              </p>
            </div>
            <button
              onClick={() => speakText(currentQ.speech)}
              className="p-1.5 text-sky-600 hover:text-sky-800 bg-sky-100 rounded-full hover:bg-sky-200 transition-colors"
              title="Dengarkan Soal"
            >
              <Volume2 className="w-4 h-4" />
            </button>
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

      {/* Main Interactive Stage */}
      {!isLevelFinished && currentQ && (
        <div className="space-y-4">
          {/* Question Box */}
          <div className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-sm text-center">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 mb-3">
              {currentQ.prompt}
            </h3>

            {/* Visual interactive item group representation */}
            <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 min-h-[140px] flex flex-col items-center justify-center">
              <div className="text-xs font-bold text-slate-500 mb-2">
                💡 Sentuh tiap gambar untuk menghitung:
              </div>

              {/* Render items based on operator */}
              {currentQ.operator === '+' ? (
                <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
                  {/* First group */}
                  <div className="flex gap-1.5 p-2 bg-white rounded-xl border border-amber-200">
                    {Array.from({ length: currentQ.num1 || 0 }).map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => handleTapVisualItem(i)}
                        whileTap={{ scale: 0.8 }}
                        className="text-3xl sm:text-4xl filter drop-shadow-xs cursor-pointer select-none"
                      >
                        {currentQ.emoji}
                      </motion.button>
                    ))}
                  </div>

                  <span className="text-3xl font-black text-amber-600">+</span>

                  {/* Second group */}
                  <div className="flex gap-1.5 p-2 bg-white rounded-xl border border-amber-200">
                    {Array.from({ length: currentQ.num2 || 0 }).map((_, i) => (
                      <motion.button
                        key={i + 100}
                        onClick={() => handleTapVisualItem(i + 100)}
                        whileTap={{ scale: 0.8 }}
                        className="text-3xl sm:text-4xl filter drop-shadow-xs cursor-pointer select-none"
                      >
                        {currentQ.emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : currentQ.operator === '-' ? (
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {Array.from({ length: currentQ.num1 || 0 }).map((_, i) => {
                    const isRemoved = i >= (currentQ.num1 || 0) - (currentQ.num2 || 0);
                    return (
                      <div
                        key={i}
                        className={`relative p-1 text-3xl sm:text-4xl ${
                          isRemoved ? 'opacity-30 line-through' : ''
                        }`}
                      >
                        {currentQ.emoji}
                        {isRemoved && (
                          <span className="absolute inset-0 flex items-center justify-center text-rose-600 font-black text-2xl">
                            ✕
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : currentQ.operator === '×' ? (
                <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                  {Array.from({ length: currentQ.num1 || 0 }).map((_, gIdx) => (
                    <div
                      key={gIdx}
                      className="p-2.5 bg-white rounded-2xl border-2 border-rose-200 flex flex-col items-center shadow-xs"
                    >
                      <div className="text-[10px] font-bold text-slate-500 mb-1">
                        Kelompok {gIdx + 1}
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: currentQ.num2 || 0 }).map((_, i) => (
                          <span key={i} className="text-2xl sm:text-3xl">
                            {currentQ.emoji}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Default Counting
                <div className="flex items-center justify-center gap-2 flex-wrap max-w-md">
                  {Array.from({ length: currentQ.num1 || 0 }).map((_, i) => {
                    const isTapped = tappedItems.includes(i);
                    return (
                      <motion.button
                        key={i}
                        onClick={() => handleTapVisualItem(i)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.85 }}
                        className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-xs border-2 cursor-pointer transition-all ${
                          isTapped
                            ? 'bg-amber-200 border-amber-500 scale-105 ring-2 ring-amber-300'
                            : 'bg-white border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        {currentQ.emoji}
                        {isTapped && (
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-600 text-white text-[11px] font-black rounded-full flex items-center justify-center shadow-xs">
                            {tappedItems.indexOf(i) + 1}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Hint Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                soundManager.playClick();
                setShowHint(!showHint);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHint ? 'Tutup Bantuan' : 'Butuh Petunjuk?'}</span>
            </button>
          </div>

          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-amber-100/90 text-amber-900 text-xs font-semibold rounded-xl text-center border border-amber-300"
            >
              💡 {currentQ.hint}
            </motion.div>
          )}

          {/* Answer Option Buttons */}
          <div className="bg-white/80 p-5 rounded-2xl border border-sky-200">
            <h4 className="text-center font-bold text-slate-700 text-sm mb-3">
              Pilih jawaban yang benar:
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedAnswer === opt;
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleSelectAnswer(opt)}
                    disabled={selectedAnswer !== null}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex flex-col items-center justify-center text-3xl sm:text-4xl font-black shadow-lg border-3 transition-all cursor-pointer relative ${
                      isSelected
                        ? isCorrect
                          ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-300'
                          : 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-300'
                        : 'bg-gradient-to-tr from-sky-300 to-blue-200 text-sky-950 border-sky-400 hover:from-sky-200 hover:to-blue-100'
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
        </div>
      )}

      {/* Level Finished Modal */}
      <AnimatePresence>
        {isLevelFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 rounded-3xl text-center shadow-xl border-3 border-amber-300"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-8 h-8 animate-spin text-amber-900" />
              <h3 className="text-3xl font-black">Level Selesai!</h3>
            </div>
            <p className="text-base font-bold mb-4">
              Kamu menjawab {correctCount} dari {questions.length} soal dengan benar!
            </p>

            {/* Stars earned */}
            <div className="flex justify-center gap-3 my-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className={`text-5xl filter drop-shadow ${
                    i < (correctCount >= 5 ? 3 : correctCount >= 3 ? 2 : 1)
                      ? 'text-yellow-200'
                      : 'text-amber-700/40'
                  }`}
                >
                  ⭐
                </motion.span>
              ))}
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => {
                  soundManager.playClick();
                  const qList = generateQuestions(tier);
                  setQuestions(qList);
                  setCurrentQIndex(0);
                  setIsLevelFinished(false);
                  setStreak(0);
                  setCorrectCount(0);
                }}
                className="px-6 py-3 bg-white text-amber-900 font-black rounded-xl shadow-md hover:bg-amber-50 cursor-pointer"
              >
                Main Lagi
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onBack();
                }}
                className="px-6 py-3 bg-amber-950 text-white font-black rounded-xl shadow-md hover:bg-black cursor-pointer"
              >
                Peta Petualangan ➔
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
