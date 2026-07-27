import React from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  Share2, 
  Clock, 
  Radio, 
  Users, 
  MessageSquare, 
  Sparkles, 
  Music2,
  ListPlus,
  Flame,
  Coffee,
  Zap,
  Volume2
} from 'lucide-react';
import { Song, Playlist, ChatRoom } from '../types';
import { TuningPhoneView } from './TuningPhoneView';

interface MainContentProps {
  activeView: string;
  setActiveView: (view: string) => void;
  songs: Song[];
  playlists: Playlist[];
  chatRooms: ChatRoom[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onTogglePlay: () => void;
  onToggleLikeSong: (songId: string) => void;
  onShareSongToChat: (song: Song) => void;
  selectedPlaylistId: string | null;
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
  onToggleChat: () => void;
  searchQuery: string;
}

export const MainContent: React.FC<MainContentProps> = ({
  activeView,
  setActiveView,
  songs,
  playlists,
  chatRooms,
  currentSong,
  isPlaying,
  onPlaySong,
  onTogglePlay,
  onToggleLikeSong,
  onShareSongToChat,
  selectedPlaylistId,
  activeRoomId,
  onSelectRoom,
  onToggleChat,
  searchQuery
}) => {
  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const selectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId);
  const activeRoom = chatRooms.find((r) => r.id === activeRoomId) || chatRooms[0];

  // Filter songs for search
  const filteredSongs = songs.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.genre.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q)
    );
  });

  const likedSongs = songs.filter((s) => s.isLiked);

  // Helper for room icons
  const getRoomIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Coffee': return <Coffee className="w-5 h-5 text-amber-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-emerald-400" />;
      default: return <Radio className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white p-3 sm:p-6 custom-scrollbar pb-32 select-none w-full max-w-full overflow-x-hidden">
      
      {/* 0. TUNING INTERACTIVE DIRECT CHAT PAGE */}
      {(activeView === 'tuning' || activeView === 'home') && (
        <TuningPhoneView
          songs={songs}
          currentSong={currentSong || songs[0]}
          isPlaying={isPlaying}
          onPlaySong={onPlaySong}
          onTogglePlay={onTogglePlay}
          onToggleLikeSong={onToggleLikeSong}
          currentTime={0}
          duration={currentSong?.duration || 180}
          onSeek={() => {}}
        />
      )}

      {/* 1. PLAYLIST DETAIL VIEW */}
      {activeView === 'playlist' && selectedPlaylist && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-end gap-6 bg-gradient-to-b from-neutral-800 to-neutral-900/60 p-6 rounded-2xl border border-neutral-800">
            <img
              src={selectedPlaylist.coverUrl}
              alt={selectedPlaylist.name}
              className="w-48 h-48 rounded-xl object-cover shadow-2xl shadow-black/80"
            />
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {selectedPlaylist.isCustom ? 'AI Generated Playlist' : 'Featured Playlist'}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{selectedPlaylist.name}</h1>
              <p className="text-sm text-neutral-400 max-w-2xl">{selectedPlaylist.description}</p>
              <p className="text-xs text-neutral-500 font-semibold">Curated for SoundRoom</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (selectedPlaylist.songs.length > 0) {
                  onPlaySong(selectedPlaylist.songs[0]);
                }
              }}
              className="w-14 h-14 rounded-full bg-emerald-500 text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/30"
            >
              <Play className="w-6 h-6 fill-black ml-1" />
            </button>
          </div>

          <SongsTable 
            songs={selectedPlaylist.songs}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlaySong={onPlaySong}
            onToggleLikeSong={onToggleLikeSong}
            onShareSongToChat={onShareSongToChat}
            formatTime={formatTime}
          />
        </div>
      )}

      {/* 2. LIKED SONGS VIEW */}
      {activeView === 'liked' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-end gap-6 bg-gradient-to-br from-indigo-900/60 to-purple-900/40 p-6 rounded-2xl border border-indigo-800/40">
            <div className="w-44 h-44 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-2xl">
              <Heart className="w-20 h-20 fill-white text-white" />
            </div>
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-300">Your Collection</span>
              <h1 className="text-4xl md:text-5xl font-black text-white">Liked Songs</h1>
              <p className="text-sm text-neutral-300">Favorite tracks saved to your library</p>
            </div>
          </div>

          {likedSongs.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800">
              <Heart className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-400 font-semibold">No liked songs yet.</p>
              <p className="text-xs text-neutral-500 mt-1">Click the heart icon on any song to add it here!</p>
            </div>
          ) : (
            <SongsTable 
              songs={likedSongs}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlaySong={onPlaySong}
              onToggleLikeSong={onToggleLikeSong}
              onShareSongToChat={onShareSongToChat}
              formatTime={formatTime}
            />
          )}
        </div>
      )}

      {/* 3. SEARCH VIEW */}
      {activeView === 'search' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Search Results</h2>
            <span className="text-xs text-neutral-400 font-medium">Search results for "{searchQuery}"</span>
          </div>

          {filteredSongs.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800">
              <Music2 className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-400 font-semibold">No songs found matching "{searchQuery}"</p>
              <p className="text-xs text-neutral-500 mt-1">Try searching for "Nilaave", "Kannamma", "Tamil", or "Lo-Fi".</p>
            </div>
          ) : (
            <SongsTable 
              songs={filteredSongs}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlaySong={onPlaySong}
              onToggleLikeSong={onToggleLikeSong}
              onShareSongToChat={onShareSongToChat}
              formatTime={formatTime}
            />
          )}
        </div>
      )}

      {/* 4. SOUNDROOMS VIEW */}
      {activeView === 'rooms' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black flex items-center gap-2">
                <Radio className="w-8 h-8 text-emerald-400" />
                Live SoundRooms
              </h1>
              <p className="text-sm text-neutral-400 mt-1">
                Listen synchronously with fans, chat live, and drop song requests in real-time!
              </p>
            </div>
            <button
              onClick={onToggleChat}
              className="bg-emerald-500 text-black font-extrabold text-xs px-4 py-2 rounded-full shadow-lg hover:scale-105 transition"
            >
              Open Active Room Chat
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chatRooms.map((room) => {
              const isCurrentRoom = room.id === activeRoomId;
              const roomSong = songs.find((s) => s.id === room.currentSongId) || songs[0];

              return (
                <div
                  key={room.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                    isCurrentRoom
                      ? 'bg-gradient-to-r from-neutral-800 to-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                      : 'bg-neutral-900/80 border-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
                        {getRoomIcon(room.iconName)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white flex items-center gap-2">
                          {room.name}
                          {isCurrentRoom && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-extrabold border border-emerald-500/30">
                              Active Room
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{room.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-bold border border-emerald-500/20 shrink-0">
                      <Users className="w-3.5 h-3.5" />
                      <span>{room.activeUsersCount}</span>
                    </div>
                  </div>

                  {/* Room Now Playing Bar */}
                  <div className="bg-black/60 rounded-xl p-3 flex items-center justify-between border border-neutral-800/60">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={roomSong.coverUrl}
                        alt={roomSong.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">{roomSong.title}</p>
                        <p className="text-[11px] text-neutral-400 truncate">{roomSong.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onPlaySong(roomSong)}
                        className="p-2 rounded-full bg-emerald-500 text-black hover:scale-105 transition"
                        title="Listen to this song"
                      >
                        <Play className="w-4 h-4 fill-black" />
                      </button>
                      <button
                        onClick={() => {
                          onSelectRoom(room.id);
                          onToggleChat();
                        }}
                        className="px-3 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-xs text-white font-semibold transition flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        Join Chat
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. HOME VIEW (DEFAULT) */}
      {(activeView === 'home' || activeView === 'library') && !selectedPlaylist && (
        <div className="space-y-8">
          
          {/* JioSaavn / Spotify Category Pills & "Your Usuals" Section (Matching User Screenshot) */}
          <div className="space-y-5">
            {/* Top Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              <button className="px-5 py-2 rounded-full text-xs font-extrabold bg-white text-black shadow-md">
                Music
              </button>
              <button className="px-5 py-2 rounded-full text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition">
                Podcasts
              </button>
              <button 
                onClick={() => setActiveView('tuning')}
                className="px-5 py-2 rounded-full text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition flex items-center gap-1.5"
              >
                <span>JioTunes</span>
              </button>
              <button 
                onClick={() => setActiveView('tuning')}
                className="px-4 py-2 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500 hover:text-black transition flex items-center gap-1.5 ml-auto"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat Page</span>
              </button>
            </div>

            {/* "Your Usuals" Header */}
            <div className="flex items-center justify-between pt-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Your Usuals</h1>
              <button 
                onClick={() => setActiveView('tuning')}
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Open Direct Chat</span>
              </button>
            </div>

            {/* "Your Usuals" Grid Cards with Play Icon Overlay */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5">
              {songs.map((song) => {
                const isThisPlaying = currentSong?.id === song.id && isPlaying;
                return (
                  <div
                    key={song.id}
                    onClick={() => onPlaySong(song)}
                    className="group flex flex-col bg-neutral-900/60 hover:bg-neutral-800/80 p-3 rounded-2xl border border-neutral-800/80 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-emerald-500/10"
                  >
                    {/* Album Art with Center Circle Play Button */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-950 shadow-md">
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Center Play Button Circle (JioSaavn Style) */}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 flex items-center justify-center transition-all">
                        <div className={`w-12 h-12 rounded-full bg-white/95 text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform ${
                          isThisPlaying ? 'bg-emerald-500 text-black scale-105' : ''
                        }`}>
                          {isThisPlaying ? (
                            <Pause className="w-6 h-6 fill-black text-black ml-0.5" />
                          ) : (
                            <Play className="w-6 h-6 fill-black text-black ml-1" />
                          )}
                        </div>
                      </div>

                      {/* Playing Indicator Pill */}
                      {isThisPlaying && (
                        <div className="absolute top-2 left-2 bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                          <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping"></span>
                          PLAYING
                        </div>
                      )}
                    </div>

                    {/* Album / Song Title */}
                    <div className="mt-2.5 px-0.5">
                      <h3 className={`font-bold text-sm sm:text-base leading-snug truncate group-hover:text-emerald-400 transition-colors ${
                        isThisPlaying ? 'text-emerald-400 font-extrabold' : 'text-white'
                      }`}>
                        {song.title}
                      </h3>
                      <p className="text-xs text-neutral-400 truncate mt-0.5 font-medium">
                        {song.artist}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hero Banner Showcase */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-neutral-900 to-indigo-950 p-8 border border-neutral-800/80 shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  SPOTIFY SOUNDROOM & LIVE CHAT
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Music is better <span className="text-emerald-400 underline decoration-emerald-500/40 decoration-wavy">Together</span>.
                </h1>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Stream high quality Tamil & global melodies while chatting with friends and Gemini AI DJ in real-time rooms. Send images, request songs, and sync your music vibe!
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onPlaySong(songs[0])}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-6 py-3 rounded-full text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    Play Featured Track
                  </button>

                  <button
                    onClick={onToggleChat}
                    className="flex items-center gap-2 bg-neutral-800/90 hover:bg-neutral-700 text-white font-bold px-5 py-3 rounded-full text-sm border border-neutral-700 transition-all hover:scale-105"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    Open Live Room Chat
                  </button>
                </div>
              </div>

              {/* Album art featured badge */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition duration-500"></div>
                <img
                  src={songs[0].coverUrl}
                  alt={songs[0].title}
                  className="relative w-56 h-56 rounded-2xl object-cover shadow-2xl border border-neutral-700/50"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md p-2.5 rounded-xl border border-neutral-700/50 flex items-center justify-between">
                  <div className="overflow-hidden pr-2">
                    <p className="text-xs font-bold text-white truncate">{songs[0].title}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{songs[0].artist}</p>
                  </div>
                  <button
                    onClick={() => onPlaySong(songs[0])}
                    className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center shrink-0 shadow"
                  >
                    <Play className="w-4 h-4 fill-black" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Live SoundRooms Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                  Live Vibing SoundRooms
                </h2>
                <p className="text-xs text-neutral-400">Join a room to listen along and chat with listeners</p>
              </div>

              <button
                onClick={() => setActiveView('rooms')}
                className="text-xs font-bold text-emerald-400 hover:underline"
              >
                See All Rooms
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {chatRooms.map((room) => {
                const isSelected = room.id === activeRoomId;
                return (
                  <div
                    key={room.id}
                    onClick={() => {
                      onSelectRoom(room.id);
                      onToggleChat();
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-neutral-800/90 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                        : 'bg-neutral-900/60 border-neutral-800/60 hover:bg-neutral-800/70 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center">
                        {getRoomIcon(room.iconName)}
                      </div>
                      <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {room.activeUsersCount} Live
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                        {room.name}
                      </h3>
                      <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">{room.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-xs text-neutral-400 font-medium">
                      <span>{room.genre}</span>
                      <span className="text-emerald-400 flex items-center gap-1 font-bold">
                        <MessageSquare className="w-3 h-3" /> Chat Now
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Curated Playlists Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Curated Mixes & Playlists</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {playlists.map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => {
                    setActiveView('playlist');
                  }}
                  className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800/60 hover:bg-neutral-800/80 transition-all cursor-pointer group space-y-3"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <img
                      src={pl.coverUrl}
                      alt={pl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (pl.songs.length > 0) onPlaySong(pl.songs[0]);
                      }}
                      className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110"
                    >
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white truncate">{pl.name}</h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1">{pl.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Popular Songs Table */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Popular Tamil & Global Tracks</h2>
            <SongsTable 
              songs={songs}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlaySong={onPlaySong}
              onToggleLikeSong={onToggleLikeSong}
              onShareSongToChat={onShareSongToChat}
              formatTime={formatTime}
            />
          </div>

        </div>
      )}

    </div>
  );
};

/* Sub-component: Clean Spotify Songs Table */
interface SongsTableProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onToggleLikeSong: (songId: string) => void;
  onShareSongToChat: (song: Song) => void;
  formatTime: (sec: number) => string;
}

const SongsTable: React.FC<SongsTableProps> = ({
  songs,
  currentSong,
  isPlaying,
  onPlaySong,
  onToggleLikeSong,
  onShareSongToChat,
  formatTime,
}) => {
  return (
    <div className="w-full overflow-x-auto bg-neutral-900/40 rounded-2xl border border-neutral-800/80">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-neutral-800 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            <th className="py-3 px-4 w-12 text-center">#</th>
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4 hidden md:table-cell">Album</th>
            <th className="py-3 px-4 hidden sm:table-cell">Genre</th>
            <th className="py-3 px-4 w-16 text-center">
              <Clock className="w-4 h-4 inline" />
            </th>
            <th className="py-3 px-4 w-28 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/40 text-sm">
          {songs.map((song, index) => {
            const isCurrent = currentSong?.id === song.id;

            return (
              <tr
                key={song.id}
                className={`group hover:bg-neutral-800/60 transition-colors ${
                  isCurrent ? 'bg-neutral-800/40 text-emerald-400' : 'text-neutral-300'
                }`}
              >
                {/* Index / Play Button */}
                <td className="py-3 px-4 text-center font-medium text-xs text-neutral-500">
                  <span className="group-hover:hidden">
                    {isCurrent && isPlaying ? (
                      <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <button
                    onClick={() => onPlaySong(song)}
                    className="hidden group-hover:inline-block text-white hover:text-emerald-400 transition"
                  >
                    {isCurrent && isPlaying ? (
                      <Pause className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                  </button>
                </td>

                {/* Title & Artist */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-10 h-10 rounded-md object-cover shrink-0 shadow-sm"
                    />
                    <div className="overflow-hidden">
                      <p className={`font-semibold text-sm truncate ${isCurrent ? 'text-emerald-400 font-bold' : 'text-white'}`}>
                        {song.title}
                      </p>
                      <p className="text-xs text-neutral-400 truncate mt-0.5">{song.artist}</p>
                    </div>
                  </div>
                </td>

                {/* Album */}
                <td className="py-3 px-4 hidden md:table-cell text-xs text-neutral-400 truncate max-w-[160px]">
                  {song.album}
                </td>

                {/* Genre */}
                <td className="py-3 px-4 hidden sm:table-cell text-xs">
                  <span className="bg-neutral-800 border border-neutral-700/50 text-neutral-300 px-2.5 py-1 rounded-full font-medium">
                    {song.genre}
                  </span>
                </td>

                {/* Duration */}
                <td className="py-3 px-4 text-center text-xs text-neutral-400 font-mono">
                  {formatTime(song.duration)}
                </td>

                {/* Actions: Like & Share to Chat */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onToggleLikeSong(song.id)}
                      className={`p-1.5 rounded-full hover:bg-neutral-700/60 transition ${
                        song.isLiked ? 'text-rose-500' : 'text-neutral-400 hover:text-white'
                      }`}
                      title={song.isLiked ? 'Unlike song' : 'Like song'}
                    >
                      <Heart className={`w-4 h-4 ${song.isLiked ? 'fill-rose-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => onShareSongToChat(song)}
                      className="p-1.5 rounded-full text-emerald-400 hover:bg-emerald-500/20 transition"
                      title="Share this song in active Room Chat"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
