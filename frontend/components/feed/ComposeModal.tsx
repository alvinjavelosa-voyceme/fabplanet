'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/api';

const CHARACTERS = [
  {
    id: 'char-1',
    emoji: '☠️',
    name: 'Luffy',
    series: 'One Piece',
    universe: 'One Piece',
    arc: 'Gear 5 Era',
    subtitle: 'Monkey D. Luffy · Straw Hat Pirates',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Luffy&backgroundColor=ffd5dc&hairColor=ac6511',
    bio: "Captain of the Straw Hat Pirates. Dream is to be King of the Pirates. Simple, stubborn, and endlessly optimistic.",
  },
  {
    id: 'char-3',
    emoji: '👁',
    name: 'Gojo Satoru',
    series: 'JJK',
    universe: 'Jujutsu Kaisen',
    arc: 'Culling Game',
    subtitle: 'The Honored One · Jujutsu High',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Gojo&backgroundColor=b6e3f4&hairColor=f0f0f0',
    bio: "The world's strongest jujutsu sorcerer. Infinity user. Genuinely believes he's the greatest being alive — because he is.",
  },
  {
    id: 'char-2',
    emoji: '🗡️',
    name: 'Mikasa',
    series: 'AoT',
    universe: 'Attack on Titan',
    arc: 'Post-Rumbling',
    subtitle: 'Survey Corps · 104th Cadet Corps',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Mikasa&backgroundColor=c0aede&hairColor=0e0e0e',
    bio: "Survey Corps soldier. Deadly, loyal, grieving. Trained by Eren himself to survive.",
  },
  {
    id: 'char-6',
    emoji: '⚡',
    name: 'Killua',
    series: 'HxH',
    universe: 'Hunter x Hunter',
    arc: 'Chimera Ant Arc',
    subtitle: 'Zoldyck Family · Gon\'s Best Friend',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Killua&backgroundColor=dbeafe&hairColor=e0e0e0',
    bio: "Ex-assassin. Electric nen user. Runs away when things get hard but always comes back for Gon.",
  },
  {
    id: 'char-4',
    emoji: '✉️',
    name: 'Violet',
    series: 'VE',
    universe: 'Violet Evergarden',
    arc: undefined,
    subtitle: 'Auto Memory Doll · CH Postal Company',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Violet&backgroundColor=d1d4f9&hairColor=f5c518',
    bio: "Former child soldier turned Auto Memory Doll. Writes letters to help people say what they cannot.",
  },
  {
    id: 'char-5',
    emoji: '🗡️',
    name: 'Levi',
    series: 'AoT',
    universe: 'Attack on Titan',
    arc: undefined,
    subtitle: "Survey Corps · Humanity's Strongest",
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Levi&backgroundColor=d4d4d4&hairColor=2c2c2c',
    bio: "Humanity's strongest soldier. Short-tempered, brutally efficient, secretly cares deeply.",
  },
];

const MAX_CHARS = 280;

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
  onPost: (post: Post) => void;
}

export default function ComposeModal({ open, onClose, onPost }: ComposeModalProps) {
  const [selectedChar, setSelectedChar] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!text.trim()) return;
    const char = CHARACTERS[selectedChar];
    const newPost: Post = {
      id: `post-${Date.now()}`,
      characterId: char.id,
      character: {
        id: char.id,
        name: char.name,
        avatar: char.avatar,
        universe: char.universe,
        emoji: char.emoji,
        subtitle: char.subtitle,
      },
      content: text.trim(),
      tags: [],
      likeCount: 0,
      isAiGenerated: false,
      publishedAt: new Date().toISOString(),
      _count: { comments: 0, likes: 0 },
      arc: char.arc,
      reactions: [
        { emoji: '🔥', label: 'Hype', count: 0 },
        { emoji: '😭', label: 'Felt', count: 0 },
        { emoji: '⚔️', label: 'Based', count: 0 },
        { emoji: '💀', label: 'Rekt', count: 0 },
      ],
      replies: [],
    };
    onPost(newPost);
    setText('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-[520px] max-w-[95vw] rounded-[18px] p-5"
        style={{ background: '#13132a', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-base font-bold" style={{ color: '#e2e2f0' }}>Post as Character</span>
          <button
            onClick={onClose}
            className="text-xl leading-none transition-colors hover:text-white"
            style={{ color: '#9090b8' }}
          >
            ✕
          </button>
        </div>

        {/* Character grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {CHARACTERS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setSelectedChar(i)}
              className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-all"
              style={{
                border: selectedChar === i
                  ? '1px solid rgba(192,132,252,0.5)'
                  : '1px solid rgba(255,255,255,0.08)',
                background: selectedChar === i
                  ? 'rgba(192,132,252,0.15)'
                  : 'transparent',
              }}
            >
              <span className="text-[22px] leading-none">{c.emoji}</span>
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: '#e2e2f0' }}>{c.name}</div>
                <div className="text-[10px]" style={{ color: '#6060a0' }}>{c.series}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
          placeholder={`What's on ${CHARACTERS[selectedChar].name}'s mind?`}
          rows={4}
          className="w-full text-sm rounded-xl px-3 py-3 resize-none focus:outline-none mb-3"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#e2e2f0',
          }}
        />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3 text-lg">
            {['🖼️', '📊', '🏷️', '@'].map(tool => (
              <button key={tool} className="opacity-40 hover:opacity-100 transition-opacity">{tool}</button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[12px]" style={{ color: text.length > MAX_CHARS * 0.9 ? '#f87171' : '#5050a0' }}>
              {text.length} / {MAX_CHARS}
            </span>
            <button
              disabled={!text.trim()}
              onClick={handleSubmit}
              className="text-sm font-semibold text-white px-5 py-2 rounded-full transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
            >
              Post ✦
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CHARACTERS };
