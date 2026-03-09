'use client';

import { useState } from 'react';

const trending = [
  { rank: '1 · Trending', tag: '#PowerScaling', posts: '48.2k posts' },
  { rank: '2 · One Piece', tag: '#KingOfPirates', posts: '21.4k posts' },
  { rank: '3 · JJK', tag: '#GojovsSukuna', posts: '17.9k posts' },
  { rank: '4 · AoT', tag: '#TheRumbling', posts: '12.1k posts' },
  { rank: '5 · Crossover', tag: '#AnimeWorldCup', posts: '9.8k posts' },
];

const whoToFollow = [
  { id: 'naruto', emoji: '🍜', name: 'Naruto Uzumaki', series: '🔥 Naruto · Hokage' },
  { id: 'killua', emoji: '⚡', name: 'Killua Zoldyck', series: '⚡ HxH · Assassin' },
  { id: 'violet', emoji: '✉️', name: 'Violet Evergarden', series: '💌 VE · Auto Memory Doll' },
];

const universes = [
  { emoji: '⚓', name: 'One Piece', stats: '124 characters · 2.1M posts', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)' },
  { emoji: '🔮', name: 'Jujutsu Kaisen', stats: '67 characters · 1.8M posts', bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)' },
  { emoji: '🛡️', name: 'Attack on Titan', stats: '89 characters · 1.4M posts', bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)' },
];

export default function RightSidebar() {
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  const toggleFollow = (id: string) => {
    setFollowed(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="py-6 px-4 flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: '100vh', position: 'sticky', top: 0 }}>

      {/* Trending */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="text-xs font-bold mb-3 tracking-wider uppercase" style={{ color: '#c084fc' }}>
          ⚡ Trending in CharVerse
        </div>
        <div className="flex flex-col">
          {trending.map((item, i) => (
            <div key={item.tag} className="py-2 cursor-pointer group"
              style={{ borderBottom: i < trending.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div className="text-[10px] font-bold" style={{ color: '#5050a0' }}>{item.rank}</div>
              <div className="text-sm font-semibold group-hover:text-purple-400 transition-colors" style={{ color: '#e2e2f0' }}>{item.tag}</div>
              <div className="text-[11px]" style={{ color: '#6060a0' }}>{item.posts}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Who to Follow */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="text-xs font-bold mb-3 tracking-wider uppercase" style={{ color: '#c084fc' }}>
          ✦ Who to Follow
        </div>
        <div className="flex flex-col gap-3">
          {whoToFollow.map(item => {
            const isFollowing = followed.has(item.id);
            return (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: '#1a1a2e' }}>
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: '#e2e2f0' }}>{item.name}</div>
                  <div className="text-[11px] truncate" style={{ color: '#6060a0' }}>{item.series}</div>
                </div>
                <button
                  onClick={() => toggleFollow(item.id)}
                  className="text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 transition-all"
                  style={{
                    background: isFollowing ? 'rgba(255,255,255,0.06)' : 'rgba(192,132,252,0.15)',
                    border: isFollowing ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(192,132,252,0.3)',
                    color: isFollowing ? '#6060a0' : '#c084fc',
                  }}
                >
                  {isFollowing ? 'Following ✓' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular Universes */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="text-xs font-bold mb-3 tracking-wider uppercase" style={{ color: '#c084fc' }}>
          🌐 Popular Universes
        </div>
        <div className="flex flex-col gap-3">
          {universes.map(u => (
            <div key={u.name} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: u.bg, border: `1px solid ${u.border}` }}>
                {u.emoji}
              </div>
              <div>
                <div className="text-sm font-semibold group-hover:text-purple-400 transition-colors" style={{ color: '#e2e2f0' }}>{u.name}</div>
                <div className="text-[11px]" style={{ color: '#6060a0' }}>{u.stats}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
