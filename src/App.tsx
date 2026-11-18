import React, { useState, useRef, useEffect } from 'react';
import { TuningPhoneView } from './components/TuningPhoneView';
import { 
  INITIAL_SONGS, 
  INITIAL_PLAYLISTS, 
  INITIAL_CHAT_ROOMS, 
  INITIAL_CHAT_MESSAGES 
} from './data/musicData';
import { Song, Playlist, ChatRoom, ChatMessage } from './types';

export default function App() {
  // 1. Core Music & Playlist State
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [chatRooms] = useState<ChatRoom[]>(INITIAL_CHAT_ROOMS);
  
  const [currentSong, setCurrentSong] = useState<Song>(INITIAL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(INITIAL_SONGS[0].duration);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  // 2. Navigation & View State
  const [activeView, setActiveView] = useState<string>('tuning');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 3. Live SoundRoom Chat State
  const [activeRoomId, setActiveRoomId] = useState<string>('room-global-hits');
  const [roomMessages, setRoomMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_MESSAGES);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(true);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // 4. Drawers & Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);
  const [isAiPlaylistModalOpen, setIsAiPlaylistModalOpen] = useState<boolean>(false);

  // Audio HTML5 element reference and play promise tracking
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio Synth Generator (Guarantees audible musical notes during play if native audio is blocked)
  const playSynthNote = (freq: number) => {
    if (isMuted || volume <= 0) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const vol = (volume > 1 ? volume / 100 : volume) * 0.12;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } catch {
      // AudioContext fallback ignored
    }
  };

  const safePlay = async () => {
    if (!audioRef.current) return;
    try {
      const promise = audioRef.current.play();
      playPromiseRef.current = promise;
      await promise;
    } catch (err: any) {
      if (err?.name !== 'NotAllowedError' && err?.name !== 'AbortError') {
        console.log('Audio play handled:', err);
      }
    }
  };

  const safePause = async () => {
    if (!audioRef.current) return;
    if (playPromiseRef.current) {
      try {
        await playPromiseRef.current;
      } catch {
        // ignore pending play promise errors
      }
    }
    audioRef.current.pause();
  };

  // Sync Audio Source and Playback
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentSong.audioUrl);
      audioRef.current.volume = isMuted ? 0 : volume;
    } else {
      const currentSrc = audioRef.current.src || '';
      if (!currentSrc.endsWith(currentSong.audioUrl) && currentSrc !== currentSong.audioUrl) {
        audioRef.current.src = currentSong.audioUrl;
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
      audioRef.current.volume = isMuted ? 0 : volume;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (audio.currentTime > 0) {
        setCurrentTime(audio.currentTime);
      }
    };
    const handleLoadedMetadata = () => setDuration(audio.duration || currentSong.duration);
    const handleEnded = () => handleNextSong();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      safePlay();
    } else {
      safePause();
    }

    return (
    <div className="h-screen w-screen bg-black overflow-hidden font-sans text-neutral-100 flex items-center justify-center">
      <div className="w-full max-w-lg h-full relative overflow-hidden flex flex-col justify-between bg-black text-white shadow-2xl">
        <TuningPhoneView
          songs={songs}
          currentSong={currentSong || songs[0]}
          isPlaying={isPlaying}
          onPlaySong={handlePlaySong}
          onTogglePlay={handleTogglePlay}
          onToggleLikeSong={handleToggleLikeSong}
          onShareSongToChat={handleShareSongToChat}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          onNextSong={handleNextSong}
          onPrevSong={handlePrevSong}
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={setVolume}
          onToggleMute={() => setIsMuted(!isMuted)}
        />
      </div>
    </div>
  );
}
