# Tuning — Product Requirements & KPI Document

## Overview
Tuning is a social communication layer built on top of the Spotify ecosystem, letting users share songs, react with emojis, and share exact lyric timestamps instead of typed messages.

## Problem Statement
Music apps are socially silent — users can share a song link, but there's no reaction system, no way to point to a specific lyric moment, and no keyboard-free way to express emotion through music.

## Goals
- Let users share a song as a message, not just a link
- Enable low-friction reactions (emoji) to shared songs
- Let users highlight and share a specific lyric timestamp
- Introduce a freemium model that drives both engagement and conversion

## Assumptions & Constraints
- Assumes access to the Spotify Web API for playback control and song metadata
- Assumes users already have an active Spotify account (no standalone music library)
- Lyrics availability depends on third-party lyrics licensing/API coverage
- Feature parity assumed across web and mobile; no platform-specific gating planned

## User Stories
- As a user, I want to send a song directly from the player to a chat, so I don't have to copy-paste a link.
- As a user, I want to react to a song someone sent me with an emoji, so I can respond without typing.
- As a Pro user, I want to highlight a specific lyric line and share it, so the receiver hears exactly the moment I meant.
- As a user, I want to see which of my friends are active Tuning users, so I know who I can share songs with.

## Core Features & Priority

### Phase 1 (MVP)
1. **Song Share as a Message** — Free
   - Trigger: ⋯ menu on the Spotify player → "Chat via Tuning"
   - Flow: Select conversation → Send
2. **Emoji Reactions** — Free
   - Trigger: React to any shared song in chat
   - No typing required

### Phase 2
3. **Timestamp Sharing** — Pro
   - Trigger: Highlight a specific lyric line while a song plays
   - Behavior: Receiver's playback starts exactly at that timestamp
4. **Emotion Buckets** — Pro
5. **Ad-Free Experience** — Pro

## Freemium Model

| Feature | Free | Pro |
|---|---|---|
| Song Share | ✅ | ✅ |
| Emoji Reactions | ✅ | ✅ |
| Shared Chat Wallpaper | ✅ | ✅ |
| Timestamp Sharing | ❌ | ✅ |
| Emotion Buckets | ❌ | ✅ |
| Ad-Free Experience | ❌ | ✅ |

## Data Requirements
- User profile with subscription tier (Free/Pro)
- Song metadata with lyrics and emotion tags
- Interaction log linking sender, receiver, song, timestamp, and reaction
(See `schema.sql` for full table definitions)

## Key Metrics & Targets

| Metric | Why It Matters | Target |
|---|---|---|
| **Daily Active Sharers** | Measures core loop adoption | 20% of DAU |
| **Reaction Rate** | Free feature engagement health | 40%+ of shares get a reaction |
| **Timestamp Share Rate** | Pro feature value signal | 15% of Pro users use it weekly |
| **Free → Pro Conversion Rate** | Business model validation | 5% within first 60 days |
| **Songs Shared per User per Week** | Depth of engagement | 3+ per active user |
| **Chat Session Length** | Retention quality indicator | +20% vs. baseline chat sessions |

## Analyst Insight

Reaction-only communication removes keyboard friction. Lower friction leads to higher reply rate, more sessions, and a stronger retention loop.

This mirrors WhatsApp's reaction feature impact — after reactions launched, reply rates increased significantly without users needing to type anything. Tuning applies this same principle to music sharing.

## Out of Scope (v1)
- Group Tuning
- Mood Playlists
- Spotify Wrapped integration
- Live "Now Playing" visibility

These are tracked under Future Scope for later versions.
