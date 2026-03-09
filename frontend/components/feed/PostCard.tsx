'use client';

import { useState } from 'react';
import { Post } from '@/lib/api';

interface PostCardProps {
  post: Post;
  isTyping?: boolean;
}

const UNIVERSE_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  'One Piece':        { bg: 'rgba(239,68,68,0.2)',   color: '#f87171', border: 'rgba(239,68,68,0.3)' },
  'Attack on Titan':  { bg: 'rgba(34,197,94,0.2)',   color: '#4ade80', border: 'rgba(34,197,94,0.3)' },
  'Jujutsu Kaisen':   { bg: 'rgba(168,85,247,0.2)',  color: '#c084fc', border: 'rgba(168,85,247,0.3)' },
  'Violet Evergarden':{ bg: 'rgba(14,165,233,0.2)',  color: '#38bdf8', border: 'rgba(14,165,233,0.3)' },
  'Naruto':           { bg: 'rgba(249,115,22,0.2)',  color: '#fb923c', border: 'rgba(249,115,22,0.3)' },
  'Hunter x Hunter':  { bg: 'rgba(234,179,8,0.2)',   color: '#facc15', border: 'rgba(234,179,8,0.3)' },
};

const DEFAULT_UNIVERSE_STYLE = { bg: 'rgba(139,92,246,0.2)', color: '#c084fc', border: 'rgba(139,92,246,0.3)' };

function getUniverseStyle(universe?: string) {
  return (universe && UNIVERSE_STYLES[universe]) || DEFAULT_UNIVERSE_STYLE;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function PostCard({ post, isTyping }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [activeReactions, setActiveReactions] = useState<Set<string>>(new Set());
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>(
    Object.fromEntries((post.reactions || []).map(r => [r.label, r.count]))
  );

  const toggleReaction = (label: string) => {
    setActiveReactions(prev => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
        setReactionCounts(c => ({ ...c, [label]: (c[label] ?? 0) - 1 }));
      } else {
        next.add(label);
        setReactionCounts(c => ({ ...c, [label]: (c[label] ?? 0) + 1 }));
      }
      return next;
    });
  };

  const universeStyle = getUniverseStyle(post.character.universe);

  const handleLike = () => {
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleComment = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComment('');
    setShowComments(false);
  };

  const visibleReplies = post.replies
    ? showAllReplies ? post.replies : post.replies.slice(0, 2)
    : [];
  const hiddenCount = post.replies ? post.replies.length - 2 : 0;

  return (
    <div
      className="relative rounded-2xl p-px overflow-hidden hover:scale-[1.002] transition-transform duration-200"
      style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.35) 0%, rgba(30,27,75,0.15) 50%, rgba(139,92,246,0.12) 100%)' }}
    >
      <div
        className="rounded-2xl p-4"
        style={{ background: 'rgba(13,11,28,0.82)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <a href={`/character/${post.character.id}`} className="flex-shrink-0 mt-0.5">
            <div
              className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center"
              style={{ boxShadow: `0 0 0 2px ${universeStyle.border}, 0 0 10px rgba(139,92,246,0.2)` }}
            >
              {post.character.avatar ? (
                <img src={post.character.avatar} alt={post.character.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold">{post.character.name[0]}</span>
                </div>
              )}
            </div>
          </a>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={`/character/${post.character.id}`}
                className="font-bold text-[15px] leading-tight hover:text-purple-400 transition-colors"
                style={{ color: '#e2e2f0' }}
              >
                {post.character.name}
              </a>
              {post.character.universe && (
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: universeStyle.bg, color: universeStyle.color, border: `1px solid ${universeStyle.border}` }}
                >
                  {post.character.universe}
                </span>
              )}
              {post.arc && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}
                >
                  {post.arc}
                </span>
              )}
              {post.isAiGenerated && (
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(168,85,247,0.2)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)' }}
                >
                  AI
                </span>
              )}
            </div>
            {post.character.subtitle && (
              <div className="text-[12px] mt-0.5 truncate" style={{ color: '#6060a0' }}>
                {post.character.subtitle}
              </div>
            )}
          </div>

          <span className="text-[12px] flex-shrink-0" style={{ color: '#5050a0' }}>
            {timeAgo(post.publishedAt)}
          </span>
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed mb-3" style={{ color: '#c8c8e8' }}>
          {post.content}
        </p>

        {/* Poll */}
        {post.poll && (
          <div
            className="rounded-xl p-3 mb-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {post.poll.options.map(opt => {
              const pct = Math.round((opt.votes / post.poll!.options.reduce((s, o) => s + o.votes, 0)) * 100);
              return (
                <div key={opt.label} className="mb-2 last:mb-0 cursor-pointer">
                  <div className="relative h-8 rounded-md overflow-hidden flex items-center px-3"
                    style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="absolute left-0 top-0 bottom-0 rounded-md"
                      style={{ width: `${pct}%`, background: opt.color, opacity: 0.25 }}
                    />
                    <span className="relative text-[13px] font-medium flex-1" style={{ color: '#e2e2f0' }}>{opt.label}</span>
                    <span className="relative text-[12px]" style={{ color: '#9090b8' }}>{pct}%</span>
                  </div>
                </div>
              );
            })}
            <div className="text-[11px] mt-2" style={{ color: '#6060a0' }}>
              {formatCount(post.poll.totalVotes)} votes · {post.poll.hoursLeft}h left
            </div>
          </div>
        )}

        {/* Quote post */}
        {post.quotedPost && (
          <div
            className="rounded-xl p-3 mb-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="text-[12px] font-semibold mb-1" style={{ color: '#9090b8' }}>
              {post.quotedPost.authorName} · <span style={{ color: '#6060a0' }}>{timeAgo(post.quotedPost.publishedAt)}</span>
            </div>
            <div className="text-[13px] leading-relaxed" style={{ color: '#8080a8' }}>
              {post.quotedPost.content}
            </div>
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="text-[12px] font-medium cursor-pointer hover:text-purple-300 transition-colors"
                style={{ color: '#8b5cf6' }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Emoji reactions */}
        {post.reactions && post.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.reactions.map(r => {
              const active = activeReactions.has(r.label);
              const count = reactionCounts[r.label] ?? r.count;
              return (
                <button
                  key={r.label}
                  onClick={() => toggleReaction(r.label)}
                  className="flex items-center gap-1 text-[12px] rounded-full px-2.5 py-1 transition-all"
                  style={{
                    background: active ? 'rgba(192,132,252,0.2)' : 'rgba(255,255,255,0.05)',
                    border: active ? '1px solid rgba(192,132,252,0.5)' : '1px solid rgba(255,255,255,0.1)',
                    color: active ? '#e2e2f0' : '#9090b8',
                  }}
                >
                  <span>{r.emoji}</span>
                  <span>{r.label}</span>
                  <span style={{ color: active ? '#c084fc' : '#6060a0' }}>{formatCount(count)}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-5 pt-2.5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-[13px] font-medium transition-colors"
            style={{ color: liked ? '#f472b6' : '#6060a0' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}
              className="w-[16px] h-[16px]">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            {formatCount(likeCount)}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-[13px] font-medium transition-colors hover:text-purple-400"
            style={{ color: '#6060a0' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth={2}
              className="w-[16px] h-[16px]">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
            </svg>
            {formatCount(post._count?.comments || 0)}
          </button>

          <button
            className="flex items-center gap-1.5 text-[13px] font-medium transition-colors hover:text-green-400"
            style={{ color: '#6060a0' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth={2}
              className="w-[16px] h-[16px]">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
            </svg>
            Repost
          </button>

          <button
            className="flex items-center gap-1.5 text-[13px] font-medium transition-colors hover:text-blue-400 ml-auto"
            style={{ color: '#6060a0' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth={2}
              className="w-[16px] h-[16px]">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            Share
          </button>
        </div>

        {/* Replies + typing indicator */}
        {(visibleReplies.length > 0 || isTyping) && (
          <div
            className="mt-3 ml-[54px] pl-3.5"
            style={{ borderLeft: '2px solid rgba(255,255,255,0.07)' }}
          >
            {visibleReplies.map((reply, i) => {
              const replyStyle = getUniverseStyle(reply.character.universe);
              return (
                <div key={reply.id}
                  className="py-2.5"
                  style={{ borderBottom: (i < visibleReplies.length - 1 || isTyping) ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: '#1a1a2e' }}>
                      {reply.character.emoji}
                    </div>
                    <span className="text-[13px] font-semibold" style={{ color: '#e2e2f0' }}>{reply.character.name}</span>
                    {reply.character.universe && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ background: replyStyle.bg, color: replyStyle.color, border: `1px solid ${replyStyle.border}` }}>
                        {reply.character.universe}
                      </span>
                    )}
                    {reply.relTag && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(236,72,153,0.15)', color: '#f472b6', border: '1px solid rgba(236,72,153,0.3)' }}>
                        {reply.relTag}
                      </span>
                    )}
                    <span className="text-[11px] ml-auto" style={{ color: '#5050a0' }}>{timeAgo(reply.publishedAt)}</span>
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: '#a0a0c8' }}>{reply.content}</p>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="py-2.5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: '#1a1a2e' }}>
                  ✦
                </div>
                <div className="flex gap-1 items-center">
                  <span className="text-[12px]" style={{ color: '#6060a0' }}>A character is typing</span>
                  <span className="flex gap-0.5 ml-1">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-1 h-1 rounded-full"
                        style={{
                          background: '#c084fc',
                          animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}

            {!showAllReplies && hiddenCount > 0 && !isTyping && (
              <button
                onClick={() => setShowAllReplies(true)}
                className="text-[12px] mt-2 hover:text-purple-300 transition-colors"
                style={{ color: '#8b5cf6' }}
              >
                View {hiddenCount} more {hiddenCount === 1 ? 'reply' : 'replies'} →
              </button>
            )}
          </div>
        )}

        {/* Comment box */}
        {showComments && (
          <form onSubmit={handleComment} className="mt-3 flex gap-2">
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={`Reply to ${post.character.name}...`}
              className="flex-1 text-sm rounded-full px-4 py-2 focus:outline-none transition-colors"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(139,92,246,0.3)',
                color: '#e2ddf5',
              }}
            />
            <button
              type="submit"
              className="px-4 py-2 text-white text-sm rounded-full font-medium transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
            >
              Post
            </button>
          </form>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
