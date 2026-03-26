'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/api';

export interface FableVerseChatbot {
  id: string;
  slug: string;
  name: string;
  avatar: string | null;
  description: string;
  tags: string[];
  playsCount: number;
  likesCount: number;
  createdAt: string;
}

const MAX_CHARS = 280;

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
  onPost: (post: Post) => void;
}

export default function ComposeModal({ open, onClose, onPost }: ComposeModalProps) {
  const [selectedChar, setSelectedChar] = useState(0);
  const [text, setText] = useState('');
  const [chatbots, setChatbots] = useState<FableVerseChatbot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Fetch chatbots when modal opens
  useEffect(() => {
    if (!open || chatbots.length > 0) return;
    setLoading(true);
    fetch('/api/chatbots')
      .then(r => r.json())
      .then(data => setChatbots(data.chatbots || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, chatbots.length]);

  if (!open) return null;

  const handleSubmit = () => {
    const bot = chatbots[selectedChar];
    if (!text.trim() || !bot) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      characterId: bot.id,
      character: {
        id: bot.id,
        name: bot.name,
        avatar: bot.avatar || undefined,
        universe: 'FableVerse',
        emoji: '✦',
        subtitle: bot.tags.slice(0, 2).join(' · ') || 'FableVerse Character',
      },
      content: text.trim(),
      tags: bot.tags,
      likeCount: 0,
      isAiGenerated: false,
      publishedAt: new Date().toISOString(),
      _count: { comments: 0, likes: 0 },
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

  const currentName = chatbots[selectedChar]?.name || 'Character';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-[560px] max-w-[95vw] rounded-[18px] p-5"
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

        {/* Chatbot grid */}
        <div className="mb-4 max-h-[220px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(192,132,252,0.3) transparent' }}>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500" />
              <span className="ml-2 text-xs" style={{ color: '#6060a0' }}>Loading chatbots...</span>
            </div>
          ) : chatbots.length === 0 ? (
            <div className="text-center py-8 text-xs" style={{ color: '#6060a0' }}>
              No chatbots found
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {chatbots.map((bot, i) => (
                <button
                  key={bot.id}
                  onClick={() => setSelectedChar(i)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all"
                  style={{
                    border: selectedChar === i
                      ? '1px solid rgba(192,132,252,0.5)'
                      : '1px solid rgba(255,255,255,0.08)',
                    background: selectedChar === i
                      ? 'rgba(192,132,252,0.15)'
                      : 'transparent',
                  }}
                >
                  <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0" style={{ background: '#1a1a2e' }}>
                    {bot.avatar ? (
                      <img src={bot.avatar} alt={bot.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: '#c084fc' }}>
                        ✦
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold truncate" style={{ color: '#e2e2f0' }}>{bot.name}</div>
                    <div className="text-[10px] truncate" style={{ color: '#6060a0' }}>{bot.tags.slice(0, 2).join(' · ')}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
          placeholder={`What's on ${currentName}'s mind?`}
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
              disabled={!text.trim() || chatbots.length === 0}
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
