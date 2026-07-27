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
  const [activeRoomId, setActiveRoomId] = useState<string>('room-tamizh');
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
        const botNames = ['Priya R', 'Kumar V', 'Alex M', 'Anitha S'];
        const randomName = botNames[Math.floor(Math.random() * botNames.length)];
        const ambientReplies = [
          'Nice recommendation! Adding to my playlist ❤️',
          'Vibing to this track right now 🚀',
          'Super line pa! Truly matches the room mood ✨',
          'Love this music vibe! Whistle podu 🎶',
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
    <div className="h-screen w-screen bg-black overflow-hidden font-sans text-neutral-100 flex items-center justify-center">
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
  );
}
