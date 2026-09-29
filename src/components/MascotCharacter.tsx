import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MascotId, MascotMood } from '../types/game';
import { soundManager } from '../utils/audio';
import { WARDROBE_ITEMS } from '../data/gameData';

interface MascotCharacterProps {
  mascotId: MascotId;
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speechBubbleText?: string | null;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedOutfit?: string;
  equippedHandheld?: string;
  onClick?: () => void;
  showSpeechBubble?: boolean;
}

export const MascotCharacter: React.FC<MascotCharacterProps> = ({
  mascotId,
  mood = 'idle',
  size = 'md',
  speechBubbleText,
  equippedHat,
  equippedGlasses,
  equippedOutfit,
  equippedHandheld,
  onClick,
  showSpeechBubble = true,
}) => {
  const [internalCheer, setInternalCheer] = useState(false);

  const handleMascotTap = () => {
    soundManager.playPop(1.4);
    setInternalCheer(true);
    setTimeout(() => {
      setInternalCheer(false);
    }, 1200);

    if (onClick) {
      onClick();
    }
  };

  const effectiveMood = internalCheer ? 'cheer' : mood;

  // Resolve item emojis
  const hatEmoji = WARDROBE_ITEMS.find(i => i.id === equippedHat)?.emoji;
  const glassesEmoji = WARDROBE_ITEMS.find(i => i.id === equippedGlasses)?.emoji;
  const outfitEmoji = WARDROBE_ITEMS.find(i => i.id === equippedOutfit)?.emoji;
  const handEmoji = WARDROBE_ITEMS.find(i => i.id === equippedHandheld)?.emoji;

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-44 h-44',
    xl: 'w-56 h-56',
  }[size];

  const moodVariants = {
    idle: {
      y: [0, -6, 0],
      rotate: [0, 1, -1, 0],
      transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' as const },
    },
    happy: {
      y: [0, -16, 0, -8, 0],
      scale: [1, 1.08, 1, 1.04, 1],
      transition: { repeat: Infinity, duration: 1.2, ease: 'easeOut' as const },
    },
    cheer: {
      y: [0, -22, 0, -18, 0],
      rotate: [0, -6, 6, -4, 4, 0],
      scale: [1, 1.12, 1],
      transition: { repeat: Infinity, duration: 0.9 },
    },
    thinking: {
      rotate: [-4, 4, -4],
      y: [0, -4, 0],
      transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' as const },
    },
    dance: {
      rotate: [-12, 12, -12],
      y: [0, -12, 0],
      transition: { repeat: Infinity, duration: 0.8, ease: 'easeInOut' as const },
    },
  };

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeechBubble && speechBubbleText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="mb-2 relative bg-white border-2 border-amber-300 text-slate-800 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-2xl shadow-md max-w-xs text-center z-20"
          >
            {speechBubbleText}
            <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-amber-300"></div>
            <div className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-white"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Sparkles when cheering */}
      {(effectiveMood === 'cheer' || effectiveMood === 'happy') && (
        <div className="absolute -top-4 w-full flex justify-around pointer-events-none z-10">
          <motion.span
            animate={{ y: [-5, -20], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: 0.1 }}
            className="text-amber-400 text-xl"
          >
            ✨
          </motion.span>
          <motion.span
            animate={{ y: [-2, -24], opacity: [0, 1, 0], scale: [0.4, 1.3, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.1, delay: 0.4 }}
            className="text-yellow-300 text-2xl"
          >
            ⭐
          </motion.span>
          <motion.span
            animate={{ y: [-4, -18], opacity: [0, 1, 0], scale: [0.6, 1.1, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.3, delay: 0.2 }}
            className="text-pink-400 text-lg"
          >
            💖
          </motion.span>
        </div>
      )}

      {/* Mascot Body Container */}
      <motion.div
        variants={moodVariants}
        animate={effectiveMood}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleMascotTap}
        className={`${sizeClasses} relative cursor-pointer filter drop-shadow-md select-none`}
        role="button"
        tabIndex={0}
        aria-label={`Karakter Maskot ${mascotId}`}
      >
        {/* Render Vector Character based on mascotId */}
        {mascotId === 'zora' && <ZoraCharacterSVG mood={effectiveMood} />}
        {mascotId === 'mimi' && <MimiCatSVG mood={effectiveMood} />}
        {mascotId === 'boni' && <BoniBearSVG mood={effectiveMood} />}
        {mascotId === 'piko' && <PikoPenguinSVG mood={effectiveMood} />}
        {mascotId === 'cici' && <CiciRabbitSVG mood={effectiveMood} />}

        {/* Dynamic Hat Overlay */}
        {hatEmoji && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 text-2xl sm:text-4xl filter drop-shadow z-20 pointer-events-none"
          >
            {hatEmoji}
          </motion.div>
        )}

        {/* Dynamic Glasses Overlay */}
        {glassesEmoji && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-[32%] sm:top-[34%] left-1/2 -translate-x-1/2 text-lg sm:text-2xl filter drop-shadow z-20 pointer-events-none"
          >
            {glassesEmoji}
          </motion.div>
        )}

        {/* Dynamic Outfit Badge */}
        {outfitEmoji && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute bottom-2 left-2 text-xl sm:text-2xl bg-white/90 rounded-full p-0.5 shadow-sm border border-amber-200 z-10 pointer-events-none"
          >
            {outfitEmoji}
          </motion.div>
        )}

        {/* Dynamic Handheld Item */}
        {handEmoji && (
          <motion.div
            animate={{ rotate: [-6, 6, -6], y: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute bottom-4 -right-3 text-2xl sm:text-3xl filter drop-shadow z-20 pointer-events-none"
          >
            {handEmoji}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// 1. Mimi The Orange Cat SVG
const MimiCatSVG: React.FC<{ mood: MascotMood }> = ({ mood }) => {
  const isCheer = mood === 'cheer' || mood === 'happy';
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <motion.path
        d="M 125 120 C 145 110, 155 85, 145 70 C 138 60, 130 75, 132 95 Z"
        fill="#EA580C"
        animate={{ rotate: isCheer ? [0, 15, -10, 0] : [0, 6, -6, 0] }}
        transition={{ repeat: Infinity, duration: isCheer ? 0.6 : 2 }}
        style={{ transformOrigin: '125px 120px' }}
      />
      <ellipse cx="80" cy="115" rx="42" ry="38" fill="#F97316" />
      <ellipse cx="80" cy="118" rx="28" ry="26" fill="#FED7AA" />
      <ellipse cx="58" cy="144" rx="14" ry="10" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />
      <ellipse cx="102" cy="144" rx="14" ry="10" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />
      <ellipse cx="80" cy="65" rx="46" ry="40" fill="#FB923C" />
      <path d="M 42 42 L 35 10 L 65 30 Z" fill="#F97316" />
      <path d="M 43 38 L 40 18 L 60 30 Z" fill="#F472B6" />
      <path d="M 118 42 L 125 10 L 95 30 Z" fill="#F97316" />
      <path d="M 117 38 L 120 18 L 100 30 Z" fill="#F472B6" />
      <path d="M 80 32 L 80 44" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />
      <circle cx="52" cy="74" r="7" fill="#F472B6" opacity="0.6" />
      <circle cx="108" cy="74" r="7" fill="#F472B6" opacity="0.6" />
      {isCheer ? (
        <>
          <path d="M 54 62 Q 62 52 70 62" stroke="#1E293B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 90 62 Q 98 52 106 62" stroke="#1E293B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="62" cy="60" r="7" fill="#1E293B" />
          <circle cx="60" cy="58" r="2.5" fill="#FFFFFF" />
          <circle cx="98" cy="60" r="7" fill="#1E293B" />
          <circle cx="96" cy="58" r="2.5" fill="#FFFFFF" />
        </>
      )}
      <polygon points="80,68 76,64 84,64" fill="#EC4899" />
      <path d="M 75 72 Q 80 77 85 72" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="40" y1="67" x2="22" y2="64" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="73" x2="24" y2="76" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      <line x1="120" y1="67" x2="138" y2="64" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      <line x1="120" y1="73" x2="136" y2="76" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      {isCheer ? (
        <>
          <circle cx="42" cy="85" r="10" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />
          <circle cx="118" cy="85" r="10" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />
        </>
      ) : (
        <>
          <circle cx="60" cy="115" r="9" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.5" />
          <circle cx="100" cy="115" r="9" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
};

// 2. Boni The Brown Bear SVG
const BoniBearSVG: React.FC<{ mood: MascotMood }> = ({ mood }) => {
  const isCheer = mood === 'cheer' || mood === 'happy';
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <circle cx="44" cy="38" r="18" fill="#92400E" />
      <circle cx="44" cy="38" r="10" fill="#FDE68A" />
      <circle cx="116" cy="38" r="18" fill="#92400E" />
      <circle cx="116" cy="38" r="10" fill="#FDE68A" />
      <ellipse cx="80" cy="116" rx="44" ry="38" fill="#B45309" />
      <ellipse cx="80" cy="120" rx="30" ry="26" fill="#FEF3C7" />
      <circle cx="80" cy="65" r="44" fill="#B45309" />
      <ellipse cx="80" cy="74" rx="20" ry="15" fill="#FEF3C7" />
      <ellipse cx="80" cy="68" rx="8" ry="6" fill="#451A03" />
      <circle cx="50" cy="74" r="6" fill="#F87171" opacity="0.6" />
      <circle cx="110" cy="74" r="6" fill="#F87171" opacity="0.6" />
      {isCheer ? (
        <>
          <path d="M 56 58 Q 63 50 70 58" stroke="#1E293B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 90 58 Q 97 50 104 58" stroke="#1E293B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="63" cy="56" r="6" fill="#1E293B" />
          <circle cx="61" cy="54" r="2.2" fill="#FFFFFF" />
          <circle cx="97" cy="56" r="6" fill="#1E293B" />
          <circle cx="95" cy="54" r="2.2" fill="#FFFFFF" />
        </>
      )}
      <path d="M 75 77 Q 80 83 85 77" stroke="#451A03" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {isCheer ? (
        <>
          <circle cx="38" cy="85" r="11" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" />
          <circle cx="122" cy="85" r="11" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" />
        </>
      ) : (
        <>
          <circle cx="56" cy="115" r="10" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" />
          <circle cx="104" cy="115" r="10" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" />
        </>
      )}
      <ellipse cx="56" cy="146" rx="14" ry="10" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" />
      <ellipse cx="104" cy="146" rx="14" ry="10" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" />
    </svg>
  );
};

// 3. Piko The Penguin SVG
const PikoPenguinSVG: React.FC<{ mood: MascotMood }> = ({ mood }) => {
  const isCheer = mood === 'cheer' || mood === 'happy';
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <ellipse cx="60" cy="148" rx="16" ry="8" fill="#F59E0B" />
      <ellipse cx="100" cy="148" rx="16" ry="8" fill="#F59E0B" />
      <ellipse cx="80" cy="90" rx="46" ry="54" fill="#0284C7" />
      <ellipse cx="80" cy="98" rx="32" ry="40" fill="#F8FAFC" />
      {isCheer ? (
        <>
          <motion.ellipse
            cx="30"
            cy="75"
            rx="12"
            ry="22"
            fill="#0369A1"
            animate={{ rotate: [-20, -50, -20] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            style={{ transformOrigin: '35px 75px' }}
          />
          <motion.ellipse
            cx="130"
            cy="75"
            rx="12"
            ry="22"
            fill="#0369A1"
            animate={{ rotate: [20, 50, 20] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            style={{ transformOrigin: '125px 75px' }}
          />
        </>
      ) : (
        <>
          <ellipse cx="34" cy="96" rx="10" ry="24" fill="#0369A1" transform="rotate(15 34 96)" />
          <ellipse cx="126" cy="96" rx="10" ry="24" fill="#0369A1" transform="rotate(-15 126 96)" />
        </>
      )}
      <circle cx="52" cy="74" r="6" fill="#F472B6" opacity="0.6" />
      <circle cx="108" cy="74" r="6" fill="#F472B6" opacity="0.6" />
      {isCheer ? (
        <>
          <path d="M 54 62 Q 62 52 70 62" stroke="#0F172A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 90 62 Q 98 52 106 62" stroke="#0F172A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="62" cy="60" r="7" fill="#0F172A" />
          <circle cx="60" cy="58" r="2.5" fill="#FFFFFF" />
          <circle cx="98" cy="60" r="7" fill="#0F172A" />
          <circle cx="96" cy="58" r="2.5" fill="#FFFFFF" />
        </>
      )}
      <polygon points="80,78 72,66 88,66" fill="#F59E0B" />
      <polygon points="80,82 74,70 86,70" fill="#D97706" />
    </svg>
  );
};

// Zora The Teal Frog Mascot SVG (Modeled directly after user's photo!)
const ZoraCharacterSVG: React.FC<{ mood: MascotMood }> = ({ mood }) => {
  const isCheer = mood === 'cheer' || mood === 'happy';
  return (
    <svg viewBox="0 0 160 170" className="w-full h-full">
      {/* Top Handle Loop */}
      <path
        d="M 52 35 C 52 8, 108 8, 108 35"
        stroke="#0D9488"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />

      {/* Little Crown Crest notches between eyes */}
      <path
        d="M 68 35 L 72 20 L 76 34 L 80 18 L 84 34 L 88 20 L 92 35 Z"
        fill="#0D9488"
      />

      {/* Froggy Legs / Sitting Base */}
      <ellipse cx="46" cy="144" rx="16" ry="12" fill="#0D9488" />
      <ellipse cx="114" cy="144" rx="16" ry="12" fill="#0D9488" />
      <circle cx="50" cy="148" r="8" fill="#14B8A6" />
      <circle cx="110" cy="148" r="8" fill="#14B8A6" />

      {/* Main Teal Body */}
      <ellipse cx="80" cy="120" rx="36" ry="32" fill="#0D9488" />
      {/* Tummy Oval Highlight */}
      <ellipse cx="80" cy="122" rx="20" ry="22" fill="#14B8A6" />
      <ellipse cx="80" cy="122" rx="14" ry="16" fill="#2DD4BF" opacity="0.6" />

      {/* Eye Protrusions / Bumps (Teal) */}
      <circle cx="54" cy="46" r="22" fill="#0D9488" />
      <circle cx="106" cy="46" r="22" fill="#0D9488" />

      {/* Inner Eye Sockets (Teal Light) */}
      <circle cx="54" cy="46" r="18" fill="#14B8A6" />
      <circle cx="106" cy="46" r="18" fill="#14B8A6" />

      {/* Chubby Orange Cheeks / Snout (Wide and Plump just like the toy) */}
      <ellipse cx="80" cy="80" rx="50" ry="28" fill="#FB923C" />
      <ellipse cx="50" cy="82" rx="18" ry="16" fill="#F97316" />
      <ellipse cx="110" cy="82" rx="18" ry="16" fill="#F97316" />
      <ellipse cx="80" cy="74" rx="32" ry="20" fill="#FDBA74" opacity="0.8" />

      {/* Nostrils */}
      <circle cx="75" cy="72" r="1.8" fill="#C2410C" />
      <circle cx="85" cy="72" r="1.8" fill="#C2410C" />

      {/* Big Expressive Cartoon Eyes */}
      {isCheer ? (
        <>
          <path d="M 44 46 Q 54 36 64 46" stroke="#042F2E" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M 96 46 Q 106 36 116 46" stroke="#042F2E" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Left Eye */}
          <circle cx="54" cy="46" r="12" fill="#042F2E" />
          <circle cx="51" cy="42" r="4.5" fill="#FFFFFF" />
          <circle cx="58" cy="49" r="2" fill="#FFFFFF" />

          {/* Right Eye */}
          <circle cx="106" cy="46" r="12" fill="#042F2E" />
          <circle cx="103" cy="42" r="4.5" fill="#FFFFFF" />
          <circle cx="110" cy="49" r="2" fill="#FFFFFF" />
        </>
      )}

      {/* Sweet Smile */}
      <path
        d="M 64 88 Q 80 98 96 88"
        stroke="#9A3412"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Lip dimple */}
      <path d="M 64 88 Q 62 86 63 84" stroke="#9A3412" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 96 88 Q 98 86 97 84" stroke="#9A3412" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Clapped Hands in Front of Chest (As seen in the toy photo) */}
      <g>
        <ellipse cx="68" cy="110" rx="10" ry="14" fill="#0D9488" stroke="#042F2E" strokeWidth="1.5" transform="rotate(20 68 110)" />
        <ellipse cx="92" cy="110" rx="10" ry="14" fill="#0D9488" stroke="#042F2E" strokeWidth="1.5" transform="rotate(-20 92 110)" />
        <circle cx="72" cy="106" r="4" fill="#14B8A6" />
        <circle cx="88" cy="106" r="4" fill="#14B8A6" />
      </g>
    </svg>
  );
};

const CiciRabbitSVG: React.FC<{ mood: MascotMood }> = ({ mood }) => {
  const isCheer = mood === 'cheer' || mood === 'happy';
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <motion.g
        animate={{ rotate: isCheer ? [-5, 5, -5] : [0, 2, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
        style={{ transformOrigin: '80px 40px' }}
      >
        <ellipse cx="55" cy="24" rx="12" ry="24" fill="#FFFFFF" stroke="#EC4899" strokeWidth="2" transform="rotate(-10 55 24)" />
        <ellipse cx="55" cy="24" rx="6" ry="16" fill="#FCE7F3" transform="rotate(-10 55 24)" />
        <ellipse cx="105" cy="24" rx="12" ry="24" fill="#FFFFFF" stroke="#EC4899" strokeWidth="2" transform="rotate(10 105 24)" />
        <ellipse cx="105" cy="24" rx="6" ry="16" fill="#FCE7F3" transform="rotate(10 105 24)" />
      </motion.g>
      <ellipse cx="80" cy="116" rx="40" ry="36" fill="#FFFFFF" stroke="#EC4899" strokeWidth="2" />
      <ellipse cx="80" cy="120" rx="26" ry="24" fill="#FCE7F3" />
      <ellipse cx="58" cy="146" rx="14" ry="10" fill="#FFFFFF" stroke="#EC4899" strokeWidth="2" />
      <ellipse cx="102" cy="146" rx="14" ry="10" fill="#FFFFFF" stroke="#EC4899" strokeWidth="2" />
      <ellipse cx="80" cy="72" rx="44" ry="38" fill="#FFFFFF" stroke="#EC4899" strokeWidth="2" />
      <circle cx="50" cy="78" r="7" fill="#F472B6" opacity="0.5" />
      <circle cx="110" cy="78" r="7" fill="#F472B6" opacity="0.5" />
      {isCheer ? (
        <>
          <path d="M 54 68 Q 62 58 70 68" stroke="#1E293B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 90 68 Q 98 58 106 68" stroke="#1E293B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="62" cy="68" r="6.5" fill="#1E293B" />
          <circle cx="60" cy="66" r="2.3" fill="#FFFFFF" />
          <circle cx="98" cy="68" r="6.5" fill="#1E293B" />
          <circle cx="96" cy="66" r="2.3" fill="#FFFFFF" />
        </>
      )}
      <polygon points="80,77 75,73 85,73" fill="#EC4899" />
      <path d="M 75 80 Q 80 84 85 80" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="78" y="81" width="4" height="4" rx="1" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />
      {isCheer ? (
        <>
          <circle cx="42" cy="90" r="9" fill="#FFFFFF" stroke="#EC4899" strokeWidth="1.5" />
          <circle cx="118" cy="90" r="9" fill="#FFFFFF" stroke="#EC4899" strokeWidth="1.5" />
        </>
      ) : (
        <>
          <circle cx="62" cy="116" r="8" fill="#FFFFFF" stroke="#EC4899" strokeWidth="1.5" />
          <circle cx="98" cy="116" r="8" fill="#FFFFFF" stroke="#EC4899" strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
};
