import React from 'react';
import { 
  Home, 
  Search, 
  Library, 
  MessageSquare, 
  Heart, 
  Music, 
  Sparkles,
  Radio,
  X
} from 'lucide-react';
import { Playlist, ChatRoom } from '../types';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  playlists: Playlist[];
  chatRooms: ChatRoom[];
  selectedPlaylistId: string | null;
  setSelectedPlaylistId: (id: string | null) => void;
  activeRoomId: string;
  setActiveRoomId: (id: string) => void;
  onOpenAiPlaylistModal: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  likedSongsCount: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  playlists,
  chatRooms,
  selectedPlaylistId,
  setSelectedPlaylistId,
  activeRoomId,
  setActiveRoomId,
  onOpenAiPlaylistModal,
  onToggleChat,
  isChatOpen,
  likedSongsCount,
  isOpen = false,
  onClose
}) => {
  const handleNavClick = (action: () => void) => {
    action();
    if (onClose) onClose();
  };

  return (
    <>
      {/* Dark Overlay Backdrop when Sidebar Drawer is Open */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Main Floating / Sliding Drawer Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-neutral-950 text-neutral-300 flex flex-col h-full p-3 gap-2 select-none border-r border-neutral-800 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header & Close Button */}
        <div className="bg-neutral-900/90 rounded-xl p-3.5 flex items-center justify-between border border-neutral-800/60 shadow-md">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => handleNavClick(() => setActiveView('home'))}
          >
            <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-emerald-500/20">
              <Music className="w-5 h-5 fill-black text-black" />
            </div>
            <div>
              <h1 className="text-white font-bold tracking-tight text-base leading-none flex items-center gap-1.5">
                Spotify <span className="text-emerald-400 font-extrabold text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">CHAT</span>
              </h1>
              <p className="text-[10px] text-neutral-400 font-medium mt-0.5">SoundRoom & Music</p>
            </div>
          </div>

          {/* Close Drawer Button */}
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <div className="bg-neutral-900/90 rounded-xl p-2.5 flex flex-col gap-1 border border-neutral-800/60 shadow-sm">
          <button
            id="nav-tuning-flow-btn"
            onClick={() => handleNavClick(() => { setActiveView('tuning'); setSelectedPlaylistId(null); })}
            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-lg font-semibold text-xs transition-all border border-emerald-500/30 ${
              activeView === 'tuning'
                ? 'bg-emerald-500 text-black font-extrabold shadow-md shadow-emerald-500/20'
                : 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60'
            }`}
          >
            <MessageSquare className="w-4 h-4 fill-current shrink-0" />
            <div className="flex items-center justify-between w-full">
              <span>Tuning Direct Chat</span>
              <span className="bg-emerald-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                CHAT
              </span>
            </div>
          </button>

          <button
            id="nav-search-btn"
            onClick={() => handleNavClick(() => { setActiveView('search'); setSelectedPlaylistId(null); })}
            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-lg font-semibold text-xs transition-all ${
              activeView === 'search'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <Search className={`w-4 h-4 ${activeView === 'search' ? 'text-emerald-400' : ''}`} />
            Search Songs
          </button>
        </div>

        {/* Library & Playlists Section */}
        <div className="bg-neutral-900/90 rounded-xl p-3 flex-1 flex flex-col gap-2 overflow-hidden border border-neutral-800/60 shadow-sm">
          <div className="flex items-center justify-between px-1 pt-1 pb-1">
            <button 
              onClick={() => handleNavClick(() => { setActiveView('library'); setSelectedPlaylistId(null); })}
              className="flex items-center gap-2 text-neutral-400 hover:text-white font-bold text-xs"
            >
              <Library className="w-4 h-4" />
              Your Library
            </button>
          </div>

          {/* Liked Songs Tile */}
          <button
            id="liked-songs-btn"
            onClick={() => handleNavClick(() => { setActiveView('liked'); setSelectedPlaylistId(null); })}
            className={`flex items-center gap-3 p-2 rounded-lg text-left transition-all ${
              activeView === 'liked' ? 'bg-neutral-800 text-white' : 'hover:bg-neutral-800/50 text-neutral-300'
            }`}
          >
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shrink-0 shadow">
              <Heart className="w-4 h-4 fill-white text-white" />
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-xs truncate">Liked Songs</p>
              <p className="text-[10px] text-neutral-400">Playlist</p>
            </div>
          </button>

          {/* Playlists List */}
          <div className="mt-1 flex-1 overflow-y-auto pr-1 flex flex-col gap-1 custom-scrollbar">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-1 py-1">
              Playlists & Mixes
            </p>

            {playlists.map((playlist) => {
              const isSelected = selectedPlaylistId === playlist.id;
              return (
                <button
                  key={playlist.id}
                  onClick={() => handleNavClick(() => {
                    setSelectedPlaylistId(playlist.id);
                    setActiveView('playlist');
                  })}
                  className={`flex items-center gap-2.5 p-1.5 rounded-lg text-left transition-all group ${
                    isSelected ? 'bg-neutral-800 text-emerald-400 font-bold' : 'hover:bg-neutral-800/50 text-neutral-300'
                  }`}
                >
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.name}
                    className="w-8 h-8 rounded-md object-cover shrink-0 shadow-sm"
                  />
                  <div className="overflow-hidden flex-1">
                    <p className="font-medium text-xs truncate group-hover:text-white transition-colors">
                      {playlist.name}
                    </p>
                    <p className="text-[10px] text-neutral-400 truncate">
                      {playlist.isCustom ? 'AI Mix' : 'Playlist'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};

