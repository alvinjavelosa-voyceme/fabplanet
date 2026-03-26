'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { FableVerseChatbot } from './ComposeModal';

// Simple in-memory cache so we don't re-fetch on every hover
const cache: Record<string, FableVerseChatbot> = {};
let allFetched = false;

interface ProfileHoverCardProps {
  characterId: string;
  children: React.ReactNode;
}

export default function ProfileHoverCard({ characterId, children }: ProfileHoverCardProps) {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<FableVerseChatbot | null>(null);
  const [loading, setLoading] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const fetchProfile = useCallback(() => {
    if (cache[characterId]) {
      setData(cache[characterId]);
      return;
    }
    if (allFetched) return;
    setLoading(true);
    fetch('/api/chatbots')
      .then(r => r.json())
      .then(res => {
        const bots: FableVerseChatbot[] = res.chatbots || [];
        bots.forEach(b => { cache[b.id] = b; });
        allFetched = true;
        setData(bots.find(b => b.id === characterId) || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [characterId]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const cardWidth = 280;
    const cardHeight = 320;

    let top = rect.bottom + 8;
    let left = rect.left;

    // If card would go off right edge
    if (left + cardWidth > window.innerWidth - 16) {
      left = window.innerWidth - cardWidth - 16;
    }

    // If card would go off bottom, show above instead
    if (top + cardHeight > window.innerHeight - 16) {
      top = rect.top - cardHeight - 8;
    }

    setPos({ top, left });
  }, []);

  const handleEnter = () => {
    if (leaveRef.current) clearTimeout(leaveRef.current);
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setVisible(true);
      fetchProfile();
    }, 400);
  };

  const handleLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    leaveRef.current = setTimeout(() => setVisible(false), 200);
  };

  const handleCardEnter = () => {
    if (leaveRef.current) clearTimeout(leaveRef.current);
  };

  const handleCardLeave = () => {
    leaveRef.current = setTimeout(() => setVisible(false), 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (leaveRef.current) clearTimeout(leaveRef.current);
    };
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{ display: 'inline-block' }}
      >
        {children}
      </div>

      {visible && typeof document !== 'undefined' && createPortal(
        <div
          onMouseEnter={handleCardEnter}
          onMouseLeave={handleCardLeave}
          className="fixed z-[9999] w-[280px] rounded-2xl p-4"
          style={{
            top: pos.top,
            left: pos.left,
            background: '#16142e',
            border: '1px solid rgba(192,132,252,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
            backdropFilter: 'blur(16px)',
            animation: 'hoverCardIn 0.15s ease-out',
          }}
        >
          {loading && !data ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500" />
            </div>
          ) : data ? (
            <>
              {/* Avatar */}
              <div className="w-full h-[140px] rounded-xl overflow-hidden mb-3"
                style={{ background: '#1a1a2e' }}>
                {data.avatar ? (
                  <img src={data.avatar} alt={data.name} className="w-full h-full object-cover" style={{ objectPosition: 'top' }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl" style={{ color: '#c084fc' }}>✦</span>
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="mb-3">
                <div className="text-sm font-bold" style={{ color: '#e2e2f0' }}>{data.name}</div>
                <div className="text-[11px]" style={{ color: '#6060a0' }}>@{data.slug} · FableVerse</div>
              </div>

              {/* Description */}
              {data.description && (
                <p className="text-[12px] leading-relaxed mb-3" style={{ color: '#9090b8', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {data.description}
                </p>
              )}

              {/* Tags */}
              {data.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {data.tags.slice(0, 4).map(tag => (
                    <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(192,132,252,0.12)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.2)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex gap-4 mb-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-center">
                  <div className="text-sm font-bold" style={{ color: '#e2e2f0' }}>{data.playsCount}</div>
                  <div className="text-[10px]" style={{ color: '#6060a0' }}>Plays</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold" style={{ color: '#e2e2f0' }}>{data.likesCount}</div>
                  <div className="text-[10px]" style={{ color: '#6060a0' }}>Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold" style={{ color: '#e2e2f0' }}>{data.tags.length}</div>
                  <div className="text-[10px]" style={{ color: '#6060a0' }}>Tags</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <a
                  href={`/character/${data.id}`}
                  className="flex-1 text-center text-xs font-semibold py-2 rounded-full text-white transition-opacity hover:opacity-90 no-underline"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
                >
                  View Profile
                </a>
                <a
                  href={`https://develop.voyce.me/fable/${data.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold px-4 py-2 rounded-full transition-colors hover:bg-white/10 no-underline"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e2f0' }}
                >
                  💬
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-3 text-xs" style={{ color: '#6060a0' }}>
              Profile not available
            </div>
          )}

          <style>{`
            @keyframes hoverCardIn {
              from { opacity: 0; transform: translateY(4px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>,
        document.body
      )}
    </>
  );
}
