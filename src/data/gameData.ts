import { Mascot, WardrobeItem, LevelInfo } from '../types/game';

export const MASCOTS: Record<string, Mascot> = {
  zora: {
    id: 'zora',
    name: 'Zora',
    species: 'Sahabat Ceria Zoraa Math',
    color: '#0D9488', // teal
    accentColor: '#FB923C', // vibrant orange cheeks
    quote: 'Halo Zora dan anak-anak pinter! Ayo belajar matematika seru bareng Zora!',
    favoriteThing: 'Bintang Angka Emas ⭐',
    description: 'Maskot utama Zoraa Math berwarna teal dengan pipi oranye ceria dan senyum manis yang suka menyemangati anak-anak pinter!',
  },
  mimi: {
    id: 'mimi',
    name: 'Mimi',
    species: 'Kucing Ceria',
    color: '#FB923C',
    accentColor: '#FED7AA',
    quote: 'Meong! Ayo belajar berhitung bersama Mimi!',
    favoriteThing: 'Ikan Segar 🐟',
    description: 'Kucing ramah yang lincah dan suka sekali menghitung benda.',
  },
  boni: {
    id: 'boni',
    name: 'Boni',
    species: 'Beruang Madu',
    color: '#B45309',
    accentColor: '#FDE68A',
    quote: 'Halo teman cilik! Boni suka tambah madu manis!',
    favoriteThing: 'Toples Madu 🍯',
    description: 'Beruang penyabar yang jago penjumlahan dan suka menolong.',
  },
  piko: {
    id: 'piko',
    name: 'Piko',
    species: 'Penguin Pintar',
    color: '#0284C7',
    accentColor: '#BAE6FD',
    quote: 'Waddle waddle! Ayo kita cari dan cocokkan angka!',
    favoriteThing: 'Balok Es Kristal ❄️',
    description: 'Penguin pintar yang suka membandingkan angka dan mencari pola.',
  },
  cici: {
    id: 'cici',
    name: 'Cici',
    species: 'Kelinci Cerdas',
    color: '#EC4899',
    accentColor: '#FCE7F3',
    quote: 'Lompat gembira! Matematika itu mudah dan asyik!',
    favoriteThing: 'Wortel Renyah 🥕',
    description: 'Kelinci ceria yang suka pengurangan dan membagi kue sama rata.',
  },
};

export const LEVELS_DATA: LevelInfo[] = [
  {
    id: 1,
    tier: 1,
    worldName: 'Taman Angka Ceria',
    title: 'Pengenalan Angka & Hitung Benda',
    conceptSubtitle: 'Mengenal bilangan 1 sampai 10 dengan visual buah dan hewan',
    icon: '🍎',
    requiredStarsToUnlock: 0,
    colorTheme: 'from-amber-400 to-orange-500',
    description: 'Sentuh dan hitung buah, hewan, dan mainan lucu satu per satu!',
  },
  {
    id: 2,
    tier: 2,
    worldName: 'Dapur Buah Lezat',
    title: 'Penjumlahan Dasar Bergambar',
    conceptSubtitle: 'Menggabungkan dua kelompok benda (hasil 1 sampai 10)',
    icon: '🍓',
    requiredStarsToUnlock: 3,
    colorTheme: 'from-emerald-400 to-teal-500',
    description: 'Gabungkan apel di keranjang kiri dan kanan untuk mencari jumlahnya!',
  },
  {
    id: 3,
    tier: 3,
    worldName: 'Pesta Balon Terbang',
    title: 'Pengurangan Dasar Visual',
    conceptSubtitle: 'Benda yang diambil atau balon yang meletus (1 sampai 10)',
    icon: '🎈',
    requiredStarsToUnlock: 7,
    colorTheme: 'from-sky-400 to-indigo-500',
    description: 'Pecahkan balon atau makan biskuit untuk melihat sisa benda!',
  },
  {
    id: 4,
    tier: 4,
    worldName: 'Rel Kereta Pelangi',
    title: 'Pola Angka & Lompat Bilangan',
    conceptSubtitle: 'Menyusun urutan bilangan 1-10 dan pola warna',
    icon: '🚂',
    requiredStarsToUnlock: 12,
    colorTheme: 'from-purple-400 to-pink-500',
    description: 'Pasang gerbong kereta dengan angka dan pola yang tepat!',
  },
  {
    id: 5,
    tier: 5,
    worldName: 'Kebun Bunga Ajaib',
    title: 'Perkalian Ramah Anak (Kelompok Benda)',
    conceptSubtitle: 'Konsep penjumlahan berulang: 2 pot masing-masing 3 bunga',
    icon: '🌻',
    requiredStarsToUnlock: 17,
    colorTheme: 'from-rose-400 to-red-500',
    description: 'Hitung kelipatan pot bunga dan keranjang madu secara visual!',
  },
  {
    id: 6,
    tier: 6,
    worldName: 'Piknik Berbagi Rata',
    title: 'Pembagian Adil (Berbagi Sama Banyak)',
    conceptSubtitle: 'Konsep membagi biskuit atau permen ke beberapa teman hewan',
    icon: '🧺',
    requiredStarsToUnlock: 22,
    colorTheme: 'from-yellow-400 to-amber-500',
    description: 'Bagi donat dan apel ke piring teman-teman agar semua dapat sama banyak!',
  },
];

export const WARDROBE_ITEMS: WardrobeItem[] = [
  // 1. HATS
  { id: 'hat_party', name: 'Topi Pesta Ceria', category: 'hat', emoji: '🥳', coinCost: 15, requiredLevel: 1, description: 'Topi pesta warna-warni untuk perayaan!' },
  { id: 'hat_crown', name: 'Mahkota Emas Raja', category: 'hat', emoji: '👑', coinCost: 35, requiredLevel: 2, description: 'Mahkota berkilau untuk juara matematika!' },
  { id: 'hat_cowboy', name: 'Topi Koboi Cilik', category: 'hat', emoji: '🤠', coinCost: 25, requiredLevel: 2, description: 'Topi koboi petualang hutan angka.' },
  { id: 'hat_chef', name: 'Topi Koki Cilik', category: 'hat', emoji: '🧑‍🍳', coinCost: 30, requiredLevel: 3, description: 'Topi koki ahli pencampur buah.' },
  { id: 'hat_grad', name: 'Topi Wisuda Sarjana', category: 'hat', emoji: '🎓', coinCost: 50, requiredLevel: 5, description: 'Topi pintar untuk anak yang lulus semua tingkat!' },
  { id: 'hat_pirate', name: 'Topi Bajak Laut', category: 'hat', emoji: '🏴‍☠️', coinCost: 40, requiredLevel: 4, description: 'Topi pelaut pencari harta karun angka.' },

  // 2. GLASSES
  { id: 'glass_cool', name: 'Kacamata Hitam Keren', category: 'glasses', emoji: '🕶️', coinCost: 20, requiredLevel: 1, description: 'Kacamata gaya anak pintar.' },
  { id: 'glass_star', name: 'Kacamata Bintang Kuning', category: 'glasses', emoji: '⭐', coinCost: 25, requiredLevel: 2, description: 'Kacamata unik berbentuk bintang gemerlap.' },
  { id: 'glass_heart', name: 'Kacamata Hati Merah', category: 'glasses', emoji: '💖', coinCost: 30, requiredLevel: 3, description: 'Kacamata penuh cinta dan kasih sayang.' },
  { id: 'glass_prof', name: 'Kacamata Bulat Profesor', category: 'glasses', emoji: '👓', coinCost: 35, requiredLevel: 4, description: 'Kacamata profesor jenius matematika!' },

  // 3. OUTFITS
  { id: 'outfit_cape', name: 'Jubah Pahlawan Super', category: 'outfit', emoji: '🦸', coinCost: 35, requiredLevel: 2, description: 'Jubah terbang untuk pahlawan berhitung.' },
  { id: 'outfit_space', name: 'Baju Astronot Bulan', category: 'outfit', emoji: '🚀', coinCost: 45, requiredLevel: 3, description: 'Baju luar angkasa siap menjelajah galaksi!' },
  { id: 'outfit_dino', name: 'Kostum Dinosaurus', category: 'outfit', emoji: '🦖', coinCost: 40, requiredLevel: 4, description: 'Kostum dino hijau yang sangat menggemaskan.' },
  { id: 'outfit_fairy', name: 'Sayap Peri Pelangi', category: 'outfit', emoji: '🧚', coinCost: 50, requiredLevel: 5, description: 'Sayap magis yang membawa serbuk bintang.' },

  // 4. HANDHELD ITEMS
  { id: 'hand_wand', name: 'Tongkat Sihir Ajaib', category: 'handheld', emoji: '🪄', coinCost: 30, requiredLevel: 1, description: 'Tongkat ajaib pemanggil angka keberuntungan.' },
  { id: 'hand_icecream', name: 'Es Krim Tiga Rasa', category: 'handheld', emoji: '🍦', coinCost: 20, requiredLevel: 1, description: 'Es krim lezat dingin dan manis.' },
  { id: 'hand_balloon', name: 'Balon Hati Terbang', category: 'handheld', emoji: '🎈', coinCost: 15, requiredLevel: 1, description: 'Balon merah ceria yang melayang ringan.' },
  { id: 'hand_trophy', name: 'Piala Emas Bergengsi', category: 'handheld', emoji: '🏆', coinCost: 60, requiredLevel: 4, description: 'Piala kehormatan untuk anak terpintar!' },
];

export const ENCOURAGING_PHRASES = [
  'Luar biasa! Kamu sangat pintar!',
  'Hebat sekali! Angkanya tepat!',
  'Bintang matematika cilik!',
  'Mantap! Teruskan belajarnya!',
  'Wah, kamu cepat sekali!',
  'Keren banget! Mimi dan teman-teman bangga!',
];

export const RETRY_PHRASES = [
  'Hampir tepat! Ayo hitung lagi pelan-pelan ya.',
  'Coba sekali lagi, kamu pasti bisa!',
  'Jangan bersedih, mari kita coba bareng-bareng!',
  'Sentuh bendanya satu per satu untuk menghitung ya!',
];
