import React, { useState } from 'react';
import { motion } from 'motion/react';
import { soundManager } from '../utils/audio';
import { MascotCharacter } from './MascotCharacter';
import { MascotId, CustomizationCategory, WardrobeItem } from '../types/game';
import { WARDROBE_ITEMS, MASCOTS } from '../data/gameData';
import { ArrowLeft, Sparkles, Check, Lock, ShoppingBag } from 'lucide-react';

interface WardrobeShopProps {
  coins: number;
  playerLevel: number;
  activeMascot: MascotId;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedOutfit?: string;
  equippedHandheld?: string;
  unlockedItems: string[];
  onBack: () => void;
  onBuyItem: (item: WardrobeItem) => void;
  onEquipItem: (category: CustomizationCategory, itemId?: string) => void;
  onSelectMascot: (mascotId: MascotId) => void;
}

export const WardrobeShop: React.FC<WardrobeShopProps> = ({
  coins,
  playerLevel,
  activeMascot,
  equippedHat,
  equippedGlasses,
  equippedOutfit,
  equippedHandheld,
  unlockedItems,
  onBack,
  onBuyItem,
  onEquipItem,
  onSelectMascot,
}) => {
  const [activeCategory, setActiveCategory] = useState<CustomizationCategory>('hat');
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'cheer'>('happy');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories: { id: CustomizationCategory; label: string; icon: string }[] = [
    { id: 'hat', label: 'Topi & Mahkota', icon: '👑' },
    { id: 'glasses', label: 'Kacamata Lucu', icon: '🕶️' },
    { id: 'outfit', label: 'Baju & Kostum', icon: '🦸' },
    { id: 'handheld', label: 'Aksesoris Tangan', icon: '🪄' },
  ];

  const currentItems = WARDROBE_ITEMS.filter(i => i.category === activeCategory);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleBuy = (item: WardrobeItem) => {
    if (coins < item.coinCost) {
      soundManager.playWrong();
      showToast('Koin kamu belum cukup! Ayo main kuis untuk kumpulkan koin! 🪙');
      return;
    }
    if (playerLevel < item.requiredLevel) {
      soundManager.playWrong();
      showToast(`Item ini terbuka setelah kamu mencapai Tingkat ${item.requiredLevel}! 🔒`);
      return;
    }

    soundManager.playCoin();
    soundManager.playFanfare();
    onBuyItem(item);
    setMascotMood('cheer');
    showToast(`Hore! ${item.name} berhasil kamu beli! 🎉`);
  };

  const handleToggleEquip = (item: WardrobeItem) => {
    soundManager.playPop(1.4);
    setMascotMood('cheer');

    const isCurrentEquipped =
      (item.category === 'hat' && equippedHat === item.id) ||
      (item.category === 'glasses' && equippedGlasses === item.id) ||
      (item.category === 'outfit' && equippedOutfit === item.id) ||
      (item.category === 'handheld' && equippedHandheld === item.id);

    if (isCurrentEquipped) {
      // Unequip
      onEquipItem(item.category, undefined);
      showToast(`${item.name} telah dilepas.`);
    } else {
      // Equip
      onEquipItem(item.category, item.id);
      showToast(`${item.name} sekarang dipakai oleh ${MASCOTS[activeMascot].name}! ✨`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gradient-to-b from-purple-50 via-pink-50 to-amber-50 rounded-3xl shadow-sm border border-purple-200">
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
          <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl text-sm font-black border border-amber-300 shadow-xs">
            <span className="text-base">🪙</span>
            <span>Koin:</span>
            <span className="tabular-nums text-base">{coins}</span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-4 p-3 bg-amber-500 text-white text-xs sm:text-sm font-bold text-center rounded-2xl shadow-md border-2 border-amber-300"
        >
          {toastMessage}
        </motion.div>
      )}

      {/* Dressing Room Showcase */}
      <div className="bg-white/80 p-5 rounded-3xl border-2 border-purple-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-around gap-6">
        {/* Live Mascot Preview */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Kamar Pas Karakter
          </div>
          <div className="p-4 bg-gradient-to-b from-purple-100 to-pink-100 rounded-3xl border-2 border-purple-200 shadow-inner flex flex-col items-center justify-center min-w-[200px]">
            <MascotCharacter
              mascotId={activeMascot}
              mood={mascotMood}
              size="lg"
              speechBubbleText="Aku suka sekali mencoba baju baru!"
              equippedHat={equippedHat}
              equippedGlasses={equippedGlasses}
              equippedOutfit={equippedOutfit}
              equippedHandheld={equippedHandheld}
            />
            <div className="mt-3 text-center">
              <span className="text-sm font-black text-purple-900">
                {MASCOTS[activeMascot].name}
              </span>
              <span className="text-xs text-purple-600 block">
                {MASCOTS[activeMascot].species}
              </span>
            </div>
          </div>
        </div>

        {/* Mascot Chooser */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-sm font-bold text-slate-700 mb-2">
            Pilih Sahabat Animasi Kamu:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {Object.values(MASCOTS).map(m => {
              const isSelected = activeMascot === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    soundManager.playPop(1.3);
                    onSelectMascot(m.id);
                  }}
                  className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-100 border-purple-600 shadow-sm ring-2 ring-purple-300'
                      : 'bg-white border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center pointer-events-none">
                    <MascotCharacter mascotId={m.id} mood="idle" size="sm" showSpeechBubble={false} />
                  </div>
                  <span className="text-xs font-black text-slate-800 mt-1">{m.name}</span>
                  <span className="text-[10px] text-slate-500">{m.species}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 max-w-sm">
            💡 Setiap jawaban kuis benar dan penyelesaian level memberikan kamu koin untuk membuka semua aksesoris lucu ini!
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {categories.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playClick();
                setActiveCategory(cat.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {currentItems.map(item => {
          const isUnlocked = unlockedItems.includes(item.id);
          const isLevelLocked = playerLevel < item.requiredLevel;
          const isEquipped =
            (item.category === 'hat' && equippedHat === item.id) ||
            (item.category === 'glasses' && equippedGlasses === item.id) ||
            (item.category === 'outfit' && equippedOutfit === item.id) ||
            (item.category === 'handheld' && equippedHandheld === item.id);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-3xl border-2 flex flex-col justify-between transition-all relative ${
                isEquipped
                  ? 'bg-gradient-to-br from-amber-50 to-purple-50 border-amber-400 shadow-md ring-2 ring-amber-300'
                  : isUnlocked
                  ? 'bg-white border-purple-200 shadow-xs hover:border-purple-300'
                  : 'bg-slate-50 border-slate-200 opacity-90'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-3xl shadow-xs shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-slate-800">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                  {isLevelLocked && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 mt-1">
                      <Lock className="w-3 h-3" /> Butuh Tingkat {item.requiredLevel}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                {isUnlocked ? (
                  <button
                    onClick={() => handleToggleEquip(item)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isEquipped
                        ? 'bg-amber-500 text-white shadow-xs hover:bg-amber-600'
                        : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                    }`}
                  >
                    {isEquipped ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Sedang Dipakai (Lepas)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Pakai Item</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={isLevelLocked}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isLevelLocked
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Beli dengan 🪙 {item.coinCost} Koin</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
