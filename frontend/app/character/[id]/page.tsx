'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import LeftSidebar from '@/components/layout/LeftSidebar';
import { dummyCharacters, dummyPosts } from '@/lib/dummyData';
import PostCard from '@/components/feed/PostCard';

const UNIVERSE_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  onepiece: { bg: 'rgba(239,68,68,0.2)',  color: '#f87171', border: 'rgba(239,68,68,0.3)' },
  aot:      { bg: 'rgba(34,197,94,0.2)',  color: '#4ade80', border: 'rgba(34,197,94,0.3)' },
  jjk:      { bg: 'rgba(168,85,247,0.2)', color: '#c084fc', border: 'rgba(168,85,247,0.3)' },
  naruto:   { bg: 'rgba(249,115,22,0.2)', color: '#fb923c', border: 'rgba(249,115,22,0.3)' },
  hxh:      { bg: 'rgba(234,179,8,0.2)',  color: '#facc15', border: 'rgba(234,179,8,0.3)' },
};

const PROFILE_TABS = ['Posts', 'Replies', 'Relationships', 'Media'];

export default function CharacterProfilePage() {
  const { id } = useParams<{ id: string }>();
  const character = dummyCharacters[id];
  const [activeTab, setActiveTab] = useState(0);
  const [following, setFollowing] = useState(false);

  const characterPosts = dummyPosts.filter(p => p.characterId === id);

  if (!character) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="fixed inset-0 -z-10" style={{ backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', backgroundAttachment: 'fixed' }} />
        <div className="fixed inset-0 -z-10" style={{ background: 'rgba(8,7,18,0.92)' }} />
        <div style={{ color: '#9090b8' }}>Character not found.</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Fixed bg */}
      <div className="fixed inset-0 -z-10" style={{ backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }} />
      <div className="fixed inset-0 -z-10" style={{ background: 'rgba(8,7,18,0.92)' }} />

      <div className="max-w-[1200px] mx-auto px-4"
        style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px' }}>

        {/* Left sidebar */}
        <LeftSidebar />

        {/* Profile main */}
        <main style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.06)', minHeight: '100vh' }}>

          {/* Back bar */}
          <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 text-sm font-semibold cursor-pointer transition-colors hover:text-purple-400"
            style={{ background: 'rgba(8,7,18,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#9090b8' }}
            onClick={() => history.back()}>
            ← Back
          </div>

          {/* Banner */}
          <div className="relative h-[140px] overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1a0533, #0a1a3a, #1a0533)' }}>
            <div className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(239,68,68,0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 40%, rgba(168,85,247,0.2) 0%, transparent 60%)' }} />
          </div>

          {/* Info section */}
          <div className="px-5 pb-5 relative">
            {/* Avatar + actions row */}
            <div className="flex items-end justify-between mb-3" style={{ marginTop: '-36px' }}>
              <div className="relative">
                <div className="w-[72px] h-[72px] rounded-full overflow-hidden flex items-center justify-center text-[36px]"
                  style={{ background: '#1a1a2e', border: '3px solid #0d0d14', boxShadow: '0 0 0 2px rgba(239,68,68,0.5)' }}>
                  {character.avatar
                    ? <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
                    : character.emoji}
                </div>
                <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full"
                  style={{ background: '#4ade80', border: '2px solid #0d0d14' }} />
              </div>
              <div className="flex gap-2 pb-1">
                <button
                  onClick={() => setFollowing(f => !f)}
                  className="text-sm font-semibold px-5 py-2 rounded-full text-white transition-opacity hover:opacity-90"
                  style={{ background: following ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #7c3aed, #a855f7)', border: following ? '1px solid rgba(255,255,255,0.15)' : 'none', color: following ? '#9090b8' : 'white' }}>
                  {following ? 'Following ✓' : 'Follow'}
                </button>
                <button className="text-sm font-semibold px-4 py-2 rounded-full transition-colors hover:bg-white/10"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e2f0' }}>
                  💬 Message
                </button>
              </div>
            </div>

            {/* Name & handle */}
            <div className="text-[20px] font-bold mb-0.5" style={{ color: '#e2e2f0' }}>{character.name}</div>
            <div className="text-[13px] mb-3" style={{ color: '#6060a0' }}>{character.handle}</div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {character.badges.map(b => (
                <span key={b.label} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: b.style.bg, color: b.style.color, border: `1px solid ${b.style.border}` }}>
                  {b.label}
                </span>
              ))}
            </div>

            {/* Bio */}
            <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#a0a0c8' }}>{character.bio}</p>

            {/* Stats */}
            <div className="flex gap-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {character.stats.map(s => (
                <div key={s.label} className="text-center cursor-pointer group">
                  <div className="text-[18px] font-bold group-hover:text-purple-400 transition-colors" style={{ color: '#e2e2f0' }}>{s.value}</div>
                  <div className="text-[11px]" style={{ color: '#6060a0' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Power stats */}
          <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-[11px] font-bold mb-3 tracking-wider uppercase" style={{ color: '#c084fc' }}>⚡ Character Stats</div>
            {character.powerStats.map(s => (
              <div key={s.name} className="flex items-center gap-3 mb-2">
                <span className="text-[12px] w-[80px] flex-shrink-0" style={{ color: '#9090b8' }}>{s.name}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.value}%`, background: s.gradient }} />
                </div>
                <span className="text-[11px] w-7 text-right" style={{ color: '#9090b8' }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Profile tabs */}
          <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {PROFILE_TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className="flex-1 text-center py-3 text-[13px] font-medium transition-colors"
                style={{
                  color: activeTab === i ? '#c084fc' : '#6060a0',
                  borderBottom: activeTab === i ? '2px solid #c084fc' : '2px solid transparent',
                  marginBottom: '-1px',
                }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="px-4 py-4">
            {activeTab === 0 && (
              <div className="space-y-4">
                {characterPosts.length > 0
                  ? characterPosts.map(p => <PostCard key={p.id} post={p} />)
                  : <p className="text-sm text-center py-8" style={{ color: '#6060a0' }}>No posts yet.</p>}
              </div>
            )}

            {activeTab === 2 && (
              <div>
                <div className="text-[11px] font-bold mb-3 tracking-wider uppercase" style={{ color: '#c084fc' }}>🔗 Character Relationships</div>
                {character.relationships.map(rel => {
                  const uStyle = UNIVERSE_STYLES[rel.universeBadgeClass] || UNIVERSE_STYLES.jjk;
                  return (
                    <div key={rel.name} className="flex items-center gap-3 py-2.5"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: '#1a1a2e' }}>{rel.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold" style={{ color: '#e2e2f0' }}>{rel.name}</div>
                        <div className="text-[11px]" style={{ color: rel.typeColor }}>{rel.type}</div>
                      </div>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: uStyle.bg, color: uStyle.color, border: `1px solid ${uStyle.border}` }}>
                        {rel.universe}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {(activeTab === 1 || activeTab === 3) && (
              <p className="text-sm text-center py-8" style={{ color: '#6060a0' }}>Coming soon.</p>
            )}
          </div>
        </main>

        {/* Right sidebar — lore card */}
        <div className="py-6 px-4 flex flex-col gap-4" style={{ position: 'sticky', top: 0, maxHeight: '100vh', overflowY: 'auto' }}>
          {/* Lore card */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-xs font-bold mb-3 tracking-wider uppercase" style={{ color: '#c084fc' }}>📖 Lore Card</div>
            <div className="flex flex-col gap-2">
              {character.loreCard.map(item => (
                <div key={item.label}>
                  <span className="text-[11px]" style={{ color: '#6060a0' }}>{item.label}: </span>
                  <span className="text-[12px]" style={{ color: '#9090b8' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Also in CharVerse */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-xs font-bold mb-3 tracking-wider uppercase" style={{ color: '#c084fc' }}>🔗 Also in CharVerse</div>
            <div className="flex flex-col gap-3">
              {character.crewMembers.map(m => (
                <div key={m.name} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: '#1a1a2e' }}>{m.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate" style={{ color: '#e2e2f0' }}>{m.name}</div>
                    <div className="text-[11px]" style={{ color: '#6060a0' }}>{m.universe}</div>
                  </div>
                  <button className="text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(192,132,252,0.15)', border: '1px solid rgba(192,132,252,0.3)', color: '#c084fc' }}>
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
