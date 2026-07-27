import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body parser with larger payload support for base64 image uploads in chat
  app.use(express.json({ limit: '15mb' }));

  // Initialize Gemini API client on server side
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasGeminiKey: !!apiKey });
  });

  // AI Music Assistant & Image Analyzer Chat Endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, imageData, roomTopic, currentSongTitle } = req.body;

      if (!ai) {
        return res.json({
          reply: `I'm Gemini AI DJ! I can help you discover songs and analyze images for music vibes. (Note: Server GEMINI_API_KEY is currently taking default response: Here is a recommended track: Nilaave Vaa or Kannamma Lo-Fi!)`,
          suggestedSongId: 'song-1',
        });
      }

      const systemInstruction = `You are "Gemini AI DJ & SoundRoom Music Companion" inside a Spotify-like web app.
Your goals:
1. Help users with song recommendations, music trivia, Tamil & English song lyrics explanations, and music mood discovery.
2. If the user sends an image (photo of scenery, outfit, mood, album cover, or meme), analyze the visual mood, aesthetics, and colors, and recommend 2-3 songs or a vibe playlist matching that photo!
3. Current playing track in app: "${currentSongTitle || 'Nilaave Vaa'}".
4. Active Room: "${roomTopic || 'General SoundRoom'}".
5. Keep responses concise, engaging, and music-focused with emojis. If the user speaks in Tamil or Tamil-English (Tanglish like "Enakku romantic Tamil songs venum" or "Oru paattu sollunge"), reply in friendly Tanglish/Tamil and English!`;

      let parts: any[] = [];

      if (imageData) {
        // Strip data header if present (e.g., "data:image/jpeg;base64,")
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        const mimeType = imageData.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        });
      }

      const userText = message && message.trim().length > 0 
        ? message 
        : (imageData ? 'Analyze this image and recommend a matching music vibe and Tamil/English songs for it!' : 'Recommend a good song for me right now!');

      parts.push({ text: userText });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: { parts },
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });

      const replyText = response.text || 'Grooving to the music! Let me know what vibe you are looking for.';

      // Determine if a song from our library should be suggested
      let suggestedSongId = undefined;
      const lowerReply = replyText.toLowerCase();
      if (lowerReply.includes('nilaave') || lowerReply.includes('chill') || lowerReply.includes('romantic')) {
        suggestedSongId = 'song-1';
      } else if (lowerReply.includes('kannamma') || lowerReply.includes('lofi') || lowerReply.includes('study')) {
        suggestedSongId = 'song-2';
      } else if (lowerReply.includes('neon') || lowerReply.includes('synth') || lowerReply.includes('electronic')) {
        suggestedSongId = 'song-3';
      } else if (lowerReply.includes('kuthu') || lowerReply.includes('mass') || lowerReply.includes('dance')) {
        suggestedSongId = 'song-6';
      }

      res.json({
        reply: replyText,
        suggestedSongId,
      });
    } catch (error: any) {
      console.error('Error in /api/chat:', error);
      res.status(500).json({
        error: 'Failed to communicate with AI DJ',
        message: error?.message || 'Internal error',
      });
    }
  });

  // AI Custom Playlist Generator Endpoint
  app.post('/api/generate-playlist', async (req, res) => {
    try {
      const { prompt } = req.body;

      if (!ai) {
        return res.json({
          name: `${prompt || 'Custom'} Vibe Mix`,
          description: 'A custom AI curated mix generated for your current mood.',
          tracks: [
            { title: 'Nilaave Vaa (Acoustic Night)', artist: 'Anirudh & Pradeep' },
            { title: 'Kannamma Midnight Lo-Fi', artist: 'Sid Sriram & ChillHop India' },
            { title: 'Neon Chennai Nights', artist: 'AR Rahman Synth Ensemble' },
          ],
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Create a customized 5-song Spotify playlist for the following prompt/vibe: "${prompt}".
Provide output in valid JSON format with keys:
- "name": String short catchy playlist title (e.g. "Rainy Night Tamil Melodies 🌧️")
- "description": String 1-sentence vibe description
- "genre": String
- "suggestedTracks": Array of 4 objects, each with "title" and "artist"`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const jsonString = response.text || '{}';
      const parsedData = JSON.parse(jsonString);
      res.json(parsedData);
    } catch (err: any) {
      console.error('Error in /api/generate-playlist:', err);
      res.status(500).json({ error: 'Failed to generate playlist' });
    }
  });

  // Vite middleware or Static files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Spotify SoundRoom server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
