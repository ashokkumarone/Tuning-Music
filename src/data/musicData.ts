import { Song, Playlist, ChatRoom, ChatMessage } from '../types';

export const INITIAL_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Birds of a Feather',
    artist: 'Billie Eilish',
    album: 'HIT ME HARD AND SOFT',
    duration: 198,
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80',
    audioUrl: '',
    genre: 'Indie Pop',
    likes: 4210,
    plays: 18450,
    isLiked: true,
    lyrics: [
      { time: 0, text: "♪ Gentle acoustic rhythm starts ♪" },
      { time: 10, text: "I want you to stay" },
      { time: 16, text: "'Til I'm in the grave" },
      { time: 23, text: "'Til I rot away, dead and buried" },
      { time: 30, text: "'Til I'm in the casket you carry" },
      { time: 38, text: "If you go, I'm goin' too, uh" },
      { time: 45, text: "'Cause it was always you (alright)" },
      { time: 54, text: "And if I'm turnin' blue, please don't save me" },
      { time: 64, text: "Nothing left to lose without my baby" },
      { time: 75, text: "Birds of a feather, we should stick together, I know" },
      { time: 88, text: "I said I'd never think I wasn't better alone" },
      { time: 101, text: "Can't change the weather, might not be forever" },
      { time: 114, text: "But if it's forever, it's even better" }
    ]
  },
  {
    id: 'song-2',
    title: 'Die With A Smile',
    artist: 'Lady Gaga & Bruno Mars',
    album: 'Die With A Smile - Single',
    duration: 251,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
    audioUrl: '',
    genre: 'Pop Soul',
    likes: 6320,
    plays: 24100,
    isLiked: true,
    lyrics: [
      { time: 0, text: "♪ Melodic guitar and organ intro ♪" },
      { time: 12, text: "Ooh, I, I just woke up from a dream" },
      { time: 22, text: "Where you and I had to say goodbye" },
      { time: 31, text: "And I don't know what it all means" },
      { time: 42, text: "But since I survived, I realized" },
      { time: 53, text: "Wherever you go, that's where I'll follow" },
      { time: 66, text: "Nobody's promised tomorrow" },
      { time: 78, text: "So I'ma love you every night like it's the last night" },
      { time: 92, text: "If the world was ending, I'd wanna be next to you" },
      { time: 108, text: "If the party was over and our time on Earth was through" },
      { time: 124, text: "I'd wanna hold you just for a while" },
      { time: 138, text: "And die with a smile" }
    ]
  },
  {
    id: 'song-3',
    title: 'Espresso',
    artist: 'Sabrina Carpenter',
    album: 'Short n\' Sweet',
    duration: 175,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
    audioUrl: '',
    genre: 'Dance Pop',
    likes: 5890,
    plays: 28900,
    isLiked: false,
    lyrics: [
      { time: 0, text: "♪ Funky bassline and groove ♪" },
      { time: 8, text: "Now he's thinkin' 'bout me every night, oh" },
      { time: 18, text: "Is it that sweet? I guess so" },
      { time: 26, text: "Say you can't sleep, baby, I know" },
      { time: 36, text: "That's that me, espresso" },
      { time: 45, text: "Move it up, down, left, right, oh" },
      { time: 54, text: "Switch it up like Nintendo" },
      { time: 64, text: "Say you can't sleep, baby, I know" },
      { time: 74, text: "That's that me, espresso" }
    ]
  },
  {
    id: 'song-4',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80',
    audioUrl: '',
    genre: 'Synthwave',
    likes: 8940,
    plays: 35000,
    isLiked: true,
    lyrics: [
      { time: 0, text: "♪ Upbeat 80s synth and heavy bass intro ♪" },
      { time: 12, text: "Yeah... I've been tryna call" },
      { time: 19, text: "I've been on my own for long enough" },
      { time: 26, text: "Maybe you can show me how to love, maybe" },
      { time: 35, text: "I'm going through withdrawals" },
      { time: 42, text: "You don't even have to do too much" },
      { time: 49, text: "You can turn me on with just a touch, baby" },
      { time: 58, text: "I look around and Sin City's cold and empty" },
      { time: 66, text: "No one's around to judge me" },
      { time: 74, text: "I can't see clearly when you're gone" },
      { time: 82, text: "I said, ooh, I'm blinded by the lights" },
      { time: 94, text: "No, I can't sleep until I feel your touch" }
    ]
  },
  {
    id: 'song-5',
    title: 'Cruel Summer',
    artist: 'Taylor Swift',
    album: 'Lover',
    duration: 178,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    audioUrl: '',
    genre: 'Synth Pop',
    likes: 7810,
    plays: 31200,
    isLiked: true,
    lyrics: [
      { time: 0, text: "♪ Dreamy synth intro ♪" },
      { time: 10, text: "Fever dream high in the quiet of the night" },
      { time: 18, text: "You know that I caught it" },
      { time: 25, text: "Bad, bad boy, shiny toy with a price" },
      { time: 32, text: "You know that I bought it" },
      { time: 40, text: "Killing me slow, out the window" },
      { time: 48, text: "I'm always waiting for you to be waiting below" },
      { time: 56, text: "And it's new, the shape of your body" },
      { time: 64, text: "It's blue, the feeling I've got" },
      { time: 72, text: "And it's ooh, whoa, oh, it's a cruel summer" },
      { time: 82, text: "It's cool, that's what I tell 'em" },
      { time: 90, text: "No rules in breakable heaven" },
      { time: 98, text: "I love you, ain't that the worst thing you ever heard?" }
    ]
  },
  {
    id: 'song-6',
    title: 'Viva La Vida',
    artist: 'Coldplay',
    album: 'Viva La Vida',
    duration: 242,
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=400&q=80',
    audioUrl: '',
    genre: 'Alternative Rock',
    likes: 6540,
    plays: 27500,
    isLiked: false,
    lyrics: [
      { time: 0, text: "♪ Swelling orchestral strings intro ♪" },
      { time: 14, text: "I used to roll the dice" },
      { time: 22, text: "Feel the fear in my enemy's eyes" },
      { time: 30, text: "Listen as the crowd would sing" },
      { time: 38, text: "Now the old king is dead, long live the king" },
      { time: 50, text: "One minute I held the key" },
      { time: 58, text: "Next the walls were closed on me" },
      { time: 66, text: "And I discovered that my castles stand" },
      { time: 74, text: "Upon pillars of salt and pillars of sand" },
      { time: 86, text: "I hear Jerusalem bells are ringing" },
      { time: 96, text: "Roman Cavalry choirs are singing" }
    ]
  },
  {
    id: 'song-7',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    duration: 167,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80',
    audioUrl: '',
    genre: 'Indie Pop',
    likes: 8120,
    plays: 33400,
    isLiked: true,
    lyrics: [
      { time: 0, text: "♪ Ringing bells and upbeat synth melody ♪" },
      { time: 10, text: "Hold on, ring the bell" },
      { time: 18, text: "You know you're no good alone" },
      { time: 26, text: "Why are you sitting on the floor?" },
      { time: 34, text: "What kind of pills are you on?" },
      { time: 42, text: "Ring the bell, nobody's coming to help" },
      { time: 52, text: "Your daddy lives by himself" },
      { time: 60, text: "He just wants to know that you're well, oh" },
      { time: 70, text: "In this world, it's just us" },
      { time: 80, text: "You know it's not the same as it was" },
      { time: 92, text: "As it was, as it was" }
    ]
  },
  {
    id: 'song-8',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    audioUrl: '',
    genre: 'Synth Pop',
    likes: 7320,
    plays: 29800,
    isLiked: true,
    lyrics: [
      { time: 0, text: "♪ Bright synth chords and upbeat rhythm ♪" },
      { time: 12, text: "I saw you dancing in a crowded room" },
      { time: 22, text: "You look so happy when I'm not with you" },
      { time: 32, text: "But then you saw me, caught you by surprise" },
      { time: 42, text: "A single teardrop falling from your eye" },
      { time: 52, text: "I don't know why I run away" },
      { time: 64, text: "I make you cry when I run away" },
      { time: 76, text: "Take me back 'cause I wanna stay" },
      { time: 88, text: "Save your tears for another day" }
    ]
  },
  {
    id: 'song-9',
    title: 'Sunflower',
    artist: 'Post Malone & Swae Lee',
    album: 'Spider-Man: Into the Spider-Verse',
    duration: 158,
    coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=400&q=80',
    audioUrl: '',
    genre: 'Hip-Hop / Melodic',
    likes: 9140,
    plays: 38200,
    isLiked: true,
    lyrics: [
      { time: 0, text: "♪ Warm melodic intro chord ♪" },
      { time: 8, text: "Ayy, ayy, ayy, ayy" },
      { time: 16, text: "Needless to say, I keep her in check" },
      { time: 24, text: "She was a bad-bad, nevertheless" },
      { time: 32, text: "Callin' it quits now, baby, I'm a wreck" },
      { time: 40, text: "Crash at my place, baby, you're a wreck" },
      { time: 48, text: "Thinkin' in a bad way, losin' your grip" },
      { time: 56, text: "Screamin' at my face, baby, don't trip" },
      { time: 64, text: "Someone took a big L, don't know how that felt" },
      { time: 74, text: "Then you're left in the dust, unless I stuck by ya" },
      { time: 84, text: "You're a sunflower, I think your love would be too much" }
    ]
  },
  {
    id: 'song-10',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 203,
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80',
    audioUrl: '',
    genre: 'Disco Pop',
    likes: 6720,
    plays: 28400,
    isLiked: false,
    lyrics: [
      { time: 0, text: "♪ Funky disco bass and rhythm guitar ♪" },
      { time: 10, text: "If you wanna run away with me, I know a galaxy" },
      { time: 20, text: "And I can take you for a ride" },
      { time: 28, text: "I had a premonition that we fell into a rhythm" },
      { time: 38, text: "Where the music don't stop for life" },
      { time: 48, text: "Glitter in the sky, glitter in my eyes" },
      { time: 58, text: "Shining just the way I like" },
      { time: 68, text: "If you're feeling like you need a little bit of company" },
      { time: 78, text: "You met me at the perfect time" },
      { time: 88, text: "You want me, I want you, baby" },
      { time: 98, text: "My sugarboo, I'm levitating" }
    ]
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-trending',
    name: 'Global Trending Today',
    description: 'Top viral tracks shared across Tuning conversations this week.',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80',
    songs: INITIAL_SONGS.slice(0, 5)
  },
  {
    id: 'pl-late-night',
    name: 'Late Night Tuning',
    description: 'Acoustic moments and emotional lyrics sent after midnight.',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80',
    songs: [INITIAL_SONGS[0], INITIAL_SONGS[1], INITIAL_SONGS[5], INITIAL_SONGS[7]]
  },
  {
    id: 'pl-upbeat',
    name: 'Hype & Energy Mix',
    description: 'Feel-good anthems to share with friends and spark reactions.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
    songs: [INITIAL_SONGS[2], INITIAL_SONGS[3], INITIAL_SONGS[8], INITIAL_SONGS[9]]
  }
];

export const INITIAL_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'room-global-hits',
    name: '#global-top-hits',
    activeUsersCount: 142,
    currentSongId: 'song-1',
    genre: 'Pop / Trending',
    description: 'Live listening room sharing Billboard and global viral tracks.',
    iconName: 'Flame'
  },
  {
    id: 'room-lofi',
    name: '#lofi-study-vibes',
    activeUsersCount: 88,
    currentSongId: 'song-2',
    genre: 'Chill / Ambient',
    description: 'Relaxed room for working, studying, and exchanging mood songs.',
    iconName: 'Coffee'
  },
  {
    id: 'room-indie',
    name: '#indie-acoustic-lounge',
    activeUsersCount: 64,
    currentSongId: 'song-6',
    genre: 'Acoustic / Indie',
    description: 'Deep cuts, lyrics discussions, and songwriter appreciation.',
    iconName: 'Guitar'
  },
  {
    id: 'room-party',
    name: '#weekend-party-mix',
    activeUsersCount: 195,
    currentSongId: 'song-3',
    genre: 'Dance / Synthwave',
    description: 'High energy dance tracks, drops, and synchronous hype reactions.',
    iconName: 'Sparkles'
  }
];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'room-global-hits': [
    {
      id: 'msg-g1',
      sender: 'friend_alex',
      senderName: 'Alex Miller',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      text: 'That acoustic intro on Birds of a Feather gives me chills every time ✨',
      timestamp: '10:14 AM',
      sharedSongId: 'song-1',
      roomTopic: 'room-global-hits'
    },
    {
      id: 'msg-g2',
      sender: 'friend_priya',
      senderName: 'Priya Sharma',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      text: 'The vocal harmony at 1:15 is unmatched! Added straight to favorites ❤️',
      timestamp: '10:18 AM',
      sharedSongId: 'song-2',
      roomTopic: 'room-global-hits'
    }
  ],
  'room-lofi': [
    {
      id: 'msg-l1',
      sender: 'friend_kumar',
      senderName: 'Marcus Cole',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      text: 'Perfect background vibe while finishing up this product roadmap ☕',
      timestamp: '09:40 AM',
      sharedSongId: 'song-2',
      roomTopic: 'room-lofi'
    }
  ],
  'room-indie': [
    {
      id: 'msg-i1',
      sender: 'friend_alex',
      senderName: 'Alex Miller',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      text: 'Viva La Vida string section will always remain a timeless masterpiece 🎻',
      timestamp: '11:05 AM',
      sharedSongId: 'song-6',
      roomTopic: 'room-indie'
    }
  ],
  'room-party': [
    {
      id: 'msg-p1',
      sender: 'friend_priya',
      senderName: 'Priya Sharma',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      text: 'Espresso has been on repeat all morning! That funky bassline 🚀',
      timestamp: '11:20 AM',
      sharedSongId: 'song-3',
      roomTopic: 'room-party'
    }
  ]
};
