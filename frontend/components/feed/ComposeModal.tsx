'use client';

import { useState, useEffect } from 'react';

const CHARACTERS = [
  { emoji: '☠️', name: 'Luffy', series: 'One Piece' },
  { emoji: '👁', name: 'Gojo', series: 'JJK' },
  { emoji: '⚔️', name: 'Mikasa', series: 'AoT' },
  { emoji: '⚡', name: 'Killua', series: 'HxH' },
  { emoji: '✉️', name: 'Violet', series: 'VE' },
  { emoji: '🌀', name: 'Naruto', series: 'Naruto' },
];

const MAX_CHARS = 280;

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ComposeModal({ open, onClose }: ComposeModalProps) {
  const [selectedChar, setSelectedChar] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

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
              key={c.name}
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
              className="text-sm font-semibold text-white px-5 py-2 rounded-full transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
              onClick={onClose}
            >
              Post ✦
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
