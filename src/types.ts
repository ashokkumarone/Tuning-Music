export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl: string;
  genre: string;
  lyrics: LyricLine[];
  likes: number;
  plays: number;
  isLiked?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songs: Song[];
  isCustom?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'friend_alex' | 'friend_priya' | 'friend_kumar';
  senderName: string;
  senderAvatar: string;
  text: string;
  imageUrl?: string;
  timestamp: string;
  sharedSongId?: string;
  roomTopic?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  activeUsersCount: number;
  currentSongId: string;
  genre: string;
  description: string;
  iconName: string;
}
