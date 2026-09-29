import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/audio';
import { MascotId } from '../types/game';
import { MASCOTS } from '../data/gameData';
import { MascotCharacter } from './MascotCharacter';
import { X, Printer, Award, Sparkles, Star } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  onUpdatePlayerName: (name: string) => void;
  stars: number;
  activeMascot: MascotId;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  playerName,
  onUpdatePlayerName,
  stars,
  activeMascot,
}) => {
  const [nameInput, setNameInput] = useState(playerName);
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    soundManager.playFanfare();
    window.print();
  };

  const handleSaveName = () => {
    soundManager.playPop(1.2);
    onUpdatePlayerName(nameInput.trim() || 'Zora');
    setIsEditing(false);
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border-4 border-amber-300"
        >
          {/* Close button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer print:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Certificate Border & Content (Designed for Printing) */}
          <div className="border-4 border-double border-amber-400 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-amber-50/50 via-white to-amber-50/50 text-center relative overflow-hidden">
            {/* Corner Rosettes */}
            <div className="absolute top-2 left-2 text-xl text-amber-500">⚜️</div>
            <div className="absolute top-2 right-2 text-xl text-amber-500">⚜️</div>
            <div className="absolute bottom-2 left-2 text-xl text-amber-500">⚜️</div>
            <div className="absolute bottom-2 right-2 text-xl text-amber-500">⚜️</div>

            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-8 h-8 text-amber-600" />
              <span className="text-xs font-black tracking-widest uppercase text-amber-700">
                SERTIFIKAT PENGHARGAAN
              </span>
              <Award className="w-8 h-8 text-amber-600" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight mb-2">
              BINTANG JUARA MATEMATIKA
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mb-6">
              Diberikan dengan bangga dari Zoraa Math kepada:
            </p>

            {/* Child's Name */}
            <div className="mb-6">
              {isEditing ? (
                <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    className="border-2 border-teal-500 rounded-xl px-3 py-1.5 text-center font-black text-xl text-teal-800 focus:outline-none w-full"
                    placeholder="Nama Anak..."
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-3 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-teal-700"
                  >
                    Simpan
                  </button>
                </div>
              ) : (
                <div className="inline-block relative">
                  <h3
                    onClick={() => setIsEditing(true)}
                    className="text-3xl sm:text-5xl font-black text-teal-700 border-b-2 border-dashed border-teal-400 pb-1 cursor-pointer hover:text-teal-800"
                    title="Sentuh untuk mengubah nama"
                  >
                    {playerName || 'Zora'}
                  </h3>
                  <span className="block text-[10px] text-slate-400 mt-1 print:hidden">
                    (Sentuh nama untuk mengubah)
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
              Telah menunjukkan semangat belajar luar biasa, ketekunan berhitung, dan keberhasilan menyelesaikan tantangan matematika di <strong className="text-teal-800">Zoraa Math</strong>.
            </p>

            {/* Stars & Seal */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-4 border-t border-amber-200">
              {/* Mascot Stamp */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 pointer-events-none">
                  <MascotCharacter mascotId={activeMascot} mood="cheer" size="sm" showSpeechBubble={false} />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-700 block">
                    Sahabat Belajar:
                  </span>
                  <span className="text-sm font-extrabold text-teal-800">
                    {MASCOTS[activeMascot].name}
                  </span>
                </div>
              </div>

              {/* Stars Badge */}
              <div className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-4 py-2 rounded-2xl border border-amber-300 shadow-xs">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span className="font-extrabold text-sm">{stars} Bintang Kehormatan</span>
              </div>

              {/* Date */}
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 block">
                  Tanggal Penghargaan:
                </span>
                <span className="text-xs font-extrabold text-slate-700">
                  {currentDate}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3 print:hidden">
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sertifikat 🖨️</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
