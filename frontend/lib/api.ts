const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('cv_token') : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return res.json();
}

// Auth
export const auth = {
  register: (data: { email: string; username: string; password: string; role?: string }) =>
    request<{ token: string; user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
};

// Feed
export const feed = {
  getPersonalized: (page = 1) => request<{ posts: Post[]; isEmpty: boolean }>(`/feed?page=${page}`),
  getExplore: (page = 1) => request<Post[]>(`/feed/explore?page=${page}`),
};

// Characters
export const characters = {
  list: (params?: { universe?: string; search?: string; page?: number }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return request<Character[]>(`/characters${q ? `?${q}` : ''}`);
  },
  get: (id: string) => request<Character>(`/characters/${id}`),
  create: (data: Partial<Character>) =>
    request<Character>('/characters', { method: 'POST', body: JSON.stringify(data) }),
  follow: (id: string) =>
    request<{ followed: boolean }>(`/characters/${id}/follow`, { method: 'POST' }),
};

// Posts
export const posts = {
  getByCharacter: (characterId: string, page = 1) =>
    request<Post[]>(`/posts/character/${characterId}?page=${page}`),
  create: (data: { characterId: string; content: string; mediaUrl?: string; tags?: string[]; scheduledAt?: string }) =>
    request<Post>('/posts', { method: 'POST', body: JSON.stringify(data) }),
  like: (id: string) => request<{ liked: boolean }>(`/posts/${id}/like`, { method: 'POST' }),
  comment: (id: string, content: string) =>
    request<Comment>(`/posts/${id}/comment`, { method: 'POST', body: JSON.stringify({ content }) }),
};

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'READER' | 'CREATOR';
  avatar?: string;
  bio?: string;
}

export interface Character {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  universe?: string;
  followerCount: number;
  creatorId: string;
  creator?: { id: string; username: string; avatar?: string };
}

export interface Post {
  id: string;
  characterId: string;
  character: { id: string; name: string; avatar?: string; universe?: string; emoji?: string; subtitle?: string };
  content: string;
  mediaUrl?: string;
  tags: string[];
  likeCount: number;
  isAiGenerated: boolean;
  publishedAt: string;
  _count?: { comments: number; likes: number };
  arc?: string;
  poll?: {
    options: { label: string; votes: number; color: string }[];
    totalVotes: number;
    hoursLeft: number;
  };
  quotedPost?: {
    authorName: string;
    content: string;
    publishedAt: string;
  };
  replies?: {
    id: string;
    character: { name: string; universe?: string; emoji?: string };
    content: string;
    publishedAt: string;
    relTag?: string;
  }[];
  reactions?: { emoji: string; label: string; count: number }[];
}
