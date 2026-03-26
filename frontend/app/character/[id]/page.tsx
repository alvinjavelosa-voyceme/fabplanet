'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LeftSidebar from '@/components/layout/LeftSidebar';
import type { FableVerseChatbot } from '@/components/feed/ComposeModal';

const PROFILE_TABS = ['About', 'Tags', 'Activity'];

export default function CharacterProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<FableVerseChatbot | null>(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetch('/api/chatbots')
      .then(r => r.json())
      .then(data => {
        const bots: FableVerseChatbot[] = data.chatbots || [];
        const found = bots.find(b => b.id === id);
        setCharacter(found || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="fixed inset-0 -z-10" style={{ backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', backgroundAttachment: 'fixed' }} />
        <div className="fixed inset-0 -z-10" style={{ background: 'rgba(8,7,18,0.92)' }} />
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

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
      <div className="fixed inset-0 -z-10" style={{ backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }} />
      <div className="fixed inset-0 -z-10" style={{ background: 'rgba(8,7,18,0.92)' }} />

      <div className="max-w-[1200px] mx-auto px-4"
        style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px' }}>

        <LeftSidebar />

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
              style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(192,132,252,0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 40%, rgba(168,85,247,0.2) 0%, transparent 60%)' }} />
          </div>

          {/* Info section */}
          <div className="px-5 pb-5 relative">
            {/* Avatar + actions */}
            <div className="flex items-end justify-between mb-3" style={{ marginTop: '-36px' }}>
              <div className="relative">
                <div className="w-[72px] h-[72px] rounded-full overflow-hidden flex items-center justify-center"
                  style={{ background: '#1a1a2e', border: '3px solid #0d0d14', boxShadow: '0 0 0 2px rgba(192,132,252,0.5)' }}>
                  {character.avatar ? (
                    <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl" style={{ color: '#c084fc' }}>✦</span>
                  )}
                </div>
                <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full"
                  style={{ background: '#4ade80', border: '2px solid #0d0d14' }} />
              </div>
              <div className="flex gap-2 pb-1">
                <button
                  onClick={() => setFollowing(f => !f)}
                  className="text-sm font-semibold px-5 py-2 rounded-full text-white transition-opacity hover:opacity-90"
                  style={{
                    background: following ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                    border: following ? '1px solid rgba(255,255,255,0.15)' : 'none',
                    color: following ? '#9090b8' : 'white',
                  }}>
                  {following ? 'Following ✓' : 'Follow'}
                </button>
                <a
                  href={`https://develop.voyce.me/fable/${character.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold px-4 py-2 rounded-full transition-colors hover:bg-white/10 no-underline"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e2f0' }}>
                  💬 Message
                </a>
              </div>
            </div>

            {/* Name */}
            <div className="text-[20px] font-bold mb-0.5" style={{ color: '#e2e2f0' }}>{character.name}</div>
            <div className="text-[13px] mb-3" style={{ color: '#6060a0' }}>@{character.slug} · FableVerse</div>

            {/* Tags as badges */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {character.tags.map(tag => (
                <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(192,132,252,0.15)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.3)' }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Description / Bio */}
            {character.description && (
              <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#a0a0c8' }}>
                {character.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex gap-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-center cursor-pointer group">
                <div className="text-[18px] font-bold group-hover:text-purple-400 transition-colors" style={{ color: '#e2e2f0' }}>
                  {character.playsCount}
                </div>
                <div className="text-[11px]" style={{ color: '#6060a0' }}>Plays</div>
              </div>
              <div className="text-center cursor-pointer group">
                <div className="text-[18px] font-bold group-hover:text-purple-400 transition-colors" style={{ color: '#e2e2f0' }}>
                  {character.likesCount}
                </div>
                <div className="text-[11px]" style={{ color: '#6060a0' }}>Likes</div>
              </div>
              <div className="text-center cursor-pointer group">
                <div className="text-[18px] font-bold group-hover:text-purple-400 transition-colors" style={{ color: '#e2e2f0' }}>
                  {character.tags.length}
                </div>
                <div className="text-[11px]" style={{ color: '#6060a0' }}>Tags</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
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
          <div className="px-5 py-4">
            {activeTab === 0 && (
              <div>
                <div className="text-[11px] font-bold mb-3 tracking-wider uppercase" style={{ color: '#c084fc' }}>✦ Character Info</div>
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="text-[11px]" style={{ color: '#6060a0' }}>Name: </span>
                    <span className="text-[12px]" style={{ color: '#9090b8' }}>{character.name}</span>
                  </div>
                  <div>
                    <span className="text-[11px]" style={{ color: '#6060a0' }}>Slug: </span>
                    <span className="text-[12px]" style={{ color: '#9090b8' }}>{character.slug}</span>
                  </div>
                  <div>
                    <span className="text-[11px]" style={{ color: '#6060a0' }}>Universe: </span>
                    <span className="text-[12px]" style={{ color: '#9090b8' }}>FableVerse</span>
                  </div>
                  <div>
                    <span className="text-[11px]" style={{ color: '#6060a0' }}>Plays: </span>
                    <span className="text-[12px]" style={{ color: '#9090b8' }}>{character.playsCount}</span>
                  </div>
                  <div>
                    <span className="text-[11px]" style={{ color: '#6060a0' }}>Likes: </span>
                    <span className="text-[12px]" style={{ color: '#9090b8' }}>{character.likesCount}</span>
                  </div>
                  {character.createdAt && (
                    <div>
                      <span className="text-[11px]" style={{ color: '#6060a0' }}>Created: </span>
                      <span className="text-[12px]" style={{ color: '#9090b8' }}>
                        {new Date(character.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div>
                <div className="text-[11px] font-bold mb-3 tracking-wider uppercase" style={{ color: '#c084fc' }}>🏷️ Tags</div>
                <div className="flex flex-wrap gap-2">
                  {character.tags.map(tag => (
                    <span key={tag} className="text-[12px] font-medium px-3 py-1.5 rounded-xl"
                      style={{ background: 'rgba(192,132,252,0.1)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.25)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <p className="text-sm text-center py-8" style={{ color: '#6060a0' }}>Coming soon.</p>
            )}
          </div>
        </main>

        {/* Right sidebar */}
        <div className="py-6 px-4 flex flex-col gap-4" style={{ position: 'sticky', top: 0, maxHeight: '100vh', overflowY: 'auto' }}>
          {/* Description card */}
          {character.description && (
            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-xs font-bold mb-3 tracking-wider uppercase" style={{ color: '#c084fc' }}>📖 About</div>
              <p className="text-[12px] leading-relaxed" style={{ color: '#9090b8' }}>{character.description}</p>
            </div>
          )}

          {/* Tags card */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-xs font-bold mb-3 tracking-wider uppercase" style={{ color: '#c084fc' }}>🏷️ Tags</div>
            <div className="flex flex-wrap gap-1.5">
              {character.tags.map(tag => (
                <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(192,132,252,0.1)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.25)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
