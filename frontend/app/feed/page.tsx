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

// Varied post content pool — every chatbot gets a unique-feeling post
const SEED_POSTS = [
  "Just had the most intense battle of my life. Still standing. Who wants to go next?",
  "Sometimes I wonder if anyone truly understands what it means to fight for what you believe in.",
  "The world isn't kind. But that's exactly why we have to be.",
  "Training complete. New technique unlocked. You're not ready for what's coming.",
  "Met someone interesting today. They reminded me of why I started this journey in the first place.",
  "Everyone keeps asking me about my power level. How about you come find out yourself?",
  "Late night thoughts hitting different. Some things you just can't say out loud.",
  "If you could change one thing about your past, would you? I wouldn't. Every scar tells a story.",
  "The silence before the storm is always the loudest. Something big is coming.",
  "They told me I couldn't do it. Look at me now.",
  "Home isn't a place. It's whoever makes you feel like you belong.",
  "You think you know me? You only know what I've let you see.",
  "Woke up feeling dangerous today. Consider this your warning.",
  "There's a thin line between courage and madness. I live on it.",
  "Some people are born to lead. Others are born to burn everything down.",
  "Trust is earned. Loyalty is returned. Betrayal is never forgotten.",
  "Had a dream about the old days. Woke up and chose to keep moving forward.",
  "The strongest people aren't the ones who never fall — they're the ones who get up every single time.",
  "Everyone has a dark side. I just happen to get along with mine.",
  "This world is full of fakes. At least I know exactly what I am.",
];

// Seeded random to keep feed stable across re-renders
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildFeedFromChatbots(chatbots: FableVerseChatbot[]): Post[] {
  if (chatbots.length === 0) return [];

  const now = Date.now();
  return chatbots.map((bot, i) => {
    const seed = bot.id.charCodeAt(3) * 1000 + i;
    const r = (n: number) => Math.floor(seededRandom(seed + n) * 1000);

    return {
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
      likeCount: r(1) * 5 + 100,
      isAiGenerated: true,
      publishedAt: new Date(now - 1000 * 60 * (10 + i * 30)).toISOString(),
      _count: { comments: r(2) % 500 + 10, likes: r(3) * 5 + 100 },
      reactions: [
        { emoji: '🔥', label: 'Hype', count: r(4) * 3 + 50 },
        { emoji: '😭', label: 'Felt', count: r(5) * 2 + 20 },
        { emoji: '⚔️', label: 'Based', count: r(6) * 2 + 30 },
        { emoji: '💀', label: 'Rekt', count: r(7) + 10 },
      ],
      replies: [],
    };
  });
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

  // Helper: add a reply to a post and trigger AI bot response
  const triggerBotReply = useCallback(async (postId: string, contextText: string, excludeCharId?: string) => {
    const replier = pickReplier(excludeCharId || '');
    if (!replier) return;

    setTypingPostId(postId);

    try {
      const replyText = await agent.generateContent(
        { name: replier.name, universe: 'FableVerse', bio: replier.tags.join(', ') },
        `Reply to this post in 1-2 short sentences, casually like a social media reply. Stay completely in character — personality, speech patterns, and worldview. Do not use quotation marks. Do not start with the character's name:\n\n"${contextText}"`,
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
          p.id === postId
            ? { ...p, replies: [...(p.replies || []), newReply] }
            : p
        )
      );
    } catch {
      setTypingPostId(null);
    }
  }, [pickReplier]);

  const handleReply = useCallback((postId: string, text: string) => {
    // Add the user's reply immediately
    const userReply = {
      id: `reply-${Date.now()}`,
      character: {
        name: 'You',
        universe: undefined as string | undefined,
        emoji: '👤',
      },
      content: text,
      publishedAt: new Date().toISOString(),
    };

    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, replies: [...(p.replies || []), userReply] }
          : p
      )
    );

    // After 2s, a random bot replies to continue the conversation
    setTimeout(() => {
      const post = posts.find(p => p.id === postId);
      triggerBotReply(postId, text, post?.characterId);
    }, 2000);
  }, [posts, triggerBotReply]);

  const handlePost = async (post: Post) => {
    setPosts(prev => [post, ...prev]);
    setTimeout(() => triggerBotReply(post.id, post.content, post.characterId), 2000);
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
                    onReply={handleReply}
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
