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

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, isPlaying]);

  // Fallback Timer for smooth UI playback & synchronized lyrics progress
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      const pentatonicScale = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25];
      interval = setInterval(() => {
        // Play gentle audio synth note if native HTML5 audio is paused or blocked
        if (!audioRef.current || audioRef.current.paused || audioRef.current.currentTime === 0) {
          const noteIdx = Math.floor(Date.now() / 1000) % pentatonicScale.length;
          playSynthNote(pentatonicScale[noteIdx]);
        }

        // If native audio is advancing fine, native timeupdate will update currentTime.
        if (audioRef.current && !audioRef.current.paused && audioRef.current.currentTime > 0) {
          return;
        }
        setCurrentTime((prev) => {
          const songDuration = duration || currentSong.duration || 200;
          if (prev >= songDuration) {
            handleNextSong();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration, currentSong.id, volume, isMuted]);

  // Sync Volume & Mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle Play / Pause Toggle
  const handleTogglePlay = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setIsPlaying((prev) => !prev);
  };

  // Play Specific Song
  const handlePlaySong = (song: Song) => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    if (currentSong.id === song.id) {
      setIsPlaying((prev) => !prev);
    } else {
      setCurrentSong(song);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(true);
    }
  };

  // Skip Next Song
  const handleNextSong = () => {
    if (isRepeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      safePlay();
      return;
    }

    let nextIndex: number;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else {
      const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
      nextIndex = (currentIndex + 1) % songs.length;
    }
    const nextSong = songs[nextIndex];
    if (nextSong) {
      if (currentSong.id === nextSong.id) {
        if (audioRef.current) audioRef.current.currentTime = 0;
        setCurrentTime(0);
        setIsPlaying(true);
      } else {
        setCurrentSong(nextSong);
        setCurrentTime(0);
        if (audioRef.current) audioRef.current.currentTime = 0;
        setIsPlaying(true);
      }
    }
  };

  // Skip Previous Song
  const handlePrevSong = () => {
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    const prevSong = songs[prevIndex];
    if (prevSong) {
      if (currentSong.id === prevSong.id) {
        if (audioRef.current) audioRef.current.currentTime = 0;
        setCurrentTime(0);
        setIsPlaying(true);
      } else {
        setCurrentSong(prevSong);
        setCurrentTime(0);
        if (audioRef.current) audioRef.current.currentTime = 0;
        setIsPlaying(true);
      }
    }
  };

  // Seek Time
  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Volume & Mute
  const handleChangeVolume = (vol: number) => {
    setVolume(vol);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : volume;
    }
  };

  // Toggle Like Song
  const handleToggleLikeSong = (songId: string) => {
    setSongs((prev) =>
      prev.map((s) => (s.id === songId ? { ...s, isLiked: !s.isLiked } : s))
    );
  };

  // Share Song to Room Chat
  const handleShareSongToChat = (song: Song) => {
    setIsChatOpen(true);
    const activeMsgs = roomMessages[activeRoomId] || [];
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      text: `Check out this song: "${song.title}" by ${song.artist}! 🎶`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sharedSongId: song.id,
      roomTopic: activeRoomId,
    };

    setRoomMessages({
      ...roomMessages,
      [activeRoomId]: [...activeMsgs, newMsg],
    });
  };

  // Send Chat Message & AI Call
  const handleSendMessage = async (text: string, imageBase64?: string) => {
    const activeMsgs = roomMessages[activeRoomId] || [];
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      text: text,
      imageUrl: imageBase64,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      roomTopic: activeRoomId,
    };

    const updatedMsgs = [...activeMsgs, userMsg];
    setRoomMessages({
      ...roomMessages,
      [activeRoomId]: updatedMsgs,
    });

    // If in AI DJ Room, or message mentions AI/image, send to backend Express API
    if (activeRoomId === 'room-ai-dj' || text.toLowerCase().includes('ai') || imageBase64) {
      setIsAiLoading(true);
      try {
        const activeRoom = chatRooms.find((r) => r.id === activeRoomId);
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            imageData: imageBase64,
            roomTopic: activeRoom?.name || 'General',
            currentSongTitle: currentSong.title,
          }),
        });
        const data = await res.json();

        const aiReplyMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          sender: 'ai',
          senderName: 'Gemini AI DJ 🎧',
          senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
          text: data.reply || 'Grooving to the music!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sharedSongId: data.suggestedSongId,
          roomTopic: activeRoomId,
        };

        setRoomMessages((prev) => ({
          ...prev,
          [activeRoomId]: [...(prev[activeRoomId] || []), aiReplyMsg],
        }));
      } catch (err) {
        console.error('Error fetching AI response:', err);
      } finally {
        setIsAiLoading(false);
      }
    } else {
      // Ambient live listener auto-reply in social rooms after 1.5s
      setTimeout(() => {
        const botNames = ['Marcus Cole', 'Sarah Jenkins', 'Alex Miller', 'Elena Rostova'];
        const randomName = botNames[Math.floor(Math.random() * botNames.length)];
        const ambientReplies = [
          'This chorus hits so hard! Adding to favorites ❤️',
          'The melody at 1:12 is pure magic ✨',
          'Sending this exact lyric to my best friend 🎶',
          'Such a chill vibe for late night listening 🌙',
        ];
        const randomReply = ambientReplies[Math.floor(Math.random() * ambientReplies.length)];

        const ambientMsg: ChatMessage = {
          id: `msg-amb-${Date.now()}`,
          sender: 'friend_priya',
          senderName: randomName,
          senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          roomTopic: activeRoomId,
        };

        setRoomMessages((prev) => ({
          ...prev,
          [activeRoomId]: [...(prev[activeRoomId] || []), ambientMsg],
        }));
      }, 1500);
    }
  };

  const handleAddPlaylist = (newPlaylist: Playlist) => {
    setPlaylists([newPlaylist, ...playlists]);
    setSelectedPlaylistId(newPlaylist.id);
    setActiveView('playlist');
  };

  const activeRoom = chatRooms.find((r) => r.id === activeRoomId) || chatRooms[0];
  const activeRoomMsgList = roomMessages[activeRoomId] || [];
  const likedCount = songs.filter((s) => s.isLiked).length;

  return (
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center p-0 sm:py-6 sm:px-4 relative overflow-hidden font-sans text-neutral-100">
      {/* Ambient Background Glow for Desktop */}
      <div className="hidden sm:block absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden sm:block absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Desktop Top Header Bar */}
      <header className="hidden sm:flex items-center justify-between w-full max-w-[420px] mb-3 px-2 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-white text-xs font-black">T</span>
          </div>
          <div>
            <h1 className="text-xs font-extrabold tracking-tight text-white flex items-center gap-1.5">
              TUNING <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">Concept</span>
            </h1>
            <p className="text-[10px] text-neutral-400 font-medium">By Ashokkumar S · Associate PM</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <a
            href="https://github.com/ashokkumarone/Tuning-Music"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 font-medium transition border border-neutral-700/60"
          >
            GitHub ↗
          </a>
          <a
            href="https://github.com/ashokkumarone/Tuning-Music/blob/main/Tuning_Product_Requirements.md"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-medium transition border border-cyan-500/30"
          >
            PRD ↗
          </a>
        </div>
      </header>

      {/* Phone Container */}
      <div className="w-full sm:max-w-[420px] h-screen sm:h-[88vh] sm:max-h-[860px] bg-black sm:rounded-[48px] sm:border-[8px] sm:border-neutral-800/90 shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-col justify-between">
        {/* iPhone Dynamic Island Mockup on Desktop */}
        <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800" />
          <div className="w-2 h-2 rounded-full bg-cyan-900/60" />
        </div>

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
