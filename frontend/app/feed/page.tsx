'use client';

import { useEffect, useState, useCallback } from 'react';
import { Post, agent } from '@/lib/api';
import PostCard from '@/components/feed/PostCard';
import StoriesBar from '@/components/feed/StoriesBar';
import ComposeBox from '@/components/feed/ComposeBox';
import ComposeModal from '@/components/feed/ComposeModal';
import type { FableVerseChatbot } from '@/components/feed/ComposeModal';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';

const TABS = ['For You', 'Following', 'Universes', 'Trending ⚡'];

// Sample post content to seed the feed from chatbots
const SEED_POSTS = [
  "Just had the most intense battle of my life. Still standing. Who wants to go next?",
  "Sometimes I wonder if anyone truly understands what it means to fight for what you believe in.",
  "The world isn't kind. But that's exactly why we have to be.",
  "Training complete. New technique unlocked. You're not ready for what's coming.",
  "Met someone interesting today. They reminded me of why I started this journey in the first place.",
  "Everyone keeps asking me about my power level. How about you come find out yourself?",
];

function buildFeedFromChatbots(chatbots: FableVerseChatbot[]): Post[] {
  if (chatbots.length === 0) return [];

  const now = Date.now();
  return chatbots.slice(0, 6).map((bot, i) => ({
    id: `seed-${bot.id}`,
    characterId: bot.id,
    character: {
      id: bot.id,
      name: bot.name,
      avatar: bot.avatar || undefined,
      universe: 'FableVerse',
      emoji: '✦',
      subtitle: bot.tags.slice(0, 2).join(' · ') || 'FableVerse Character',
    },
    content: SEED_POSTS[i % SEED_POSTS.length],
    tags: bot.tags,
    likeCount: Math.floor(Math.random() * 5000) + 100,
    isAiGenerated: true,
    publishedAt: new Date(now - 1000 * 60 * (15 + i * 45)).toISOString(),
    _count: { comments: Math.floor(Math.random() * 300), likes: Math.floor(Math.random() * 5000) + 100 },
    reactions: [
      { emoji: '🔥', label: 'Hype', count: Math.floor(Math.random() * 2000) + 50 },
      { emoji: '😭', label: 'Felt', count: Math.floor(Math.random() * 800) + 20 },
      { emoji: '⚔️', label: 'Based', count: Math.floor(Math.random() * 1000) + 30 },
      { emoji: '💀', label: 'Rekt', count: Math.floor(Math.random() * 200) + 10 },
    ],
    replies: [],
  }));
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [typingPostId, setTypingPostId] = useState<string | null>(null);
  const [chatbots, setChatbots] = useState<FableVerseChatbot[]>([]);

  // Fetch chatbots and build feed
  useEffect(() => {
    fetch('/api/chatbots')
      .then(r => r.json())
      .then(data => {
        const bots = data.chatbots || [];
        setChatbots(bots);
        setPosts(buildFeedFromChatbots(bots));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pickReplier = useCallback((excludeCharId: string) => {
    const options = chatbots.filter(c => c.id !== excludeCharId);
    if (options.length === 0) return null;
    return options[Math.floor(Math.random() * options.length)];
  }, [chatbots]);

  const handlePost = async (post: Post) => {
    setPosts(prev => [post, ...prev]);

    const replier = pickReplier(post.characterId);
    if (!replier) return;

    setTimeout(async () => {
      setTypingPostId(post.id);

      try {
        const replyText = await agent.generateContent(
          { name: replier.name, universe: 'FableVerse', bio: replier.tags.join(', ') },
          `Reply to this post in 1-2 short sentences, casually like a social media reply. Stay completely in character — personality, speech patterns, and worldview. Do not use quotation marks. Do not start with the character's name:\n\n"${post.content}"`,
          'reply',
          () => {}
        );

        setTypingPostId(null);

        const newReply = {
          id: `reply-${Date.now()}`,
          character: {
            name: replier.name,
            universe: 'FableVerse',
            emoji: '✦',
          },
          content: replyText.trim(),
          publishedAt: new Date().toISOString(),
        };

        setPosts(prev =>
          prev.map(p =>
            p.id === post.id
              ? { ...p, replies: [newReply, ...(p.replies || [])] }
              : p
          )
        );
      } catch {
        setTypingPostId(null);
      }
    }, 2000);
  };

  return (
    <div className="relative min-h-screen">
      <ComposeModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onPost={handlePost}
      />
      {/* Fixed bg */}
      <div className="fixed inset-0 -z-10"
        style={{
          backgroundImage: 'url(/bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="fixed inset-0 -z-10" style={{ background: 'rgba(8,7,18,0.88)' }} />

      {/* 3-column layout */}
      <div className="max-w-[1200px] mx-auto px-4"
        style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', gap: 0 }}>

        {/* Left sidebar */}
        <LeftSidebar onCompose={() => setComposeOpen(true)} />

        {/* Main feed */}
        <main style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.06)', minHeight: '100vh' }}>

          {/* Sticky header */}
          <div className="sticky top-0 z-10 px-4 pt-4"
            style={{ background: 'rgba(8,7,18,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex gap-1 pb-3">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className="flex-1 text-center py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{
                    color: activeTab === i ? '#c084fc' : '#9090b8',
                    background: activeTab === i ? 'rgba(192,132,252,0.12)' : 'transparent',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4">
            {/* Compose box */}
            <ComposeBox onOpen={() => setComposeOpen(true)} />

            {/* Stories */}
            <StoriesBar />

            {/* Posts */}
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 text-sm" style={{ color: '#6060a0' }}>
                No posts yet. Create one!
              </div>
            ) : (
              <div className="py-4 space-y-4 pb-12">
                {posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    isTyping={typingPostId === post.id}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
