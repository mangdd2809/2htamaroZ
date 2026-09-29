import React, { useState, useEffect } from 'react';
import { GameScreen, MascotId, DifficultyTier, WardrobeItem, CustomizationCategory } from './types/game';
import { HeaderNav } from './components/HeaderNav';
import { HomeScreen } from './components/HomeScreen';
import { LevelSelect } from './components/LevelSelect';
import { MiniGameSelect } from './components/MiniGameSelect';
import { MatchingGame } from './components/MatchingGame';
import { PatternTrainGame } from './components/PatternTrainGame';
import { SearchCollectGame } from './components/SearchCollectGame';
import { MultiplyGardenGame } from './components/MultiplyGardenGame';
import { FairShareGame } from './components/FairShareGame';
import { QuizPlayGame } from './components/QuizPlayGame';
import { WardrobeShop } from './components/WardrobeShop';
import { CertificateModal } from './components/CertificateModal';

const STORAGE_KEY = 'zoraa_math_save_v1';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('HOME');
  const [playerName, setPlayerName] = useState<string>('Zora');
  const [coins, setCoins] = useState<number>(60);
  const [stars, setStars] = useState<number>(6);
  const [highestStreak, setHighestStreak] = useState<number>(3);
  const [activeMascot, setActiveMascot] = useState<MascotId>('zora');
  const [equippedHat, setEquippedHat] = useState<string | undefined>('hat_crown');
  const [equippedGlasses, setEquippedGlasses] = useState<string | undefined>(undefined);
  const [equippedOutfit, setEquippedOutfit] = useState<string | undefined>(undefined);
  const [equippedHandheld, setEquippedHandheld] = useState<string | undefined>('hand_wand');
  const [unlockedItems, setUnlockedItems] = useState<string[]>([
    'hat_crown',
    'hat_party',
    'glass_cool',
    'hand_wand',
  ]);
  const [completedLevels, setCompletedLevels] = useState<
    Record<number, { stars: number; highScore: number; completed: boolean }>
  >({
    1: { stars: 3, highScore: 5, completed: true },
    2: { stars: 3, highScore: 5, completed: true },
  });

  const [selectedQuiz, setSelectedQuiz] = useState<{ levelId: number; tier: DifficultyTier }>({
    levelId: 1,
    tier: 1,
  });

  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.playerName) setPlayerName(parsed.playerName);
        if (typeof parsed.coins === 'number') setCoins(parsed.coins);
        if (typeof parsed.stars === 'number') setStars(parsed.stars);
        if (typeof parsed.highestStreak === 'number') setHighestStreak(parsed.highestStreak);
        if (parsed.activeMascot) setActiveMascot(parsed.activeMascot);
        if (parsed.equippedHat !== undefined) setEquippedHat(parsed.equippedHat);
        if (parsed.equippedGlasses !== undefined) setEquippedGlasses(parsed.equippedGlasses);
        if (parsed.equippedOutfit !== undefined) setEquippedOutfit(parsed.equippedOutfit);
        if (parsed.equippedHandheld !== undefined) setEquippedHandheld(parsed.equippedHandheld);
        if (Array.isArray(parsed.unlockedItems)) setUnlockedItems(parsed.unlockedItems);
        if (parsed.completedLevels) setCompletedLevels(parsed.completedLevels);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  const saveState = (updatedState: Record<string, unknown>) => {
    try {
      const currentState = {
        playerName,
        coins,
        stars,
        highestStreak,
        activeMascot,
        equippedHat,
        equippedGlasses,
        equippedOutfit,
        equippedHandheld,
        unlockedItems,
        completedLevels,
        ...updatedState,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
    } catch {
      // ignore
    }
  };

  const handleAddRewards = (earnedCoins: number, earnedStars: number) => {
    const nextCoins = coins + earnedCoins;
    const nextStars = stars + earnedStars;
    setCoins(nextCoins);
    setStars(nextStars);
    saveState({ coins: nextCoins, stars: nextStars });
  };

  const handleCompleteLevel = (lvlId: number, starsEarned: number, coinsEarned: number) => {
    const prevStars = completedLevels[lvlId]?.stars || 0;
    const starDelta = Math.max(0, starsEarned - prevStars);

    const nextStars = stars + starDelta;
    const nextCoins = coins + coinsEarned;

    const nextLevels = {
      ...completedLevels,
      [lvlId]: {
        stars: Math.max(prevStars, starsEarned),
        highScore: 5,
        completed: true,
      },
    };

    setCoins(nextCoins);
    setStars(nextStars);
    setCompletedLevels(nextLevels);
    saveState({
      coins: nextCoins,
      stars: nextStars,
      completedLevels: nextLevels,
    });
  };

  const handleBuyItem = (item: WardrobeItem) => {
    const nextCoins = coins - item.coinCost;
    const nextUnlocked = [...unlockedItems, item.id];
    setCoins(nextCoins);
    setUnlockedItems(nextUnlocked);
    saveState({ coins: nextCoins, unlockedItems: nextUnlocked });
  };

  const handleEquipItem = (category: CustomizationCategory, itemId?: string) => {
    if (category === 'hat') {
      setEquippedHat(itemId);
      saveState({ equippedHat: itemId });
    } else if (category === 'glasses') {
      setEquippedGlasses(itemId);
      saveState({ equippedGlasses: itemId });
    } else if (category === 'outfit') {
      setEquippedOutfit(itemId);
      saveState({ equippedOutfit: itemId });
    } else if (category === 'handheld') {
      setEquippedHandheld(itemId);
      saveState({ equippedHandheld: itemId });
    }
  };

  const handleSelectMascot = (mascotId: MascotId) => {
    setActiveMascot(mascotId);
    saveState({ activeMascot: mascotId });
  };

  const handleStartLevel = (levelId: number, tier: DifficultyTier) => {
    setSelectedQuiz({ levelId, tier });
    setCurrentScreen('QUIZ_PLAY');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-teal-50/30 to-amber-50/50 text-slate-800">
      {/* Top Bar Contract */}
      <HeaderNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        coins={coins}
        stars={stars}
        playerName={playerName}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* Main Screen Content */}
      <main className="flex-1 py-6 px-4">
        {currentScreen === 'HOME' && (
          <HomeScreen
            playerName={playerName}
            coins={coins}
            stars={stars}
            highestStreak={highestStreak}
            activeMascot={activeMascot}
            equippedHat={equippedHat}
            equippedGlasses={equippedGlasses}
            equippedOutfit={equippedOutfit}
            equippedHandheld={equippedHandheld}
            onNavigate={setCurrentScreen}
            onOpenCertificate={() => setIsCertificateOpen(true)}
          />
        )}

        {currentScreen === 'LEVEL_SELECT' && (
          <LevelSelect
            userStars={stars}
            completedLevels={completedLevels}
            activeMascot={activeMascot}
            equippedHat={equippedHat}
            equippedGlasses={equippedGlasses}
            equippedOutfit={equippedOutfit}
            equippedHandheld={equippedHandheld}
            onSelectLevel={handleStartLevel}
            onBack={() => setCurrentScreen('HOME')}
          />
        )}

        {currentScreen === 'MINI_GAME_SELECT' && (
          <MiniGameSelect
            activeMascot={activeMascot}
            equippedHat={equippedHat}
            equippedGlasses={equippedGlasses}
            equippedOutfit={equippedOutfit}
            equippedHandheld={equippedHandheld}
            onSelectGame={setCurrentScreen}
            onBack={() => setCurrentScreen('HOME')}
          />
        )}

        {currentScreen === 'MATCHING_GAME' && (
          <MatchingGame
            mascotId={activeMascot}
            onBack={() => setCurrentScreen('MINI_GAME_SELECT')}
            onAddRewards={handleAddRewards}
            equippedHat={equippedHat}
            equippedGlasses={equippedGlasses}
            equippedOutfit={equippedOutfit}
            equippedHandheld={equippedHandheld}
          />
        )}

        {currentScreen === 'PATTERN_GAME' && (
          <PatternTrainGame
            mascotId={activeMascot}
            onBack={() => setCurrentScreen('MINI_GAME_SELECT')}
            onAddRewards={handleAddRewards}
            equippedHat={equippedHat}
            equippedGlasses={equippedGlasses}
            equippedOutfit={equippedOutfit}
            equippedHandheld={equippedHandheld}
          />
        )}

        {currentScreen === 'SEARCH_COLLECT' && (
          <SearchCollectGame
            mascotId={activeMascot}
            onBack={() => setCurrentScreen('MINI_GAME_SELECT')}
            onAddRewards={handleAddRewards}
            equippedHat={equippedHat}
            equippedGlasses={equippedGlasses}
            equippedOutfit={equippedOutfit}
            equippedHandheld={equippedHandheld}
          />
        )}

        {currentScreen === 'MULTIPLY_GARDEN' && (
          <MultiplyGardenGame
            mascotId={activeMascot}
            onBack={() => setCurrentScreen('MINI_GAME_SELECT')}
            onAddRewards={handleAddRewards}
            equippedHat={equippedHat}
            equippedGlasses={equippedGlasses}
            equippedOutfit={equippedOutfit}
            equippedHandheld={equippedHandheld}
          />
        )}

        {currentScreen === 'FAIR_SHARE' && (
          <FairShareGame
            mascotId={activeMascot}
            onBack={() => setCurrentScreen('MINI_GAME_SELECT')}
            onAddRewards={handleAddRewards}
            equippedHat={equippedHat}
            equippedGlasses={equippedGlasses}
            equippedOutfit={equippedOutfit}
            equippedHandheld={equippedHandheld}
          />
        )}

        {currentScreen === 'QUIZ_PLAY' && (
          <QuizPlayGame
            levelId={selectedQuiz.levelId}
            tier={selectedQuiz.tier}
            mascotId={activeMascot}
            onBack={() => setCurrentScreen('LEVEL_SELECT')}
            onCompleteLevel={handleCompleteLevel}
            equippedHat={equippedHat}
            equippedGlasses={equippedGlasses}
            equippedOutfit={equippedOutfit}
            equippedHandheld={equippedHandheld}
          />
        )}

        {currentScreen === 'WARDROBE_SHOP' && (
          <WardrobeShop
            coins={coins}
            playerLevel={Math.min(6, Math.floor(stars / 4) + 1)}
            activeMascot={activeMascot}
            equippedHat={equippedHat}
            equippedGlasses={equippedGlasses}
            equippedOutfit={equippedOutfit}
            equippedHandheld={equippedHandheld}
            unlockedItems={unlockedItems}
            onBack={() => setCurrentScreen('HOME')}
            onBuyItem={handleBuyItem}
            onEquipItem={handleEquipItem}
            onSelectMascot={handleSelectMascot}
          />
        )}
      </main>

      {/* Diploma Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        playerName={playerName}
        onUpdatePlayerName={name => {
          setPlayerName(name);
          saveState({ playerName: name });
        }}
        stars={stars}
        activeMascot={activeMascot}
      />

      {/* Simple Clean Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-sky-100 bg-white/50">
        <p>Zoraa Math · Belajar Matematika Ceria Bersama Zora & Sahabat Pintar</p>
      </footer>
    </div>
  );
}
