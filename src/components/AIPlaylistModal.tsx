import React, { useState } from 'react';
import { X, Sparkles, Loader2, Music, Check } from 'lucide-react';
import { Playlist, Song } from '../types';

interface AIPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlaylist: (playlist: Playlist) => void;
  availableSongs: Song[];
}

export const AIPlaylistModal: React.FC<AIPlaylistModalProps> = ({
  isOpen,
  onClose,
  onAddPlaylist,
  availableSongs
}) => {
  const [promptText, setPromptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const res = await fetch('/api/generate-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });
      const data = await res.json();
      setGeneratedResult(data);
    } catch (err) {
      console.error('Failed to generate playlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGeneratedPlaylist = () => {
    if (!generatedResult) return;

    const newPlaylist: Playlist = {
      id: `pl-ai-${Date.now()}`,
      name: generatedResult.name || `${promptText} Mix`,
      description: generatedResult.description || 'Custom AI Mix created for your vibe.',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      songs: availableSongs.slice(0, 4), // Mix from available library songs
      isCustom: true,
    };

    onAddPlaylist(newPlaylist);
    setPromptText('');
    setGeneratedResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 fill-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Gemini AI Playlist Mix</h2>
            <p className="text-xs text-neutral-400">Describe your mood or activity to auto-create a mix</p>
          </div>
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider block mb-2">
              What's your vibe today?
            </label>
            <textarea
              rows={3}
              placeholder="e.g., Acoustic Tamil melodies for a rainy evening coffee, or high energy kuthu dance party..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700/80 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-emerald-500 transition placeholder:text-neutral-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setPromptText('Rainy evening Tamil acoustic chill')}
                className="text-[10px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2 py-1 rounded-full border border-neutral-700"
              >
                ☕ Tamil Rain
              </button>
              <button
                type="button"
                onClick={() => setPromptText('High energy dappan kuthu workout beats')}
                className="text-[10px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2 py-1 rounded-full border border-neutral-700"
              >
                🔥 Kuthu Workout
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !promptText.trim()}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs px-5 py-2.5 rounded-full transition disabled:opacity-40 shadow-lg shadow-emerald-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-black" />
                  Generate
                </>
              )}
            </button>
          </div>
        </form>

        {/* Generated Result Display */}
        {generatedResult && (
          <div className="bg-neutral-950/80 p-4 rounded-2xl border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                <Music className="w-4 h-4" />
                {generatedResult.name}
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                AI Ready
              </span>
            </div>

            <p className="text-xs text-neutral-300">{generatedResult.description}</p>

            {generatedResult.suggestedTracks && (
              <ul className="text-xs text-neutral-400 space-y-1 pl-2 border-l-2 border-emerald-500/50">
                {generatedResult.suggestedTracks.map((t: any, i: number) => (
                  <li key={i}>
                    • <span className="text-white font-semibold">{t.title}</span> - {t.artist}
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={handleAddGeneratedPlaylist}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow"
            >
              <Check className="w-4 h-4" />
              Add Mix to Your Library
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
