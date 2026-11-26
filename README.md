<div align="center">

# 🎧 Tuning

### Speak in Songs.

The music platform where every conversation starts with a song.
Share what you're feeling — not in words, but in music.

<br>

[**🎵 Open Tuning**](https://ashokkumarone.github.io/Tuning-Music/)&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;[**📄 Product Spec**](./Tuning_Product_Requirements.md)&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;[**🗄️ Schema**](./schema.sql)

<br>

![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-FF4154?style=flat-square&logo=framer&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-222?style=flat-square&logo=github&logoColor=white)

</div>

<br>

---

<br>

## What is Tuning?

**Tuning** is a social music experience where songs replace text messages. Instead of typing how you feel, you send a track. Instead of reacting with emojis, you react with music.

Think of it as a **messaging layer built on music** — conversations happen through shared songs, lyric highlights, and real-time SoundRooms where people connect over what they're listening to.

<br>

## ✨ Features

### 🏠 Home — Your Music Feed
Browse curated collections across genres — Trending Pop Hits, Chill Acoustics, Rock & High Energy, Hip Hop, Fresh Discoveries, and Top Podcasts. Every track is one tap away from your next conversation.

### 💬 SoundRooms — Chat Through Music
Join live music rooms where the conversation *is* the playlist. Share a song, and it becomes part of the room's story. Everyone hears what you're feeling.

- **#global-top-hits** — What the world is listening to right now
- **#lofi-study-vibes** — Calm beats, focused energy
- **#indie-acoustic-lounge** — Stripped-back, raw, real
- **#weekend-party-mix** — Friday night, volume up

### 🎵 Now Playing — Immersive Playback
Full-screen album art, synchronized lyrics, smooth animations. When you play a song in Tuning, you *experience* it — and you can share that exact moment with anyone.

### ⚡ One-Tap Reactions
No keyboards. No typing. See a song someone shared? React instantly — 🔥 ❤️ 🎶 — right on the song card. Music is the response.

### 🎤 Lyric Timestamp Sharing *(Pro)*
Found *that one line* that says everything? Highlight it, timestamp it, send it. The receiver's playback starts at exactly that moment. Context-perfect communication.

### 🧭 Guided Onboarding
First-time users get an interactive 4-step tour that walks through Home, SoundRooms, Now Playing, and sharing — so the experience clicks in seconds.

<br>

## 🎯 The Problem We're Solving

Sharing music today is broken:

| Today's Experience | With Tuning |
|:---|:---|
| Copy a Spotify link → switch to WhatsApp → paste → hope they click | **One-tap share** inside the listening experience |
| Receiver clicks link → leaves their app → loses their queue | **Non-destructive preview** right in the chat |
| "Listen from 1:42, that line is exactly how I feel" | **Timestamp Lyric Share** — playback starts at the right moment |
| Type a full reply to acknowledge a 3-minute track | **Instant emoji reaction** on the song card |

> Music shouldn't need a translator. In Tuning, the song *is* the message.

<br>

## 🏗️ Architecture

```
tuning-music/
├── src/
│   ├── App.tsx                    # Root — audio engine, state management, layout
│   ├── components/
│   │   └── TuningPhoneView.tsx    # Core UI — all screens, navigation, interactions
│   ├── data/
│   │   └── musicData.ts           # Song catalog, SoundRooms, chat data
│   └── ...
├── Tuning_Product_Requirements.md # Full PRD with user stories & rollout phases
├── schema.sql                     # Database schema — Users, Songs, Tuning Logs
└── .github/workflows/deploy.yml   # CI/CD — auto-deploy to GitHub Pages on push
```

<br>

## 🚀 Run Locally

```bash
# Clone
git clone https://github.com/ashokkumarone/Tuning-Music.git
cd Tuning-Music

# Install & Start
npm install
npm run dev
```



<br>

## 💎 Monetization Model

| | Free | Pro — \$1.99/mo |
|:---|:---:|:---:|
| Song Sharing & Chat | ✅ | ✅ |
| Emoji Reactions | ✅ | ✅ |
| Chat Themes | ✅ | ✅ |
| Timestamp Lyric Sharing | — | ✅ |
| Emotion Buckets | — | ✅ |
| Ad-Free Experience | — | ✅ |

<br>

## 📊 Product Metrics

| Metric | Target | Why It Matters |
|:---|:---|:---|
| Daily Active Sharers | 20% of DAU | Core sharing loop adoption |
| Reaction Velocity | 40%+ within 5 min | Low-friction engagement validation |
| Lyric Timestamp Usage | 15% weekly | Willingness to pay signal |
| Free → Pro Conversion | 5% in 60 days | Revenue sustainability |
| Viral Coefficient | > 1.2 | Organic growth engine |

<br>

## 🗺️ Product Roadmap

```mermaid
flowchart LR
    P1["Phase 1\nCore Chat + Sharing"]
    P2["Phase 2\nSoundRooms + Reactions"]
    P3["Phase 3\nTimestamp Lyrics (Pro)"]
    P4["Phase 4\nSpotify API Integration"]

    P1 --> P2 --> P3 --> P4

    style P1 fill:#10b981,color:#fff,stroke:none
    style P2 fill:#3b82f6,color:#fff,stroke:none
    style P3 fill:#8b5cf6,color:#fff,stroke:none
    style P4 fill:#f59e0b,color:#fff,stroke:none
```

<br>

## ⚔️ Competitive Position

| | WhatsApp Share | Apple SharePlay | IG Music Stickers | **Tuning** |
|:---|:---|:---|:---|:---|
| **Integration** | External link | Requires FaceTime | Story editor | **Native chat layer** |
| **Effort** | High (app switching) | High (call setup) | Medium | **One tap** |
| **Lyric Sharing** | ❌ | ❌ | Static text | **Dynamic timestamp** |
| **Reactions** | Generic emoji | Audio | DM reply | **Song-specific** |

<br>

---

<div align="center">

**Built by [Ashokkumar S](https://linkedin.com/in/ashokkumarone)**

[Portfolio](https://ashokkumarone.github.io/) · [LinkedIn](https://linkedin.com/in/ashokkumarone) · [GitHub](https://github.com/ashokkumarone)

*Tuning — because sometimes a song says it better than you ever could.*

</div>
