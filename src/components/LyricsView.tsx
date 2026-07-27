import React from 'react';
import { X, Mic2, Music, ChevronLeft } from 'lucide-react';
import { Song } from '../types';

interface LyricsViewProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song | null;
  currentTime: number;
  onSeek?: (time: number) => void;
}

export const LyricsView: React.FC<LyricsViewProps> = ({
  isOpen,
  onClose,
  currentSong,
  currentTime,
  onSeek
}) => {
  if (!isOpen || !currentSong) return null;

  // Find active line based on current time
  let activeIndex = -1;
  if (currentSong.lyrics && currentSong.lyrics.length > 0) {
    for (let i = 0; i < currentSong.lyrics.length; i++) {
      if (currentTime >= currentSong.lyrics[i].time) {
        activeIndex = i;
      } else {
        break;
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-3xl flex flex-col justify-between p-6 select-none animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 px-3 py-1.5 rounded-full transition text-sm font-bold"
        >
          <ChevronLeft className="w-5 h-5 text-emerald-400" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <Mic2 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg md:text-xl font-black text-white">Full Lyrics</h2>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition border border-neutral-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Lyrics Body */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 my-8 overflow-hidden">
        {/* Album Artwork Display */}
        <div className="text-center space-y-4 shrink-0 max-w-sm">
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-64 h-64 md:w-80 md:h-80 rounded-2xl object-cover shadow-2xl mx-auto border border-neutral-800"
          />
          <div>
            <h3 className="text-2xl font-black text-white">{currentSong.title}</h3>
            <p className="text-sm text-emerald-400 font-semibold mt-1">{currentSong.artist}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{currentSong.album}</p>
          </div>
        </div>

        {/* Scrollable Lyrics Stream */}
        <div className="flex-1 max-w-2xl h-full overflow-y-auto space-y-6 text-center md:text-left pr-4 custom-scrollbar py-12">
          {currentSong.lyrics && currentSong.lyrics.length > 0 ? (
            currentSong.lyrics.map((line, idx) => {
              const isActive = idx === activeIndex;
              return (
                <p
                  key={idx}
                  onClick={() => onSeek && onSeek(line.time)}
                  className={`transition-all duration-300 font-bold cursor-pointer ${
                    isActive
                      ? 'text-3xl md:text-4xl text-emerald-400 scale-105 tracking-wide drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                      : 'text-xl md:text-2xl text-neutral-600 hover:text-neutral-300'
                  }`}
                >
                  {line.text}
                </p>
              );
            })
          ) : (
            <div className="text-center py-20 space-y-2">
              <Music className="w-12 h-12 text-neutral-600 mx-auto" />
              <p className="text-neutral-400 text-lg">Instrumental track or lyrics unavailable.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
