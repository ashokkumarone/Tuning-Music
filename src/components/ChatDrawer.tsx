import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Image as ImageIcon, 
  Play, 
  Sparkles, 
  Users, 
  Radio, 
  Music, 
  ChevronDown,
  Trash2,
  Bot
} from 'lucide-react';
import { ChatMessage, ChatRoom, Song } from '../types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chatRooms: ChatRoom[];
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, imageBase64?: string) => void;
  songs: Song[];
  onPlaySong: (song: Song) => void;
  currentSong: Song | null;
  isAiLoading: boolean;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  chatRooms,
  activeRoomId,
  onSelectRoom,
  messages,
  onSendMessage,
  songs,
  onPlaySong,
  currentSong,
  isAiLoading
}) => {
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeRoom = chatRooms.find((r) => r.id === activeRoomId) || chatRooms[0];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiLoading]);

  if (!isOpen) return null;

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Image is too large. Please choose an image under 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedImage) return;

    onSendMessage(inputText, attachedImage || undefined);
    setInputText('');
    setAttachedImage(null);
  };

  // Quick prompt click
  const handleQuickPrompt = (prompt: string) => {
    onSendMessage(prompt);
  };

  return (
    <aside className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-neutral-950/95 backdrop-blur-2xl border-l border-neutral-800/80 shadow-2xl z-40 flex flex-col justify-between select-none">
      
      {/* 1. Header & Room Switcher */}
      <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-900/80 sticky top-0 z-10">
        {/* Room Dropdown Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
            className="flex items-center gap-2 text-white font-bold text-sm bg-neutral-800 border border-neutral-700/60 hover:border-emerald-500/50 px-3 py-1.5 rounded-full transition-all"
          >
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>{activeRoom.name}</span>
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          </button>

          {isRoomDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-2 z-50 space-y-1">
              <p className="text-[10px] font-bold uppercase text-neutral-500 px-2 py-1">
                Select SoundRoom
              </p>
              {chatRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => {
                    onSelectRoom(room.id);
                    setIsRoomDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                    room.id === activeRoomId
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <span className="truncate">{room.name}</span>
                  <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400 font-bold">
                    {room.activeUsersCount}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active listeners & Close */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 flex items-center gap-1 font-semibold">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            {activeRoom.activeUsersCount} online
          </span>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Room Welcome Header */}
        <div className="text-center py-3 px-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
          <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Welcome to {activeRoom.name}
          </p>
          <p className="text-[11px] text-neutral-400">{activeRoom.description}</p>
        </div>

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isAi = msg.sender === 'ai';
          const sharedSong = msg.sharedSongId ? songs.find((s) => s.id === msg.sharedSongId) : null;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <img
                src={msg.senderAvatar}
                alt={msg.senderName}
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-neutral-700/60 shadow"
              />

              {/* Message Content */}
              <div className={`max-w-[80%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Sender Name & Timestamp */}
                <div className={`flex items-center gap-2 text-[10px] text-neutral-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <span className="font-bold text-neutral-300">{msg.senderName}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Bubble */}
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed shadow-md ${
                    isUser
                      ? 'bg-emerald-500 text-black font-medium rounded-tr-none'
                      : isAi
                      ? 'bg-gradient-to-r from-neutral-900 to-indigo-950/80 text-white border border-indigo-500/30 rounded-tl-none'
                      : 'bg-neutral-900 text-neutral-200 border border-neutral-800 rounded-tl-none'
                  }`}
                >
                  {/* Image attachment inside message */}
                  {msg.imageUrl && (
                    <div className="mb-2 rounded-xl overflow-hidden border border-black/20 max-h-48">
                      <img
                        src={msg.imageUrl}
                        alt="Shared image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Shared Song Card in Chat */}
                  {sharedSong && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-black/60 border border-neutral-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <img
                          src={sharedSong.coverUrl}
                          alt={sharedSong.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{sharedSong.title}</p>
                          <p className="text-[10px] text-neutral-400 truncate">{sharedSong.artist}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onPlaySong(sharedSong)}
                        className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[10px] px-2.5 py-1 rounded-full shrink-0 shadow transition"
                      >
                        <Play className="w-3 h-3 fill-black" />
                        Play
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isAiLoading && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-neutral-900/80 p-3 rounded-xl border border-emerald-500/20 w-fit">
            <Bot className="w-4 h-4 animate-bounce" />
            <span>Gemini AI DJ is analyzing and curating response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Quick Suggestion Prompt Chips */}
      <div className="px-4 py-2 bg-neutral-900/60 border-t border-neutral-800/60 overflow-x-auto whitespace-nowrap custom-scrollbar flex gap-2">
        <button
          onClick={() => handleQuickPrompt('Recommend Tamil acoustic chill songs')}
          className="text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white px-2.5 py-1 rounded-full border border-neutral-700/50 transition shrink-0"
        >
          🎵 Tamil Chill Songs
        </button>
        <button
          onClick={() => handleQuickPrompt('Suggest a playlist for rainy evening coffee mood')}
          className="text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white px-2.5 py-1 rounded-full border border-neutral-700/50 transition shrink-0"
        >
          🌧️ Rainy Mood Playlist
        </button>
        <button
          onClick={() => handleQuickPrompt('Explain the lyrics of Nilaave Vaa song')}
          className="text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white px-2.5 py-1 rounded-full border border-neutral-700/50 transition shrink-0"
        >
          📜 Lyrics Explanation
        </button>
      </div>

      {/* 4. Attached Image Preview bar */}
      {attachedImage && (
        <div className="px-4 py-2 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={attachedImage} alt="Attachment" className="w-10 h-10 rounded-md object-cover border border-emerald-500" />
            <span className="text-xs text-emerald-400 font-semibold">Image attached for AI analysis</span>
          </div>
          <button
            onClick={() => setAttachedImage(null)}
            className="p-1 rounded-full bg-neutral-800 text-neutral-400 hover:text-rose-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5. Chat Input Box */}
      <form onSubmit={handleSend} className="p-4 border-t border-neutral-800/80 bg-neutral-900/90 flex items-center gap-2">
        {/* File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`p-2.5 rounded-full transition ${
            attachedImage
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
          }`}
          title="Attach image or album artwork to share with AI or room"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        {/* Input Field */}
        <input
          type="text"
          placeholder={activeRoomId === 'room-ai-dj' ? 'Ask Gemini AI DJ or send an image...' : 'Send message in SoundRoom...'}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-neutral-800 text-white text-xs rounded-full px-4 py-2.5 outline-none border border-neutral-700/60 focus:border-emerald-500 transition placeholder:text-neutral-500"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() && !attachedImage}
          className="w-9 h-9 rounded-full bg-emerald-500 text-black flex items-center justify-center disabled:opacity-40 hover:scale-105 active:scale-95 transition shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <Send className="w-4 h-4 fill-black" />
        </button>
      </form>

    </aside>
  );
};
