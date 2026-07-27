import React, { useState } from 'react';
import { 
  Bell, 
  MessageSquare, 
  Heart, 
  Play, 
  Pause, 
  MoreHorizontal, 
  Home, 
  Search, 
  Library, 
  ChevronLeft,
  ChevronDown, 
  Check, 
  Shuffle, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Share2, 
  Send,
  Smile,
  Music,
  Sparkles,
  Volume2,
  VolumeX,
  User,
  Settings,
  Sliders,
  Shield,
  HardDrive,
  Moon,
  Sun,
  Monitor,
  Zap,
  X,
  LogOut,
  SlidersHorizontal,
  ListMusic,
  Mic2,
  Radio,
  Disc,
  Info,
  Archive,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { Song } from '../types';

interface TuningPhoneViewProps {
  songs: Song[];
  currentSong: Song;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onTogglePlay: () => void;
  onToggleLikeSong: (songId: string) => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onShareSongToChat?: (songTitle: string, friendId: string) => void;
  onNextSong?: () => void;
  onPrevSong?: () => void;
  volume?: number;
  isMuted?: boolean;
  onVolumeChange?: (vol: number) => void;
  onToggleMute?: () => void;
}

interface ChatMessageCard {
  id: string;
  sender: 'friend' | 'me';
  songTitle: string;
  artistAlbum: string;
  cardColor: string; // Tailwind color class or hex
  iconType: 'guitar' | 'piano' | 'mic';
  lyricQuote?: string;
  isPro?: boolean;
  timestamp: string;
  reactions: { emoji: string; count: number }[];
}

interface FriendContact {
  id: string;
  name: string;
  avatarLetter: string;
  avatarBg: string;
  currentTrack: string;
  timeAgo: string;
  unreadCount?: number;
  isHighlighted?: boolean;
}

export const TuningPhoneView: React.FC<TuningPhoneViewProps> = ({
  songs,
  currentSong,
  isPlaying,
  onPlaySong,
  onTogglePlay,
  onToggleLikeSong,
  currentTime,
  duration,
  onSeek,
  onShareSongToChat,
  onNextSong,
  onPrevSong,
  volume = 0.8,
  isMuted = false,
  onVolumeChange,
  onToggleMute,
}) => {
  // Mobile active screen tab: 'home' | 'tuning_list' | 'chat_friend' | 'now_playing'
  const [activeScreen, setActiveScreen] = useState<'home' | 'tuning_list' | 'chat_friend' | 'now_playing'>('home');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  // Music Player Enhanced States
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [showLyrics, setShowLyrics] = useState<boolean>(false);
  const [showQueue, setShowQueue] = useState<boolean>(false);
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);

  // Selected Friend for Chat
  const [selectedFriend, setSelectedFriend] = useState<FriendContact | null>(null);

  // Profile & Settings Modal State
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [audioQuality, setAudioQuality] = useState<string>('High');
  const [equalizer, setEqualizer] = useState<string>('Bass Boost');
  const [themeMode, setThemeMode] = useState<'system' | 'light' | 'dark'>('system');
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const isDark = themeMode === 'dark' ? true : (themeMode === 'light' ? false : systemPrefersDark);
  const [gaplessPlayback, setGaplessPlayback] = useState<boolean>(true);
  const [downloadWifiOnly, setDownloadWifiOnly] = useState<boolean>(true);
  const [dataSaver, setDataSaver] = useState<boolean>(false);
  const [privateSession, setPrivateSession] = useState<boolean>(false);
  
  // Modals inside tuning flow
  const [isSendToModalOpen, setIsSendToModalOpen] = useState<boolean>(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);

  // Search in tuning list & home
  const [chatSearchQuery, setChatSearchQuery] = useState<string>('');
  const [homeSearchQuery, setHomeSearchQuery] = useState<string>('');

  // Long press / Action modal state for contacts
  const [actionContact, setActionContact] = useState<FriendContact | null>(null);
  const [archivedContactIds, setArchivedContactIds] = useState<string[]>([]);
  const [deletedContactIds, setDeletedContactIds] = useState<string[]>([]);
  const pressTimerRef = React.useRef<any>(null);

  const handleTouchStartContact = (contact: FriendContact) => {
    pressTimerRef.current = setTimeout(() => {
      setActionContact(contact);
    }, 500);
  };

  const handleTouchEndContact = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }
  };

  // Sample contacts matching screenshots
  const contacts: FriendContact[] = [
    {
      id: 'riya',
      name: 'Riya',
      avatarLetter: 'R',
      avatarBg: 'bg-purple-600',
      currentTrack: 'Cruel Summer',
      timeAgo: '11:02 AM',
      unreadCount: 3,
      isHighlighted: false,
    },
    {
      id: 'karthik',
      name: 'Karthik',
      avatarLetter: 'K',
      avatarBg: 'bg-amber-600',
      currentTrack: 'Blinding Lights',
      timeAgo: 'Yesterday',
    },
    {
      id: 'priya',
      name: 'Priya',
      avatarLetter: 'P',
      avatarBg: 'bg-pink-600',
      currentTrack: 'As It Was',
      timeAgo: 'Yesterday',
      unreadCount: 1,
    },
    {
      id: 'vikram',
      name: 'Vikram',
      avatarLetter: 'V',
      avatarBg: 'bg-cyan-600',
      currentTrack: 'Die With A Smile',
      timeAgo: 'Mon',
    },
    {
      id: 'sneha',
      name: 'Sneha',
      avatarLetter: 'S',
      avatarBg: 'bg-yellow-500',
      currentTrack: 'Espresso',
      timeAgo: 'Sun',
    },
    {
      id: 'arjun',
      name: 'Arjun',
      avatarLetter: 'A',
      avatarBg: 'bg-emerald-600',
      currentTrack: 'Levitating',
      timeAgo: 'Sat',
    },
  ];

  // Per-contact chat message history map
  const [messagesByContact, setMessagesByContact] = useState<Record<string, ChatMessageCard[]>>({
    riya: [
      {
        id: 'msg-r1',
        sender: 'friend',
        songTitle: 'Kannana Kanne',
        artistAlbum: 'D. Imman • Viswasam',
        cardColor: 'bg-rose-500',
        iconType: 'mic',
        timestamp: '09:15 AM',
        reactions: [{ emoji: '❤️', count: 1 }],
      },
      {
        id: 'msg-r2',
        sender: 'me',
        songTitle: 'Kadhal Anukkal',
        artistAlbum: 'A.R. Rahman • Enthiran',
        cardColor: 'bg-indigo-600',
        iconType: 'guitar',
        timestamp: '09:28 AM',
        reactions: [],
      },
      {
        id: 'msg-r3',
        sender: 'friend',
        songTitle: 'Cruel Summer',
        artistAlbum: 'Taylor Swift • Lover',
        cardColor: 'bg-pink-500',
        iconType: 'guitar',
        timestamp: '10:23 AM',
        reactions: [],
      },
      {
        id: 'msg-r4',
        sender: 'me',
        songTitle: 'Perfect',
        artistAlbum: 'Ed Sheeran • Divide',
        cardColor: 'bg-sky-500',
        iconType: 'piano',
        timestamp: '10:35 AM',
        reactions: [{ emoji: '😍', count: 1 }],
      },
      {
        id: 'msg-r5',
        sender: 'friend',
        songTitle: 'Die With A Smile',
        artistAlbum: 'Lady Gaga & Bruno Mars',
        cardColor: 'bg-purple-600',
        iconType: 'mic',
        timestamp: '10:50 AM',
        reactions: [],
      },
    ],
    karthik: [
      {
        id: 'msg-k1',
        sender: 'friend',
        songTitle: 'Hukum - Jailer',
        artistAlbum: 'Anirudh Ravichander • Jailer',
        cardColor: 'bg-amber-600',
        iconType: 'guitar',
        timestamp: 'Yesterday 04:10 PM',
        reactions: [{ emoji: '🔥', count: 1 }],
      },
      {
        id: 'msg-k2',
        sender: 'me',
        songTitle: 'Believer',
        artistAlbum: 'Imagine Dragons • Evolve',
        cardColor: 'bg-indigo-600',
        iconType: 'piano',
        timestamp: 'Yesterday 04:15 PM',
        reactions: [],
      },
      {
        id: 'msg-k3',
        sender: 'friend',
        songTitle: 'Neeye Oli',
        artistAlbum: 'Santhosh Narayanan • Sarpatta',
        cardColor: 'bg-emerald-600',
        iconType: 'mic',
        timestamp: 'Yesterday 05:00 PM',
        reactions: [],
      },
      {
        id: 'msg-k4',
        sender: 'me',
        songTitle: 'Naa Ready',
        artistAlbum: 'Anirudh Ravichander • Leo',
        cardColor: 'bg-rose-600',
        iconType: 'guitar',
        timestamp: 'Yesterday 05:30 PM',
        reactions: [{ emoji: '🔥', count: 1 }],
      },
    ],
    priya: [
      {
        id: 'msg-p1',
        sender: 'friend',
        songTitle: 'As It Was',
        artistAlbum: "Harry Styles • Harry's House",
        cardColor: 'bg-pink-500',
        iconType: 'piano',
        timestamp: 'Yesterday 02:15 PM',
        reactions: [],
      },
      {
        id: 'msg-p2',
        sender: 'me',
        songTitle: 'Enjoy Enjaami',
        artistAlbum: 'Dhee & Arivu • Santhosh N',
        cardColor: 'bg-emerald-500',
        iconType: 'mic',
        timestamp: 'Yesterday 02:30 PM',
        reactions: [{ emoji: '🎵', count: 1 }],
      },
      {
        id: 'msg-p3',
        sender: 'friend',
        songTitle: 'Espresso',
        artistAlbum: 'Sabrina Carpenter',
        cardColor: 'bg-yellow-500',
        iconType: 'guitar',
        timestamp: 'Yesterday 03:00 PM',
        reactions: [],
      },
    ],
    vikram: [
      {
        id: 'msg-v1',
        sender: 'friend',
        songTitle: 'Arabic Kuthu',
        artistAlbum: 'Anirudh Ravichander • Beast',
        cardColor: 'bg-cyan-600',
        iconType: 'mic',
        timestamp: 'Mon 11:10 AM',
        reactions: [],
      },
      {
        id: 'msg-v2',
        sender: 'me',
        songTitle: 'Fear Song',
        artistAlbum: 'Anirudh Ravichander • Devara',
        cardColor: 'bg-indigo-600',
        iconType: 'guitar',
        timestamp: 'Mon 11:45 AM',
        reactions: [{ emoji: '🔥', count: 1 }],
      },
      {
        id: 'msg-v3',
        sender: 'friend',
        songTitle: 'Badass',
        artistAlbum: 'Anirudh Ravichander • Leo',
        cardColor: 'bg-slate-800',
        iconType: 'piano',
        timestamp: 'Mon 12:15 PM',
        reactions: [],
      },
      {
        id: 'msg-v4',
        sender: 'me',
        songTitle: 'Die With A Smile',
        artistAlbum: 'Lady Gaga & Bruno Mars',
        cardColor: 'bg-sky-500',
        iconType: 'mic',
        timestamp: 'Mon 12:50 PM',
        reactions: [],
      },
    ],
    sneha: [
      {
        id: 'msg-s1',
        sender: 'friend',
        songTitle: 'Ordinary Person',
        artistAlbum: 'Anirudh Ravichander • Leo',
        cardColor: 'bg-yellow-500',
        iconType: 'guitar',
        timestamp: 'Sun 06:20 PM',
        reactions: [],
      },
      {
        id: 'msg-s2',
        sender: 'me',
        songTitle: 'Night Changes',
        artistAlbum: 'One Direction • Four',
        cardColor: 'bg-purple-600',
        iconType: 'piano',
        timestamp: 'Sun 06:45 PM',
        reactions: [{ emoji: '🥺', count: 1 }],
      },
      {
        id: 'msg-s3',
        sender: 'friend',
        songTitle: 'Heeriye',
        artistAlbum: 'Jasleen Royal & Arijit Singh',
        cardColor: 'bg-rose-500',
        iconType: 'mic',
        timestamp: 'Sun 07:10 PM',
        reactions: [],
      },
    ],
    arjun: [
      {
        id: 'msg-a1',
        sender: 'friend',
        songTitle: 'Levitating',
        artistAlbum: 'Dua Lipa • Future Nostalgia',
        cardColor: 'bg-emerald-600',
        iconType: 'piano',
        timestamp: 'Sat 08:10 PM',
        reactions: [],
      },
      {
        id: 'msg-a2',
        sender: 'me',
        songTitle: 'Kaavaalaa',
        artistAlbum: 'Anirudh Ravichander • Jailer',
        cardColor: 'bg-amber-500',
        iconType: 'mic',
        timestamp: 'Sat 08:25 PM',
        reactions: [{ emoji: '🎵', count: 1 }],
      },
      {
        id: 'msg-a3',
        sender: 'friend',
        songTitle: 'Illuminati',
        artistAlbum: 'Sushin Shyam • Aavesham',
        cardColor: 'bg-indigo-600',
        iconType: 'guitar',
        timestamp: 'Sat 08:40 PM',
        reactions: [{ emoji: '🔥', count: 1 }],
      },
      {
        id: 'msg-a4',
        sender: 'me',
        songTitle: 'Starboy',
        artistAlbum: 'The Weeknd • Starboy',
        cardColor: 'bg-purple-600',
        iconType: 'piano',
        timestamp: 'Sat 09:00 PM',
        reactions: [],
      },
      {
        id: 'msg-a5',
        sender: 'friend',
        songTitle: 'Rolex Theme',
        artistAlbum: 'Anirudh Ravichander • Vikram',
        cardColor: 'bg-neutral-800',
        iconType: 'guitar',
        timestamp: 'Sat 09:30 PM',
        reactions: [],
      },
    ],
  });

  const activeFriendId = selectedFriend?.id || 'riya';
  const chatMessages = messagesByContact[activeFriendId] || [];

  const handleToggleReaction = (msgId: string, emoji: string) => {
    setMessagesByContact((prev) => {
      const currentList = prev[activeFriendId] || [];
      const updatedList = currentList.map((msg) => {
        if (msg.id !== msgId) return msg;
        const currentEmoji = msg.reactions[0]?.emoji;
        if (currentEmoji === emoji) {
          return { ...msg, reactions: [] };
        } else {
          return { ...msg, reactions: [{ emoji, count: 1 }] };
        }
      });
      return { ...prev, [activeFriendId]: updatedList };
    });
  };

  const handleSendSongToFriend = () => {
    const targetIds = selectedContacts.length > 0
      ? selectedContacts
      : (selectedFriend ? [selectedFriend.id] : ['riya']);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessagesByContact((prev) => {
      const updated = { ...prev };
      targetIds.forEach((id) => {
        const newMsg: ChatMessageCard = {
          id: `msg-${Date.now()}-${id}`,
          sender: 'me',
          songTitle: currentSong.title,
          artistAlbum: `${currentSong.artist} • ${currentSong.album}`,
          cardColor: 'bg-gradient-to-r from-sky-500 to-indigo-500',
          iconType: 'guitar',
          timestamp,
          reactions: [],
        };
        updated[id] = [...(updated[id] || []), newMsg];
      });
      return updated;
    });

    const firstContact = contacts.find((c) => c.id === targetIds[0]);
    if (firstContact) {
      setSelectedFriend(firstContact);
    }
    setIsSendToModalOpen(false);
    setActiveScreen('chat_friend');
  };

  // Helper for rendering animated live emojis
  const renderLiveEmoji = (emoji: string) => {
    let animClass = 'emoji-live-pulse';
    if (emoji === '❤️') animClass = 'emoji-live-heart';
    else if (emoji === '🔥') animClass = 'emoji-live-flame';
    else if (emoji === '😭') animClass = 'emoji-live-cry';
    else if (emoji === '🎵' || emoji === '🎧') animClass = 'emoji-live-dance';
    else if (emoji === '🥺' || emoji === '😍') animClass = 'emoji-live-pulse';

    return <span className={animClass}>{emoji}</span>;
  };

  // Helper for rendering waveform
  const renderWaveform = () => (
    <div className="flex items-center gap-0.5 my-2 opacity-90">
      <span className="w-1 h-3 bg-sky-400 rounded-full animate-pulse"></span>
      <span className="w-1 h-5 bg-sky-400 rounded-full animate-pulse delay-75"></span>
      <span className="w-1 h-2 bg-sky-400 rounded-full"></span>
      <span className="w-1 h-6 bg-sky-400 rounded-full animate-pulse delay-150"></span>
      <span className="w-1 h-4 bg-sky-400 rounded-full"></span>
      <span className="w-1 h-2 bg-sky-400 rounded-full"></span>
      <span className="w-1 h-5 bg-sky-400 rounded-full animate-pulse"></span>
    </div>
  );

  const formatTimeStr = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  // Helper for rendering topic-wise horizontal song carousels
  const renderSongSection = (title: string, subtitle: string, songList: Song[]) => {
    if (!songList || songList.length === 0) return null;
    return (
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-sm sm:text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
            {subtitle && <p className={`text-[10px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>{subtitle}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 pt-0.5 -mx-4 px-4 sm:mx-0 sm:px-0">
          {songList.map((song) => {
            const isCurrent = currentSong?.id === song.id;
            return (
              <div 
                key={song.id}
                onClick={() => {
                  if (isCurrent) {
                    onTogglePlay();
                  } else {
                    onPlaySong(song);
                  }
                  setActiveScreen('now_playing');
                }}
                className={`w-28 sm:w-32 shrink-0 p-2 rounded-xl border cursor-pointer space-y-2 group transition relative shadow-md ${
                  isDark 
                    ? 'bg-neutral-900/90 border-neutral-800/80 hover:border-sky-500/50' 
                    : 'bg-white border-sky-100 hover:border-sky-300 shadow-sky-100/40'
                }`}
              >
                <div className={`w-full aspect-square rounded-lg overflow-hidden relative shadow ${isDark ? 'bg-neutral-800' : 'bg-sky-100/60'}`}>
                  <img 
                    src={song.coverUrl} 
                    alt={song.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                  />
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow transform group-hover:scale-110 transition">
                      {isCurrent && isPlaying ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white translate-x-0.5" />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <p className={`text-xs font-bold truncate ${isCurrent ? (isDark ? 'text-sky-400' : 'text-sky-600') : (isDark ? 'text-white group-hover:text-sky-400' : 'text-slate-900 group-hover:text-sky-600')}`}>
                    {song.title}
                  </p>
                  <p className={`text-[10px] truncate ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>{song.artist}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full h-screen flex justify-center select-none overflow-hidden transition-colors duration-200 ${isDark ? 'bg-neutral-950 text-white' : 'bg-sky-50/70 text-slate-900'}`}>
      
      {/* Clean Full Screen Container without Phone Bezel or Status Bar */}
      <div className={`w-full max-w-2xl h-full relative overflow-hidden flex flex-col justify-between shadow-2xl transition-colors duration-200 ${isDark ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
        
        {/* Dynamic Content Area - Each view rendered in its own scroll container */}
        <div className="flex-1 min-h-0 relative overflow-hidden">

          {/* ======================================================== */}
          {/* 1. HOME SCREEN (SCREEN 1) */}
          {/* ======================================================== */}
          <div className={`h-full overflow-y-auto no-scrollbar px-4 sm:px-6 space-y-5 pt-4 pb-20 ${activeScreen === 'home' ? 'block' : 'hidden'}`}>
            <div className="space-y-5 pt-1">
              {/* Header: Tuning + Notification & Profile Avatar */}
              <div className="flex items-center justify-between">
                <h1 className={`text-2xl sm:text-3xl font-serif font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Tuning</h1>
                <div className="flex items-center gap-2.5">
                  <button className={`p-2 rounded-full transition relative ${isDark ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-sky-100 text-slate-700'}`} title="Notifications">
                    <Bell className="w-5 h-5" />
                    <span className="w-2 h-2 bg-sky-400 rounded-full absolute top-2 right-2"></span>
                  </button>

                  {/* Profile Avatar Button */}
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className={`flex items-center gap-1.5 p-1.5 rounded-full transition border ${isDark ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700/80' : 'bg-white hover:bg-sky-50 border-sky-200 shadow-sm'}`}
                    title="Profile & Settings"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 via-sky-500 to-indigo-500 text-white font-extrabold flex items-center justify-center text-xs shadow">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Home Search Bar */}
              <div className="relative">
                <Search className={`w-4 h-4 absolute left-3.5 top-3 ${isDark ? 'text-neutral-400' : 'text-slate-400'}`} />
                <input
                  type="text"
                  placeholder="Search songs, artists, or albums..."
                  value={homeSearchQuery}
                  onChange={(e) => setHomeSearchQuery(e.target.value)}
                  className={`w-full rounded-2xl py-2.5 pl-10 ${homeSearchQuery ? 'pr-9' : 'pr-4'} text-xs font-medium outline-none transition border ${
                    isDark
                      ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-sky-400'
                      : 'bg-white border-sky-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 shadow-sm'
                  }`}
                />
                {homeSearchQuery && (
                  <button
                    onClick={() => setHomeSearchQuery('')}
                    className={`absolute right-3 top-2.5 p-0.5 rounded-full transition ${
                      isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-slate-400 hover:text-slate-700 hover:bg-sky-100'
                    }`}
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Live Search Results or Category Carousels */}
              {homeSearchQuery.trim() ? (
                <div className="space-y-4 pt-1">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-xs sm:text-sm font-bold ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                      Search Results for "{homeSearchQuery}"
                    </h2>
                    <span className={`text-[11px] font-semibold ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
                      {
                        songs.filter((s) => {
                          const q = homeSearchQuery.trim().toLowerCase();
                          return (
                            s.title.toLowerCase().includes(q) ||
                            s.artist.toLowerCase().includes(q) ||
                            s.album.toLowerCase().includes(q) ||
                            s.genre?.toLowerCase().includes(q)
                          );
                        }).length
                      } songs found
                    </span>
                  </div>

                  {(() => {
                    const q = homeSearchQuery.trim().toLowerCase();
                    const matchedSongs = songs.filter((s) =>
                      s.title.toLowerCase().includes(q) ||
                      s.artist.toLowerCase().includes(q) ||
                      s.album.toLowerCase().includes(q) ||
                      s.genre?.toLowerCase().includes(q)
                    );

                    if (matchedSongs.length === 0) {
                      return (
                        <div className="py-12 text-center space-y-2">
                          <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${isDark ? 'bg-neutral-900 text-neutral-400 border border-neutral-800' : 'bg-sky-100 text-sky-600 border border-sky-200'}`}>
                            <Search className="w-6 h-6" />
                          </div>
                          <p className={`text-xs font-bold ${isDark ? 'text-neutral-300' : 'text-slate-800'}`}>
                            No songs match "{homeSearchQuery}"
                          </p>
                          <p className={`text-[11px] ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>
                            Try typing another song title, artist name, or letter.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 gap-2">
                        {matchedSongs.map((song) => {
                          const isCurrent = currentSong?.id === song.id;
                          return (
                            <div
                              key={song.id}
                              onClick={() => onPlaySong(song)}
                              className={`p-2.5 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 group ${
                                isCurrent
                                  ? (isDark ? 'bg-sky-950/60 border-sky-500/50' : 'bg-sky-100 border-sky-300')
                                  : (isDark ? 'bg-neutral-900/80 border-neutral-800/80 hover:border-sky-500/40' : 'bg-white border-sky-100 hover:border-sky-300 shadow-sm')
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 shadow">
                                  <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center shadow">
                                      {isCurrent && isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />}
                                    </div>
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className={`text-xs font-bold truncate ${isCurrent ? 'text-sky-500' : (isDark ? 'text-white' : 'text-slate-900')}`}>
                                    {song.title}
                                  </p>
                                  <p className={`text-[10px] truncate ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                                    {song.artist} • {song.album}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[10px] font-mono ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>
                                  {formatTimeStr(song.duration)}
                                </span>
                                <div className="w-7 h-7 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center">
                                  {isCurrent && isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 translate-x-0.5" />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <>
                  {/* Category Filter Chips */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {['All', 'Music', 'Podcasts'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-5 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                          categoryFilter === cat
                            ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/25'
                            : (isDark ? 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700' : 'bg-white text-slate-700 hover:bg-sky-100 border border-sky-100')
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

              {/* Conditional Content based on Category Filter */}
              {(categoryFilter === 'All' || categoryFilter === 'Music') && (
                <>
                  {/* Topic 1: Trending Pop Hits */}
                  {renderSongSection(
                    '🔥 Trending Pop Hits',
                    'The most played English hits this week',
                    songs.filter(s => ['Blinding Lights', 'Cruel Summer', 'Espresso', 'Flowers', 'As It Was', 'Shape of You', 'Levitating', '7 rings'].includes(s.title))
                  )}

                  {/* Topic 2: Chill & Melodic */}
                  {renderSongSection(
                    '☕ Chill & Melodic Acoustics',
                    'Soulful vocals, piano & soft acoustics',
                    songs.filter(s => ['Someone Like You', 'Yellow', 'Perfect', 'Drivers License', 'Die With A Smile', 'Bad Guy', 'Señorita'].includes(s.title))
                  )}

                  {/* Topic 3: High Energy */}
                  {renderSongSection(
                    '⚡ Rock, Synth & High Energy',
                    'Bangers for workout and party vibes',
                    songs.filter(s => ['Starboy', 'Sunflower', 'Demons', 'Payphone', 'Counting Stars', 'Stay'].includes(s.title))
                  )}

                  {/* Topic 4: Hip Hop */}
                  {renderSongSection(
                    '🎧 Hip Hop & Trap Hits',
                    'Top urban, hip hop & trap grooves',
                    songs.filter(s => ['God\'s Plan', 'Sunflower', 'Starboy', '7 rings', 'Bad Guy'].includes(s.title))
                  )}

                  {/* Topic 5: Fresh Discoveries */}
                  {renderSongSection(
                    '✨ Fresh Discoveries',
                    'Handpicked english tracks you might like',
                    songs.slice().reverse().slice(0, 8)
                  )}
                </>
              )}

              {/* Podcasts Section */}
              {(categoryFilter === 'All' || categoryFilter === 'Podcasts') && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className={`text-sm sm:text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>🎙️ Top Podcasts</h2>
                      <p className={`text-[10px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>Popular talk shows & episodes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 pt-0.5 -mx-4 px-4 sm:mx-0 sm:px-0">
                    {[
                      { title: 'The Joe Rogan Experience', host: 'Joe Rogan', category: 'Society & Culture', cover: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80' },
                      { title: 'Huberman Lab', host: 'Dr. Andrew Huberman', category: 'Health & Science', cover: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&q=80' },
                      { title: 'TED Radio Hour', host: 'NPR', category: 'Education & Ideas', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80' },
                      { title: 'Lex Fridman Podcast', host: 'Lex Fridman', category: 'Technology & AI', cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80' },
                      { title: 'Anything Goes', host: 'Emma Chamberlain', category: 'Lifestyle', cover: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
                    ].map((pod, i) => (
                      <div
                        key={i}
                        className={`w-28 sm:w-32 shrink-0 p-2 rounded-xl border cursor-pointer space-y-2 group transition shadow-md ${
                          isDark
                            ? 'bg-neutral-900/90 border-neutral-800/80 hover:border-sky-500/50'
                            : 'bg-white border-sky-100 hover:border-sky-300 shadow-sm'
                        }`}
                      >
                        <div className={`w-full aspect-square rounded-lg overflow-hidden relative shadow ${isDark ? 'bg-neutral-800' : 'bg-sky-100/60'}`}>
                          <img src={pod.cover} alt={pod.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow">
                              <Play className="w-4 h-4 fill-white translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className={`text-xs font-bold group-hover:text-sky-500 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{pod.title}</p>
                          <p className="text-[10px] text-neutral-400 truncate">{pod.host}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
                </>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. TUNING CONVERSATIONS LIST (SCREEN 2) */}
          {/* ======================================================== */}
          <div className={`h-full overflow-y-auto no-scrollbar px-4 sm:px-6 space-y-5 pt-4 pb-20 ${activeScreen === 'tuning_list' ? 'block' : 'hidden'}`}>
            <div className="space-y-4 pt-1">
              {/* Header: Tuning + Notification & Profile Avatar */}
              <div className="flex items-center justify-between">
                <h1 className={`text-2xl sm:text-3xl font-serif font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Tuning</h1>
                <div className="flex items-center gap-2.5">
                  <button className={`p-2 rounded-full transition relative ${isDark ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-sky-100 text-slate-700'}`} title="Notifications">
                    <Bell className="w-5 h-5" />
                    <span className="w-2 h-2 bg-sky-400 rounded-full absolute top-2 right-2"></span>
                  </button>

                  {/* Profile Avatar Button */}
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className={`flex items-center gap-1.5 p-1.5 rounded-full transition border ${isDark ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700/80' : 'bg-white hover:bg-sky-50 border-sky-200 shadow-sm'}`}
                    title="Profile & Settings"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 via-sky-500 to-indigo-500 text-white font-extrabold flex items-center justify-center text-xs shadow">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Search conversations */}
              <div className="relative">
                <Search className={`w-4 h-4 absolute left-3.5 top-3 ${isDark ? 'text-neutral-400' : 'text-slate-400'}`} />
                <input
                  type="text"
                  placeholder="Search chats or song names..."
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  className={`w-full rounded-2xl py-2.5 pl-10 ${chatSearchQuery ? 'pr-9' : 'pr-4'} text-xs font-medium outline-none transition border ${
                    isDark
                      ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-sky-400'
                      : 'bg-white border-sky-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 shadow-sm'
                  }`}
                />
                {chatSearchQuery && (
                  <button
                    onClick={() => setChatSearchQuery('')}
                    className={`absolute right-3 top-2.5 p-0.5 rounded-full transition ${
                      isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-slate-400 hover:text-slate-700 hover:bg-sky-100'
                    }`}
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Contacts List */}
              <div className="space-y-1">
                {(() => {
                  const query = chatSearchQuery.toLowerCase().trim();
                  const filtered = contacts
                    .filter((c) => !deletedContactIds.includes(c.id) && !archivedContactIds.includes(c.id))
                    .filter((c) => {
                      if (!query) return true;
                      const nameMatch = c.name.toLowerCase().includes(query);
                      const trackMatch = c.currentTrack?.toLowerCase().includes(query);
                      const msgs = messagesByContact[c.id] || [];
                      const msgMatch = msgs.some(
                        (m) =>
                          m.songTitle.toLowerCase().includes(query) ||
                          m.artistAlbum.toLowerCase().includes(query)
                      );
                      return nameMatch || trackMatch || msgMatch;
                    });

                  if (filtered.length === 0) {
                    return (
                      <div className="py-8 text-center space-y-2">
                        <div className={`w-11 h-11 rounded-full mx-auto flex items-center justify-center ${isDark ? 'bg-neutral-900 text-neutral-400 border border-neutral-800' : 'bg-sky-100 text-sky-600 border border-sky-200'}`}>
                          <Search className="w-5 h-5" />
                        </div>
                        <p className={`text-xs font-bold ${isDark ? 'text-neutral-300' : 'text-slate-800'}`}>
                          No chats found for "{chatSearchQuery}"
                        </p>
                        <p className={`text-[11px] ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>
                          Try searching for a friend's name or a song title.
                        </p>
                      </div>
                    );
                  }

                  return filtered.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => {
                        setSelectedFriend(contact);
                        setActiveScreen('chat_friend');
                      }}
                      onTouchStart={() => handleTouchStartContact(contact)}
                      onTouchEnd={handleTouchEndContact}
                      onMouseDown={() => handleTouchStartContact(contact)}
                      onMouseUp={handleTouchEndContact}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setActionContact(contact);
                      }}
                      className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition relative group border ${
                        selectedFriend?.id === contact.id
                          ? (isDark ? 'bg-sky-950/40 border-sky-500/40' : 'bg-sky-100/80 border-sky-300')
                          : (isDark ? 'hover:bg-neutral-900 border-transparent' : 'hover:bg-white border-transparent hover:shadow-sm')
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-full ${contact.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow relative`}>
                          {contact.avatarLetter}
                          <span className="w-3 h-3 bg-sky-400 border-2 border-black rounded-full absolute bottom-0 right-0"></span>
                        </div>

                        <div>
                          <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{contact.name}</h3>
                          <p className={`text-xs font-medium flex items-center gap-1 ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
                            <span>🎵</span> {contact.currentTrack}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[10px] font-medium ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>{contact.timeAgo}</span>

                          {contact.unreadCount ? (
                            <div className="flex items-center gap-1">
                              <span className="w-5 h-5 bg-sky-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow">
                                {contact.unreadCount}
                              </span>
                            </div>
                          ) : null}
                        </div>

                        {/* More option trigger */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionContact(contact);
                          }}
                          className={`p-1.5 rounded-lg transition opacity-0 group-hover:opacity-100 sm:opacity-100 ${
                            isDark ? 'text-neutral-500 hover:text-white hover:bg-neutral-800' : 'text-slate-400 hover:text-slate-900 hover:bg-sky-100'
                          }`}
                          title="Chat Options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. DIRECT CHAT WITH SELECTED FRIEND (SCREEN 3 & 4) */}
          {/* ======================================================== */}
          <div className={`h-full overflow-hidden flex flex-col px-4 sm:px-6 pt-3 pb-2 ${activeScreen === 'chat_friend' ? 'flex' : 'hidden'}`}>
            <div className="space-y-3 pt-1 flex flex-col justify-between flex-1 min-h-0">
              
              {/* Chat Header */}
              <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-neutral-800' : 'border-sky-100'}`}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedFriend(null);
                      setActiveScreen('tuning_list');
                    }}
                    className={`p-1 rounded-full transition ${isDark ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-sky-100 text-slate-700'}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className={`w-9 h-9 rounded-full ${selectedFriend?.avatarBg || 'bg-sky-500'} text-white font-bold flex items-center justify-center text-xs shadow relative`}>
                    {selectedFriend?.avatarLetter || 'R'}
                    <span className="w-2.5 h-2.5 bg-sky-400 border-2 border-black rounded-full absolute bottom-0 right-0"></span>
                  </div>
                  <div>
                    <h2 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedFriend?.name || 'Friend'}</h2>
                    <p className={`text-[10px] font-semibold flex items-center gap-1 ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
                      <span>🎵</span> {selectedFriend?.currentTrack ? `Listening to ${selectedFriend.currentTrack}` : 'Listening now'}
                    </p>
                  </div>
                </div>

                <button className={`p-1.5 transition ${isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}>
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages List with NO SCROLLBAR */}
              <div className="space-y-4 flex-1 overflow-y-auto py-2 no-scrollbar">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col relative ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                  >
                    {/* Compact Music Card Bubble */}
                    <div
                      onClick={() => setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id)}
                      className={`relative max-w-[210px] sm:max-w-[220px] p-2.5 rounded-2xl border shadow-md space-y-1.5 cursor-pointer transition hover:scale-[1.01] active:scale-98 ${
                        msg.sender === 'me'
                          ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white border-sky-400/50 shadow-sky-500/10'
                          : (isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-sky-100 text-slate-900')
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-lg ${msg.cardColor || 'bg-sky-500'} flex items-center justify-center text-base shrink-0 shadow text-white`}>
                          {msg.iconType === 'guitar' && '🎸'}
                          {msg.iconType === 'piano' && '🎹'}
                          {msg.iconType === 'mic' && '🎤'}
                        </div>
                        <div className="overflow-hidden min-w-0 flex-1">
                          <h4 className={`font-bold text-xs truncate ${msg.sender === 'me' ? 'text-white' : (isDark ? 'text-white' : 'text-slate-900')}`}>{msg.songTitle}</h4>
                          <p className={`text-[10px] truncate ${msg.sender === 'me' ? 'text-sky-100' : (isDark ? 'text-neutral-300' : 'text-slate-500')}`}>{msg.artistAlbum}</p>
                        </div>
                      </div>

                      {renderWaveform()}

                      {/* Clean Timestamp at bottom right */}
                      <div className={`flex justify-end text-[9px] pt-0.5 ${msg.sender === 'me' ? 'text-sky-100' : (isDark ? 'text-neutral-400' : 'text-slate-400')}`}>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* WhatsApp-Style Floating Corner Reaction Badge */}
                      {msg.reactions.length > 0 && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id);
                          }}
                          className={`absolute -bottom-2 ${msg.sender === 'me' ? 'right-2' : 'left-2'} px-1.5 py-0.5 rounded-full border shadow-md flex items-center gap-0.5 text-xs z-10 cursor-pointer transition hover:scale-110 active:scale-95 ${
                            isDark
                              ? 'bg-neutral-800 border-neutral-700 text-white'
                              : 'bg-white border-sky-200 text-slate-800 shadow-sky-500/10'
                          }`}
                        >
                          {renderLiveEmoji(msg.reactions[0].emoji)}
                        </div>
                      )}
                    </div>

                    {/* Quick Reaction Popover Bar when Message is Tapped */}
                    {activeReactionMsgId === msg.id && (
                      <div className={`flex items-center gap-1 p-1.5 rounded-full shadow-2xl animate-in zoom-in-95 duration-150 my-1 z-30 border ${
                        isDark ? 'bg-neutral-900 border-sky-500/50' : 'bg-white border-sky-300 shadow-sky-200'
                      }`}>
                        {['❤️', '🔥', '🎵', '🥺', '😭', '😍', '👍', '👏'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleReaction(msg.id, emoji);
                              setActiveReactionMsgId(null);
                            }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition hover:scale-125 active:scale-95 ${
                              isDark ? 'hover:bg-neutral-800' : 'hover:bg-sky-100'
                            }`}
                            title={`React with ${emoji}`}
                          >
                            {renderLiveEmoji(emoji)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Primary Action Control (SEND SONG ONLY) */}
              <div className={`pt-2 border-t space-y-2 shrink-0 pb-1 ${isDark ? 'border-neutral-800' : 'border-sky-100'}`}>
                <p className={`text-[10px] text-center font-medium ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>Chatting in SoundRoom • Express through music</p>
                <button
                  onClick={() => {
                    setSelectedContacts(selectedFriend ? [selectedFriend.id] : []);
                    setIsSendToModalOpen(true);
                  }}
                  className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-extrabold text-xs py-3 rounded-2xl flex items-center justify-center transition shadow-lg shadow-sky-500/20 active:scale-[0.98]"
                >
                  <span>Send Song</span>
                </button>
              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* 4. NOW PLAYING FULL SCREEN (STANDARD MODERN MUSIC PLAYER) */}
          {/* ======================================================== */}
          <div className={`h-full overflow-y-auto no-scrollbar pt-1 pb-6 ${activeScreen === 'now_playing' ? 'block' : 'hidden'}`}>
            {(() => {
              return (
                <div className={`relative min-h-full flex flex-col justify-between p-3 space-y-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {/* Dynamic Ambient Background Glow */}
                  <div className="absolute -top-12 -left-12 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

                  {/* Top Header Bar */}
                  <div className="flex items-center justify-between z-10 shrink-0">
                    <button
                      onClick={() => setActiveScreen('home')}
                      className={`p-2 rounded-full border transition ${
                        isDark ? 'bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800' : 'bg-white border-sky-200 text-slate-700 hover:text-slate-900 hover:bg-sky-50 shadow-sm'
                      }`}
                      title="Minimize Player"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>

                    <div className="text-center cursor-pointer" onClick={() => setShowQueue(!showQueue)}>
                      <span className={`text-[9px] font-extrabold uppercase tracking-widest block flex items-center justify-center gap-1 ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
                        <Sparkles className="w-2.5 h-2.5" /> PLAYING FROM PLAYLIST
                      </span>
                      <span className={`text-xs font-bold truncate max-w-[180px] block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {currentSong.album || 'Tuning Daily Mix'}
                      </span>
                    </div>

                    <button
                      onClick={() => setShowMoreOptions(true)}
                      className={`p-2 rounded-full border transition ${
                        isDark ? 'bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800' : 'bg-white border-sky-200 text-slate-700 hover:text-slate-900 hover:bg-sky-50 shadow-sm'
                      }`}
                      title="Options"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Center Album Art Display */}
                  <div className="relative my-auto z-10 flex flex-col items-center shrink-0 py-2">
                    <div className={`relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${
                      isPlaying 
                        ? 'scale-100 shadow-[0_20px_50px_rgba(14,165,233,0.3)] ring-2 ring-sky-500/50' 
                        : (isDark ? 'scale-95 opacity-85 ring-1 ring-neutral-800' : 'scale-95 opacity-85 ring-1 ring-sky-200')
                    }`}>
                      <img
                        src={currentSong.coverUrl}
                        alt={currentSong.title}
                        className="w-full h-full object-cover"
                      />

                      {/* Audio Quality Badge */}
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-sky-400/40 text-[8px] font-black tracking-wider text-sky-300">
                        HD AUDIO
                      </div>

                      {/* Live Equalizer Visualizer Badge */}
                      {isPlaying && (
                        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
                          <span className="w-1 h-3 bg-sky-400 rounded-full animate-bounce"></span>
                          <span className="w-1 h-5 bg-sky-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                          <span className="w-1 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Track Details & Action Row */}
                  <div className="z-10 space-y-3 shrink-0">
                    <div className="flex items-center justify-between px-1">
                      <div className="min-w-0 pr-2">
                        <h2 className={`text-lg sm:text-xl font-extrabold tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {currentSong.title}
                        </h2>
                        <p className={`text-xs font-medium truncate mt-0.5 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                          {currentSong.artist} • <span className={isDark ? 'text-neutral-500' : 'text-slate-400'}>{currentSong.album}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onToggleLikeSong(currentSong.id)}
                          className={`p-2 rounded-full border hover:scale-110 active:scale-95 transition ${
                            isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-sky-200 shadow-sm'
                          }`}
                          title="Like Track"
                        >
                          <Heart className={`w-5 h-5 ${currentSong.isLiked ? 'fill-rose-500 text-rose-500' : (isDark ? 'text-neutral-400' : 'text-slate-400')}`} />
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedContacts(selectedFriend ? [selectedFriend.id] : []);
                            setIsSendToModalOpen(true);
                          }}
                          className={`p-2 rounded-full border hover:scale-110 active:scale-95 transition ${
                            isDark ? 'bg-neutral-900/80 border-neutral-800 text-sky-400' : 'bg-white border-sky-200 text-sky-600 shadow-sm'
                          }`}
                          title="Send to Tuning Friend"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Seek Bar & Timeline */}
                    <div className="space-y-1 px-1">
                      <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={(e) => onSeek(Number(e.target.value))}
                        className={`w-full accent-sky-500 h-1.5 rounded-lg cursor-pointer hover:h-2 transition-all ${
                          isDark ? 'bg-neutral-800' : 'bg-sky-200'
                        }`}
                      />
                      <div className={`flex justify-between text-[10px] font-mono font-semibold ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                        <span>{formatTimeStr(currentTime)}</span>
                        <span>{formatTimeStr(duration)}</span>
                      </div>
                    </div>

                    {/* Primary Playback Controls */}
                    <div className="flex items-center justify-between px-2 pt-1">
                      {/* Shuffle */}
                      <button
                        onClick={() => setIsShuffle(!isShuffle)}
                        className={`p-2 transition relative ${isShuffle ? (isDark ? 'text-sky-400' : 'text-sky-600') : (isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-400 hover:text-slate-900')}`}
                        title="Shuffle"
                      >
                        <Shuffle className="w-5 h-5" />
                        {isShuffle && <span className={`w-1 h-1 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 ${isDark ? 'bg-sky-400' : 'bg-sky-600'}`}></span>}
                      </button>

                      {/* Previous Track */}
                      <button
                        onClick={onPrevSong}
                        className={`p-2 hover:scale-110 transition ${isDark ? 'text-neutral-200 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}
                        title="Previous Track"
                      >
                        <SkipBack className="w-7 h-7 fill-current" />
                      </button>

                      {/* Big Central Play/Pause Button */}
                      <button
                        onClick={onTogglePlay}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-xl shadow-sky-500/30 hover:scale-105 active:scale-95 transition"
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? (
                          <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-white" />
                        ) : (
                          <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white translate-x-0.5" />
                        )}
                      </button>

                      {/* Next Track */}
                      <button
                        onClick={onNextSong}
                        className={`p-2 hover:scale-110 transition ${isDark ? 'text-neutral-200 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}
                        title="Next Track"
                      >
                        <SkipForward className="w-7 h-7 fill-current" />
                      </button>

                      {/* Repeat */}
                      <button
                        onClick={() => {
                          if (repeatMode === 'off') setRepeatMode('all');
                          else if (repeatMode === 'all') setRepeatMode('one');
                          else setRepeatMode('off');
                        }}
                        className={`p-2 transition relative ${repeatMode !== 'off' ? (isDark ? 'text-sky-400' : 'text-sky-600') : (isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-400 hover:text-slate-900')}`}
                        title="Repeat Mode"
                      >
                        <Repeat className="w-5 h-5" />
                        {repeatMode === 'one' && (
                          <span className="text-[8px] font-black bg-sky-500 text-white rounded-full px-1 absolute -top-1 -right-1">1</span>
                        )}
                        {repeatMode === 'all' && (
                          <span className={`w-1 h-1 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 ${isDark ? 'bg-sky-400' : 'bg-sky-600'}`}></span>
                        )}
                      </button>
                    </div>

                    {/* Secondary Utility Controls */}
                    <div className={`flex items-center justify-around rounded-2xl py-2 px-3 border shadow-lg ${
                      isDark ? 'bg-neutral-900/90 border-neutral-800/80' : 'bg-white border-sky-200/80 shadow-sky-100/50'
                    }`}>
                      <button
                        onClick={() => {
                          setShowLyrics(!showLyrics);
                          setShowQueue(false);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          showLyrics 
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' 
                            : (isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                        }`}
                      >
                        <Mic2 className="w-4 h-4" />
                        <span>Lyrics</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowQueue(!showQueue);
                          setShowLyrics(false);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          showQueue 
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' 
                            : (isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                        }`}
                      >
                        <ListMusic className="w-4 h-4" />
                        <span>Queue</span>
                      </button>

                      <button
                        onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          showVolumeSlider 
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' 
                            : (isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                        }`}
                      >
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                        <span>{isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}</span>
                      </button>
                    </div>

                    {/* Volume Popup Slider */}
                    {showVolumeSlider && (
                      <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-2xl flex items-center gap-3 animate-in fade-in">
                        <button
                          onClick={() => onToggleMute && onToggleMute()}
                          className="p-1 text-neutral-400 hover:text-white transition"
                          title={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-4 h-4 text-rose-400" />
                          ) : (
                            <Volume2 className="w-4 h-4 text-sky-400" />
                          )}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={isMuted ? 0 : Math.round(volume * 100)}
                          onChange={(e) => {
                            const val = Number(e.target.value) / 100;
                            if (onVolumeChange) onVolumeChange(val);
                          }}
                          className="w-full accent-sky-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                        />
                        <span className="text-xs font-bold text-neutral-300 w-8 text-right font-mono">
                          {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                        </span>
                      </div>
                    )}

                    {/* Full Screen Synchronized Lyrics View */}
                    {showLyrics && (() => {
                      const lyricsList = (currentSong.lyrics && currentSong.lyrics.length > 0)
                        ? currentSong.lyrics
                        : [
                            { time: 0, text: `♪ Musical intro to ${currentSong.title} ♪` },
                            { time: 10, text: `Singing along with ${currentSong.artist}...` },
                            { time: 25, text: `Lost in the groove of ${currentSong.album}` },
                            { time: 45, text: `Rhythm and melody flowing seamlessly` },
                            { time: 70, text: `Feel the bass and vocal harmonies` },
                            { time: 95, text: `♪ Chorus crescendo and beat drop ♪` },
                            { time: 125, text: `Singing heart and soul till the end` }
                          ];

                      const activeIdx = lyricsList.reduce((acc, line, idx) => {
                        if (currentTime >= line.time) return idx;
                        return acc;
                      }, 0);

                      const formatSecs = (sec: number) => {
                        const m = Math.floor(sec / 60);
                        const s = Math.floor(sec % 60);
                        return `${m}:${s < 10 ? '0' : ''}${s}`;
                      };

                      return (
                        <div className="absolute inset-0 z-50 bg-neutral-950 flex flex-col justify-between p-4 text-white overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
                          {/* Top Bar with Top-Left Back Arrow ⬅️ */}
                          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 shrink-0">
                            <button
                              onClick={() => setShowLyrics(false)}
                              className="flex items-center gap-1.5 text-neutral-200 hover:text-white bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full text-xs font-extrabold transition hover:scale-105 active:scale-95"
                            >
                              <ChevronLeft className="w-5 h-5 text-sky-400" />
                              <span>⬅️ Back</span>
                            </button>

                            <div className="text-center min-w-0 px-2">
                              <span className="text-[10px] font-black tracking-widest uppercase text-sky-400 block">LIVE LYRICS</span>
                              <p className="text-xs font-bold text-white truncate max-w-[150px]">{currentSong.title}</p>
                            </div>

                            <button
                              onClick={() => setShowLyrics(false)}
                              className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition border border-neutral-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Song Header & Artwork Thumbnail */}
                          <div className="flex items-center gap-3 py-3 px-2 my-1 bg-neutral-900/60 rounded-2xl border border-neutral-800/80 shrink-0">
                            <img
                              src={currentSong.coverUrl}
                              alt={currentSong.title}
                              className="w-12 h-12 rounded-xl object-cover border border-neutral-700 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-extrabold text-white truncate">{currentSong.title}</h3>
                              <p className="text-xs text-sky-400 font-semibold truncate">{currentSong.artist}</p>
                            </div>
                          </div>

                          {/* Full Screen Scrollable Lyrics Stream */}
                          <div className="flex-1 overflow-y-auto space-y-3 py-2 px-1 no-scrollbar">
                            {lyricsList.map((line, idx) => {
                              const isActive = idx === activeIdx;
                              return (
                                <div
                                  key={idx}
                                  onClick={() => onSeek(line.time)}
                                  className={`p-3 rounded-2xl transition cursor-pointer text-left flex items-start gap-3 ${
                                    isActive
                                      ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/50 shadow-lg scale-[1.01]'
                                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60 font-medium'
                                  }`}
                                >
                                  <span className={`text-[10px] font-mono shrink-0 px-2 py-0.5 rounded-md ${
                                    isActive ? 'bg-sky-400 text-black font-black' : 'bg-neutral-800 text-neutral-500'
                                  }`}>
                                    {formatSecs(line.time)}
                                  </span>
                                  <p className={`leading-snug text-sm md:text-base flex-1 ${isActive ? 'text-white font-extrabold' : ''}`}>
                                    {line.text}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Queue Sheet Drawer */}
                    {showQueue && (
                      <div className="bg-neutral-900/95 border border-neutral-800/90 p-3 rounded-2xl space-y-2 max-h-48 overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-200">
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                          <span className="text-xs font-extrabold text-sky-400 flex items-center gap-1.5">
                            <ListMusic className="w-3.5 h-3.5" /> PLAYBACK QUEUE
                          </span>
                          <button onClick={() => setShowQueue(false)} className="text-neutral-400 hover:text-white">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-1">
                          {songs.map((song, idx) => {
                            const isCurr = song.id === currentSong.id;
                            return (
                              <div
                                key={song.id}
                                onClick={() => onPlaySong(song)}
                                className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition ${
                                  isCurr ? 'bg-sky-500/20 border border-sky-500/40 text-sky-400 font-bold' : 'hover:bg-neutral-800 text-neutral-300'
                                }`}
                              >
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <span className="text-[10px] w-4 font-mono text-neutral-500">{idx + 1}</span>
                                  <img src={song.coverUrl} alt="" className="w-7 h-7 rounded object-cover shrink-0" />
                                  <div className="overflow-hidden">
                                    <p className="text-xs truncate font-medium">{song.title}</p>
                                    <p className="text-[10px] text-neutral-400 truncate">{song.artist}</p>
                                  </div>
                                </div>
                                {isCurr && <span className="text-[9px] bg-sky-400 text-black font-extrabold px-1.5 py-0.5 rounded">NOW</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Options Sheet Modal */}
                  {showMoreOptions && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 animate-in fade-in">
                      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-sm w-full p-4 space-y-3 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                          <h3 className="font-bold text-sm text-white">Track Options</h3>
                          <button onClick={() => setShowMoreOptions(false)} className="text-neutral-400 hover:text-white">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="space-y-1 text-xs">
                          <button
                            onClick={() => {
                              onToggleLikeSong(currentSong.id);
                              setShowMoreOptions(false);
                            }}
                            className="w-full p-2.5 rounded-xl hover:bg-neutral-800 flex items-center gap-3 text-left font-semibold text-white"
                          >
                            <Heart className="w-4 h-4 text-rose-500" />
                            <span>{currentSong.isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsSendToModalOpen(true);
                              setShowMoreOptions(false);
                            }}
                            className="w-full p-2.5 rounded-xl hover:bg-neutral-800 flex items-center gap-3 text-left font-semibold text-white"
                          >
                            <Share2 className="w-4 h-4 text-sky-400" />
                            <span>Share to Tuning Chat</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsProfileOpen(true);
                              setShowMoreOptions(false);
                            }}
                            className="w-full p-2.5 rounded-xl hover:bg-neutral-800 flex items-center gap-3 text-left font-semibold text-white"
                          >
                            <Sliders className="w-4 h-4 text-indigo-400" />
                            <span>Audio Equalizer & Quality</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })()}
          </div>

        </div>

        {/* ======================================================== */}
        {/* BOTTOM FIXED MINI PLAYER (WHEN IN HOME OR LIST VIEWS) */}
        {/* ======================================================== */}
        {(activeScreen === 'home' || activeScreen === 'tuning_list') && (
          <div className="px-3 py-1.5 shrink-0 z-30">
            <div
              onClick={() => setActiveScreen('now_playing')}
              className={`rounded-2xl p-2.5 flex items-center justify-between cursor-pointer transition border shadow-lg ${
                isDark 
                  ? 'bg-neutral-900 border-neutral-800/90 hover:bg-neutral-800/80 text-white' 
                  : 'bg-white border-sky-200/80 hover:bg-sky-50/80 text-slate-900 shadow-sky-100'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white flex items-center justify-center text-lg shrink-0 shadow">
                  🎵
                </div>
                <div className="overflow-hidden">
                  <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentSong.title}</p>
                  <p className={`text-[10px] truncate ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>{currentSong.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLikeSong(currentSong.id);
                  }}
                  className="p-1.5 text-rose-500 hover:scale-110 transition"
                >
                  <Heart className={`w-4 h-4 ${currentSong.isLiked ? 'fill-rose-500' : ''}`} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePlay();
                  }}
                  className={`p-1 transition ${isDark ? 'text-white hover:text-sky-400' : 'text-slate-800 hover:text-sky-600'}`}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSendToModalOpen(true);
                  }}
                  className={`p-1 transition ${isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BOTTOM NAVIGATION DOCK */}
        {/* ======================================================== */}
        <div className={`px-6 py-3 flex items-center justify-around shrink-0 z-30 border-t ${
          isDark ? 'bg-black/95 border-neutral-900' : 'bg-white/95 border-sky-100 shadow-lg'
        }`}>
          <button
            onClick={() => setActiveScreen('home')}
            className={`flex flex-col items-center gap-1 transition ${
              activeScreen === 'home'
                ? (isDark ? 'text-sky-400 font-extrabold' : 'text-sky-600 font-extrabold')
                : (isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-slate-400 hover:text-slate-700')
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold">Home</span>
          </button>

          <button
            onClick={() => setActiveScreen('tuning_list')}
            className={`flex flex-col items-center gap-1 transition ${
              activeScreen === 'tuning_list' || activeScreen === 'chat_friend' || activeScreen === 'chat_riya'
                ? (isDark ? 'text-sky-400 font-extrabold' : 'text-sky-600 font-extrabold')
                : (isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-slate-400 hover:text-slate-700')
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5" />
              <span className="w-2 h-2 bg-sky-400 rounded-full absolute -top-0.5 -right-0.5"></span>
            </div>
            <span className="text-[10px] font-bold">Tuning</span>
          </button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 5. "SEND TO..." DIRECT SHARE MODAL (SCREEN 6) */}
      {/* ======================================================== */}
      {isSendToModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative border ${
            isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-sky-200 text-slate-900'
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-neutral-800' : 'border-sky-100'}`}>
              <div className="flex items-center gap-2">
                <ChevronLeft 
                  onClick={() => setIsSendToModalOpen(false)}
                  className={`w-5 h-5 cursor-pointer ${isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                />
                <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Send to...</h3>
              </div>
              <button
                onClick={() => setIsSendToModalOpen(false)}
                className="text-xs text-sky-600 font-bold hover:underline"
              >
                Cancel
              </button>
            </div>

            {/* Song Preview Card */}
            <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
              isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-sky-50/80 border-sky-100'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center text-lg shrink-0 shadow">
                🎤
              </div>
              <div className="overflow-hidden">
                <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentSong.title}</p>
                <p className={`text-[10px] truncate ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>{currentSong.artist}</p>
              </div>
            </div>

            {/* Friends Check List */}
            <div className="space-y-2 max-h-52 overflow-y-auto no-scrollbar">
              {contacts.map((c) => {
                const isSelected = selectedContacts.includes(c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedContacts(selectedContacts.filter((id) => id !== c.id));
                      } else {
                        setSelectedContacts([...selectedContacts, c.id]);
                      }
                    }}
                    className={`p-2.5 rounded-2xl flex items-center justify-between cursor-pointer border transition ${
                      isSelected
                        ? (isDark ? 'bg-sky-950/50 border-sky-500/50' : 'bg-sky-100 border-sky-300')
                        : (isDark ? 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-800' : 'bg-white border-sky-100 hover:bg-sky-50')
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${c.avatarBg} text-white font-bold flex items-center justify-center text-xs`}>
                        {c.avatarLetter}
                      </div>
                      <div>
                        <h4 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.name}</h4>
                        <p className={`text-[10px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>🎵 {c.currentTrack}</p>
                      </div>
                    </div>

                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition ${
                      isSelected
                        ? 'bg-sky-500 border-sky-500 text-white'
                        : (isDark ? 'border-neutral-700 bg-neutral-800' : 'border-sky-200 bg-sky-50')
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Big Send Button */}
            <button
              onClick={handleSendSongToFriend}
              disabled={selectedContacts.length === 0}
              className={`w-full bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs py-3 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-[0.98] ${
                selectedContacts.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>🎵</span> {
                selectedContacts.length === 0
                  ? 'Select friends to send'
                  : (selectedContacts.length === 1
                      ? `Send to ${contacts.find((c) => c.id === selectedContacts[0])?.name || 'Friend'}`
                      : `Send to ${selectedContacts.length} friends`)
              }
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PROFILE & SETTINGS MODAL */}
      {/* ======================================================== */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className={`border rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative ${
            isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-sky-200 text-slate-900'
          }`}>
            
            {/* Modal Header */}
            <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-neutral-800/80 bg-neutral-900' : 'border-sky-100 bg-white'
            }`}>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-sky-500" />
                <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Profile & Settings</h3>
              </div>
              <button
                onClick={() => setIsProfileOpen(false)}
                className={`p-1.5 rounded-full transition ${
                  isDark ? 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700' : 'bg-sky-100 text-slate-600 hover:text-slate-900 hover:bg-sky-200'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable Settings */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar text-xs">
              
              {/* User Profile Card */}
              <div className={`p-4 rounded-2xl border flex items-center gap-3.5 shadow-lg ${
                isDark
                  ? 'bg-gradient-to-br from-neutral-800/90 to-neutral-900 border-neutral-700/60'
                  : 'bg-gradient-to-br from-sky-50 to-indigo-50/50 border-sky-200'
              }`}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-400 to-indigo-500 text-white font-black text-xl flex items-center justify-center shadow-lg shrink-0">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>Tuning Member</h4>
                    <span className="bg-sky-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                      PRO
                    </span>
                  </div>
                  <p className={`text-[10px] mt-1 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>🎧 1,420 mins listened this month</p>
                </div>
              </div>

              {/* Section 1: Audio Quality & Playback */}
              <div className="space-y-3">
                <h4 className={`font-extrabold uppercase text-[10px] tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-neutral-400' : 'text-slate-500'
                }`}>
                  <Volume2 className="w-3.5 h-3.5 text-sky-500" /> Audio Quality & Playback
                </h4>
                
                <div className={`p-3.5 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-sky-100'
                }`}>
                  {/* Streaming Quality Selector */}
                  <div>
                    <label className={`font-semibold block mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>Streaming Audio Quality</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Low', 'Medium', 'High'].map((q) => (
                        <button
                          key={q}
                          onClick={() => setAudioQuality(q)}
                          className={`p-2 rounded-xl text-[11px] font-bold text-center border transition ${
                            audioQuality === q
                              ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                              : (isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white' : 'bg-white border-sky-200 text-slate-600 hover:text-slate-900')
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Equalizer Presets */}
                  <div className={`pt-2 border-t ${isDark ? 'border-neutral-800/80' : 'border-sky-200/60'}`}>
                    <label className={`font-semibold block mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>Equalizer Preset</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Off', 'Bass Boost', 'Pop', 'Vocal', 'Acoustic', 'Rock'].map((eq) => (
                        <button
                          key={eq}
                          onClick={() => setEqualizer(eq)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border transition ${
                            equalizer === eq
                              ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                              : (isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white' : 'bg-white border-sky-200 text-slate-600 hover:text-slate-900')
                          }`}
                        >
                          {eq}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gapless Playback Toggle */}
                  <div className={`pt-2 border-t flex items-center justify-between ${isDark ? 'border-neutral-800/80' : 'border-sky-200/60'}`}>
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>Gapless Playback</p>
                      <p className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-slate-500'}`}>Smooth crossfade between tracks</p>
                    </div>
                    <button
                      onClick={() => setGaplessPlayback(!gaplessPlayback)}
                      className={`w-10 h-5 rounded-full p-0.5 transition ${gaplessPlayback ? 'bg-sky-500' : (isDark ? 'bg-neutral-800' : 'bg-slate-300')}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition transform ${gaplessPlayback ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 2: Theme & Appearance */}
              <div className="space-y-3">
                <h4 className={`font-extrabold uppercase text-[10px] tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-neutral-400' : 'text-slate-500'
                }`}>
                  <Moon className="w-3.5 h-3.5 text-sky-500" /> Appearance & Theme
                </h4>

                <div className={`p-3.5 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-sky-100'
                }`}>
                  <label className={`font-semibold block mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>App Theme Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'system', name: 'System Default', icon: Monitor },
                      { id: 'light', name: 'Light Sky', icon: Sun },
                      { id: 'dark', name: 'Dark Black', icon: Moon },
                    ].map((t) => {
                      const IconComp = t.icon;
                      const isSelected = themeMode === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setThemeMode(t.id as 'system' | 'light' | 'dark')}
                          className={`p-2.5 rounded-xl border text-[10px] font-bold text-center flex flex-col items-center gap-1.5 transition ${
                            isSelected
                              ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/25'
                              : (isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white' : 'bg-white border-sky-200 text-slate-600 hover:text-slate-900')
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                          <span>{t.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 3: Downloads & Data Saver */}
              <div className="space-y-3">
                <h4 className={`font-extrabold uppercase text-[10px] tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-neutral-400' : 'text-slate-500'
                }`}>
                  <HardDrive className="w-3.5 h-3.5 text-sky-500" /> Downloads & Storage
                </h4>

                <div className={`p-3.5 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-sky-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>Download over Wi-Fi only</p>
                      <p className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-slate-500'}`}>Save mobile cellular data</p>
                    </div>
                    <button
                      onClick={() => setDownloadWifiOnly(!downloadWifiOnly)}
                      className={`w-10 h-5 rounded-full p-0.5 transition ${downloadWifiOnly ? 'bg-sky-500' : (isDark ? 'bg-neutral-800' : 'bg-slate-300')}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition transform ${downloadWifiOnly ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                  </div>

                  <div className={`pt-2 border-t flex items-center justify-between ${isDark ? 'border-neutral-800/80' : 'border-sky-200/60'}`}>
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>Data Saver Mode</p>
                      <p className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-slate-500'}`}>Low bandwidth streaming</p>
                    </div>
                    <button
                      onClick={() => setDataSaver(!dataSaver)}
                      className={`w-10 h-5 rounded-full p-0.5 transition ${dataSaver ? 'bg-sky-500' : (isDark ? 'bg-neutral-800' : 'bg-slate-300')}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition transform ${dataSaver ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                  </div>

                  <div className={`pt-2 border-t flex items-center justify-between ${isDark ? 'border-neutral-800/80' : 'border-sky-200/60'}`}>
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>Storage Used</p>
                      <p className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-slate-500'}`}>1.4 GB offline cache</p>
                    </div>
                    <button className={`border text-xs px-2.5 py-1 rounded-lg transition ${
                      isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white' : 'bg-white border-sky-200 text-slate-700 hover:bg-sky-50'
                    }`}>
                      Clear Cache
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Long Press / Chat Options Modal */}
      {actionContact && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in">
          <div className={`border w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom-5 ${
            isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-sky-200 text-slate-900'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-neutral-800' : 'border-sky-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${actionContact.avatarBg} text-white font-bold flex items-center justify-center text-xs shadow`}>
                  {actionContact.avatarLetter}
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{actionContact.name}</h3>
                  <p className={`text-[10px] truncate max-w-[180px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>🎵 {actionContact.currentTrack}</p>
                </div>
              </div>
              <button
                onClick={() => setActionContact(null)}
                className={`p-1 rounded-full transition ${isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-slate-400 hover:text-slate-900 hover:bg-sky-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setArchivedContactIds((prev) => [...prev, actionContact.id]);
                  setActionContact(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition active:scale-[0.98] ${
                  isDark ? 'bg-neutral-800/80 hover:bg-neutral-800 text-white' : 'bg-sky-50 hover:bg-sky-100 text-slate-900'
                }`}
              >
                <Archive className="w-4 h-4 text-sky-500" />
                <span>Archive Chat</span>
              </button>

              <button
                onClick={() => {
                  setDeletedContactIds((prev) => [...prev, actionContact.id]);
                  setActionContact(null);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold transition border border-rose-500/20 active:scale-[0.98]"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span>Delete Chat</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
