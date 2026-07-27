import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageSquare, 
  Mic2,
  ListMusic,
  Share2
} from 'lucide-react';
import { Song } from '../types';

interface MusicPlayerBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  isLyricsOpen: boolean;
  isChatOpen: boolean;
  onTogglePlay: () => void;
  onNextSong: () => void;
  onPrevSong: () => void;
  onSeek: (time: number) => void;
  onChangeVolume: (vol: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleLikeSong: (songId: string) => void;
  onToggleLyrics: () => void;
  onToggleChat: () => void;
  onShareSongToChat: (song: Song) => void;
}

export const MusicPlayerBar: React.FC<MusicPlayerBarProps> = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffle,
  isRepeat,
  isLyricsOpen,
  isChatOpen,
  onTogglePlay,
  onNextSong,
  onPrevSong,
  onSeek,
  onChangeVolume,
  onToggleMute,
  onToggleShuffle,
  onToggleRepeat,
  onToggleLikeSong,
  onToggleLyrics,
  onToggleChat,
  onShareSongToChat
}) => {
  if (!currentSong) return null;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800/80 px-4 md:px-6 flex items-center justify-between z-50 select-none shadow-2xl">
      
      {/* 1. Left Track Info */}
      <div className="flex items-center gap-3.5 w-1/4 min-w-[200px]">
        <img
          src={currentSong.coverUrl}
          alt={currentSong.title}
          className="w-14 h-14 rounded-lg object-cover shadow-lg border border-neutral-800 shrink-0"
        />
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-white truncate hover:underline cursor-pointer">
            {currentSong.title}
          </p>
          <p className="text-xs text-neutral-400 truncate mt-0.5 hover:underline cursor-pointer">
            {currentSong.artist}
          </p>
        </div>

        <div className="flex items-center gap-1 ml-1">
          <button
            onClick={() => onToggleLikeSong(currentSong.id)}
            className={`p-1.5 rounded-full hover:bg-neutral-800 transition ${
              currentSong.isLiked ? 'text-rose-500' : 'text-neutral-400 hover:text-white'
            }`}
            title={currentSong.isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-4 h-4 ${currentSong.isLiked ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={() => onShareSongToChat(currentSong)}
            className="p-1.5 rounded-full text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800 transition"
            title="Share playing song to Room Chat"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Center Player Controls & Seek Bar */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-2xl px-4 gap-2">
        {/* Buttons */}
        <div className="flex items-center gap-5">
          <button
            onClick={onToggleShuffle}
            className={`p-1.5 rounded-full transition ${
              isShuffle ? 'text-emerald-400' : 'text-neutral-400 hover:text-white'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={onPrevSong}
            className="text-neutral-300 hover:text-white transition active:scale-90"
            title="Previous track"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-black" />
            ) : (
              <Play className="w-5 h-5 fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={onNextSong}
            className="text-neutral-300 hover:text-white transition active:scale-90"
            title="Next track"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={onToggleRepeat}
            className={`p-1.5 rounded-full transition ${
              isRepeat ? 'text-emerald-400' : 'text-neutral-400 hover:text-white'
            }`}
            title="Repeat"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline Seek Slider */}
        <div className="w-full flex items-center gap-2 text-[11px] font-mono text-neutral-400">
          <span>{formatTime(currentTime)}</span>
          <div className="relative flex-1 h-1.5 bg-neutral-800 rounded-full cursor-pointer group">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div
              className="h-full bg-emerald-500 rounded-full group-hover:bg-emerald-400 transition-all relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition shadow"></div>
            </div>
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. Right Utilities: Lyrics, SoundChat, Volume */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[200px]">
        {/* Lyrics Button */}
        <button
          onClick={onToggleLyrics}
          className={`p-2 rounded-lg transition ${
            isLyricsOpen ? 'bg-emerald-500/20 text-emerald-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
          title="Toggle Lyrics"
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Room Chat Button */}
        <button
          onClick={onToggleChat}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs transition shadow-md ${
            isChatOpen
              ? 'bg-emerald-500 text-black'
              : 'bg-neutral-800 text-emerald-400 border border-emerald-500/30 hover:bg-neutral-700'
          }`}
          title="Open Room Chat & AI DJ"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden lg:inline">Room Chat</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </button>

        {/* Volume */}
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={onToggleMute} className="text-neutral-400 hover:text-white transition">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => onChangeVolume(Number(e.target.value))}
            className="w-20 h-1 bg-neutral-800 accent-emerald-500 rounded-full cursor-pointer"
          />
        </div>
      </div>

    </div>
  );
};
