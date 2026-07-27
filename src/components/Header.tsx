import React, { useState } from 'react';
import { Search, Settings, MoreVertical, MessageSquare, ChevronLeft, ChevronRight, User, Menu, X, Sparkles, Music } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  activeRoomName: string;
  activeRoomListeners: number;
  onOpenAiPlaylistModal: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  activeView,
  setActiveView,
  onToggleChat,
  isChatOpen,
  activeRoomName,
  activeRoomListeners,
  onOpenAiPlaylistModal,
  onToggleSidebar,
  isSidebarOpen
}) => {
  const [isThreeDotMenuOpen, setIsThreeDotMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-neutral-900/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between border-b border-neutral-800/80 sticky top-0 z-30 select-none gap-2">
      {/* Left: Brand Logo / Menu Hamburger + Navigation + Search */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        {/* Toggle Sidebar Overlay Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-emerald-400 hover:text-white transition shrink-0 border border-neutral-700/60 flex items-center gap-1.5"
          title="Toggle Menu & Library"
        >
          {isSidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-emerald-400" />}
          <span className="text-xs font-bold hidden sm:inline">Menu</span>
        </button>

        {/* Back / Forward */}
        <div className="hidden sm:flex items-center gap-1 text-neutral-400 shrink-0">
          <button 
            onClick={() => setActiveView('home')} 
            className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center hover:text-white transition"
            title="Go to Home"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveView('search')} 
            className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center hover:text-white transition"
            title="Search"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Global Search Input */}
        <div className="relative flex-1 max-w-md min-w-[120px]">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search songs, artists, Tamil hits..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeView !== 'search' && e.target.value.trim().length > 0) {
                setActiveView('search');
              }
            }}
            className="w-full bg-neutral-800/90 text-white text-xs rounded-full pl-8 sm:pl-10 pr-3 py-2 outline-none border border-neutral-700/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-neutral-500 truncate"
          />
        </div>
      </div>

      {/* Right Action Bar (3 Dots Menu -> Direct Chat Page) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 relative">
        
        {/* Direct Chat Quick Button */}
        <button
          onClick={() => setActiveView('tuning')}
          className="flex items-center gap-1.5 bg-emerald-500 text-black font-extrabold text-xs px-3 py-1.5 rounded-full transition-all hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
          title="Direct Chat Page"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-black" />
          <span className="inline">Chat Page</span>
        </button>

        {/* 3-Dots Menu Button */}
        <div className="relative">
          <button
            id="three-dots-chat-menu-btn"
            onClick={() => setIsThreeDotMenuOpen(!isThreeDotMenuOpen)}
            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition flex items-center justify-center relative shadow-sm"
            title="Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Popover Menu on 3-Dots Click */}
          {isThreeDotMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl py-2 z-50 text-xs select-none">
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase text-neutral-500 tracking-wider border-b border-neutral-800">
                Chat Options
              </div>

              <button
                onClick={() => {
                  setActiveView('tuning');
                  setIsThreeDotMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 hover:bg-neutral-800 font-bold text-emerald-400 flex items-center gap-2 transition"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Open Chat Screen</span>
                <span className="ml-auto bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                  CHAT
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveView('search');
                  setIsThreeDotMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 hover:bg-neutral-800 font-semibold text-neutral-200 flex items-center gap-2 transition border-t border-neutral-800"
              >
                <Search className="w-4 h-4 text-neutral-400" />
                <span>Search Songs</span>
              </button>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div 
          onClick={() => setActiveView('tuning')}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-black font-extrabold flex items-center justify-center text-xs shadow-md cursor-pointer hover:scale-105 transition"
          title="User Account"
        >
          A
        </div>
      </div>
    </header>
  );
};


