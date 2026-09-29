import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager, speakText } from '../utils/audio';
import { MascotCharacter } from './MascotCharacter';
import { MascotId } from '../types/game';
import { Sparkles, ArrowLeft, Volume2, RotateCcw } from 'lucide-react';

interface MatchingGameProps {
  mascotId: MascotId;
  onBack: () => void;
  onAddRewards: (coins: number, stars: number) => void;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedOutfit?: string;
  equippedHandheld?: string;
}

interface CardItem {
  id: string;
  pairId: number;
  type: 'number' | 'visual';
  value: number;
  label?: string;
  emoji?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({
  mascotId,
  onBack,
  onAddRewards,
  equippedHat,
  equippedGlasses,
  equippedOutfit,
  equippedHandheld,
}) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'cheer' | 'thinking'>('idle');
  const [speechBubble, setSpeechBubble] = useState<string>('Ayo cocokkan angka dengan jumlah gambar yang sama!');
  const [score, setScore] = useState(0);

  const emojiPool = ['🍎', '🍓', '🥕', '⭐', '🎈', '🐟', '🍪', '🌸'];

  const initGame = () => {
    // Pick 4 numbers between 1 and 8
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random()).slice(0, 4);
    const newCards: CardItem[] = [];

    numbers.forEach((num, idx) => {
      const emoji = emojiPool[idx % emojiPool.length];
      // Card 1: Number
      newCards.push({
        id: `num-${num}`,
        pairId: num,
        type: 'number',
        value: num,
        isFlipped: false,
        isMatched: false,
      });
      // Card 2: Visual Item Group
      newCards.push({
        id: `vis-${num}`,
        pairId: num,
        type: 'visual',
        value: num,
        emoji,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    setCards(newCards.sort(() => 0.5 - Math.random()));
    setFlippedCards([]);
    setMatchedPairsCount(0);
    setScore(0);
    setMascotMood('idle');
    setSpeechBubble('Ayo buka dua kartu dan temukan pasangan angka & gambarnya!');
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (isProcessing) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (flippedCards.length === 2) return;

    soundManager.playPop(1.2);
    const card = cards[index];

    // Announce card value in Indonesian
    if (card.type === 'number') {
      speakText(`${card.value}`);
    } else {
      speakText(`${card.value} buah`);
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const card1 = cards[newFlipped[0]];
      const card2 = cards[newFlipped[1]];

      if (card1.pairId === card2.pairId && card1.type !== card2.type) {
        // MATCH!
        setTimeout(() => {
          soundManager.playCorrect();
          soundManager.playCoin();
          const matched = [...cards];
          matched[newFlipped[0]].isMatched = true;
          matched[newFlipped[1]].isMatched = true;
          setCards(matched);
          setFlippedCards([]);
          setIsProcessing(false);
          const newMatchedCount = matchedPairsCount + 1;
          setMatchedPairsCount(newMatchedCount);
          setScore(prev => prev + 15);
          onAddRewards(5, 1);
          setMascotMood('cheer');
          setSpeechBubble(`Hebat! ${card1.value} cocok dengan gambarnya! ⭐`);

          if (newMatchedCount === 4) {
            // Finished board!
            setTimeout(() => {
              soundManager.playFanfare();
              setSpeechBubble('Luar biasa! Semua pasangan berhasil kamu temukan! 🏆');
              onAddRewards(20, 2);
            }, 600);
          }
        }, 600);
      } else {
        // WRONG TRY
        setTimeout(() => {
          soundManager.playWrong();
          const reset = [...cards];
          reset[newFlipped[0]].isFlipped = false;
          reset[newFlipped[1]].isFlipped = false;
          setCards(reset);
          setFlippedCards([]);
          setIsProcessing(false);
          setMascotMood('thinking');
          setSpeechBubble('Belum pas, yuk coba ingat-ingat lagi posisinya!');
        }, 1100);
      }
    }
  };

  const isCompleted = matchedPairsCount === 4;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gradient-to-b from-sky-100 to-amber-50 rounded-3xl shadow-sm border border-sky-200">
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
          <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1 rounded-xl text-sm font-bold border border-amber-300">
            <span>🪙 Poin:</span>
            <span className="tabular-nums">{score}</span>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              initGame();
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-sky-200 hover:bg-sky-300 text-sky-900 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulangi</span>
          </button>
        </div>
      </div>

      {/* Title & Mascot Zone */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white/70 p-4 rounded-2xl border border-sky-100">
        <div className="text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="text-2xl">🃏</span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              Cocokkan Angka & Jumlah
            </h2>
            <button
              onClick={() => speakText('Cocokkan kartu angka dengan jumlah gambar yang sama!')}
              className="p-1.5 text-sky-600 hover:text-sky-800 bg-sky-100 rounded-full hover:bg-sky-200 transition-colors"
              title="Dengarkan Suara"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Buka kartu angka lalu temukan kartu gambar dengan jumlah benda yang sama!
          </p>
        </div>

        {/* Mascot */}
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

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: card.isMatched ? 1 : 1.04 }}
            whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
            onClick={() => handleCardClick(idx)}
            className={`h-32 sm:h-36 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border-3 select-none relative ${
              card.isMatched
                ? 'bg-emerald-100 border-emerald-400 opacity-90 shadow-xs'
                : card.isFlipped
                ? 'bg-white border-amber-400 shadow-md ring-2 ring-amber-300'
                : 'bg-gradient-to-br from-sky-400 to-blue-500 border-white shadow-md hover:from-sky-300 hover:to-blue-400'
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <div className="flex flex-col items-center justify-center p-2 text-center">
                {card.type === 'number' ? (
                  <div className="flex flex-col items-center">
                    <span className="text-4xl sm:text-5xl font-black text-amber-600 tabular-nums">
                      {card.value}
                    </span>
                    <span className="text-xs font-bold text-slate-500 mt-1">
                      Angka {card.value}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="flex flex-wrap justify-center items-center gap-1 max-w-[120px]">
                      {Array.from({ length: card.value }).map((_, i) => (
                        <span key={i} className="text-xl sm:text-2xl filter drop-shadow-xs animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                          {card.emoji}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-500 mt-1">
                      {card.value} benda
                    </span>
                  </div>
                )}
                {card.isMatched && (
                  <span className="absolute top-1.5 right-1.5 text-emerald-600 font-bold text-xs bg-emerald-200 rounded-full px-1.5 py-0.5">
                    ✓ Cocok
                  </span>
                )}
              </div>
            ) : (
              // Card Back
              <div className="flex flex-col items-center justify-center text-white">
                <span className="text-3xl sm:text-4xl filter drop-shadow">⭐</span>
                <span className="text-xs font-bold tracking-wider mt-1 opacity-90">Buka</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Completion Modal / Banner */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-400 to-yellow-400 p-6 rounded-2xl text-white text-center shadow-lg border-2 border-amber-300"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-white animate-spin" />
              <h3 className="text-2xl font-black tracking-wide">
                Hore! Kamu Berhasil Menyelesaikan Game!
              </h3>
            </div>
            <p className="text-sm font-semibold mb-4 text-amber-950">
              Kamu mendapat +20 Koin dan +2 Bintang Juara!
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  soundManager.playClick();
                  initGame();
                }}
                className="px-6 py-2.5 bg-white text-amber-800 font-bold rounded-xl shadow-md hover:bg-amber-50 cursor-pointer transition-transform hover:scale-105"
              >
                Main Lagi
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onBack();
                }}
                className="px-6 py-2.5 bg-amber-900 text-white font-bold rounded-xl shadow-md hover:bg-amber-950 cursor-pointer transition-transform hover:scale-105"
              >
                Pilih Menu Lain
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
