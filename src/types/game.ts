export type GameScreen = 
  | 'HOME'               // Beranda Petualangan
  | 'LEVEL_SELECT'      // Pilih Tingkat & Dunia
  | 'MINI_GAME_SELECT'  // Pilih Mini-Game
  | 'MATCHING_GAME'     // Game Cocokkan Angka & Jumlah
  | 'PATTERN_GAME'      // Game Kereta Pola & Urutan
  | 'SEARCH_COLLECT'    // Game Cari & Petik Benda
  | 'MULTIPLY_GARDEN'   // Game Kebun Perkalian Visual
  | 'FAIR_SHARE'        // Game Berbagi Adil (Pembagian Visual)
  | 'QUIZ_PLAY'         // Kuis Cepat & Latihan Soal
  | 'WARDROBE_SHOP'     // Lemari Kostum & Toko Hadiah
  | 'STICKER_ALBUM'     // Album Stiker Ceria
  | 'CERTIFICATE';      // Sertifikat Bintang Juara

export type DifficultyTier = 
  | 1 // Tingkat 1: Pengenalan Angka & Hitung Benda (1-10)
  | 2 // Tingkat 2: Penjumlahan Dasar Bergambar (Hasil s/d 10)
  | 3 // Tingkat 3: Pengurangan Dasar Bergambar (1-10)
  | 4 // Tingkat 4: Pola Angka & Urutan (Sequence & Skip Counting)
  | 5 // Tingkat 5: Perkalian Ramah Anak (Konsep Kelompok & Bunga)
  | 6 // Tingkat 6: Pembagian Adil (Konsep Berbagi Sama Rata)

export type MascotId = 'zora' | 'mimi' | 'boni' | 'piko' | 'cici';
export type MascotMood = 'idle' | 'happy' | 'cheer' | 'thinking' | 'dance';

export interface Mascot {
  id: MascotId;
  name: string;
  species: string;
  color: string;
  accentColor: string;
  quote: string;
  favoriteThing: string;
  description: string;
}

export type CustomizationCategory = 'hat' | 'glasses' | 'outfit' | 'handheld';

export interface WardrobeItem {
  id: string;
  name: string;
  category: CustomizationCategory;
  emoji: string;
  coinCost: number;
  requiredLevel: number;
  description: string;
}

export interface PlacedSticker {
  id: string;
  stickerId: string;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export interface LevelInfo {
  id: number;
  tier: DifficultyTier;
  worldName: string;
  title: string;
  conceptSubtitle: string;
  icon: string;
  requiredStarsToUnlock: number;
  colorTheme: string;
  description: string;
}

export interface UserStats {
  playerName: string;
  coins: number;
  stars: number;
  currentTier: DifficultyTier;
  highestStreak: number;
  currentStreak: number;
  totalCorrect: number;
  totalPlayed: number;
  activeMascot: MascotId;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedOutfit?: string;
  equippedHandheld?: string;
  unlockedItems: string[];
  levelProgress: Record<number, { stars: number; highScore: number; completed: boolean }>;
  placedStickers: PlacedSticker[];
}
