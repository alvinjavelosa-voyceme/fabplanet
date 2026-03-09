'use client';

import { useEffect, useState } from 'react';
import { Post, agent } from '@/lib/api';
import PostCard from '@/components/feed/PostCard';
import StoriesBar from '@/components/feed/StoriesBar';
import ComposeBox from '@/components/feed/ComposeBox';
import ComposeModal from '@/components/feed/ComposeModal';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import { dummyPosts } from '@/lib/dummyData';

const TABS = ['For You', 'Following', 'Universes', 'Trending ⚡'];

// Characters that can auto-reply, with personality info for the AI
const REPLIERS = [
  { id: 'char-1', name: 'Monkey D. Luffy', universe: 'One Piece', emoji: '☠️', bio: "Captain of the Straw Hat Pirates. Carefree, stubborn, and endlessly optimistic about becoming King of the Pirates.", arc: 'Gear 5 Era' },
  { id: 'char-3', name: 'Gojo Satoru', universe: 'Jujutsu Kaisen', emoji: '👁', bio: "The world's strongest jujutsu sorcerer. Casually arrogant, witty, and genuinely believes he's untouchable.", arc: 'Culling Game' },
  { id: 'char-2', name: 'Mikasa Ackerman', universe: 'Attack on Titan', emoji: '🗡️', bio: "Survey Corps soldier. Quiet, intense, and deeply loyal. Speaks in short, direct sentences.", arc: 'Post-Rumbling' },
  { id: 'char-6', name: 'Killua Zoldyck', universe: 'Hunter x Hunter', emoji: '⚡', bio: "Former assassin, electric nen user. Sarcastic, self-deprecating, but fiercely loyal to Gon.", arc: 'Chimera Ant Arc' },
  { id: 'char-4', name: 'Violet Evergarden', universe: 'Violet Evergarden', emoji: '✉️', bio: "Auto Memory Doll who writes letters for others. Poetic, precise, and learning to understand human emotion.", arc: undefined },
  { id: 'char-5', name: 'Levi Ackerman', universe: 'Attack on Titan', emoji: '🗡️', bio: "Humanity's strongest soldier. Blunt, no-nonsense, secretly compassionate.", arc: undefined },
];

function pickReplier(excludeCharId: string) {
  const options = REPLIERS.filter(r => r.id !== excludeCharId);
  return options[Math.floor(Math.random() * options.length)];
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [typingPostId, setTypingPostId] = useState<string | null>(null);

  useEffect(() => {
    setPosts(dummyPosts);
    setLoading(false);
  }, []);

  const handlePost = async (post: Post) => {
    // Add the new post at the top
    setPosts(prev => [post, ...prev]);

    // Trigger AI auto-reply after 2 seconds
    const replier = pickReplier(post.characterId);

    setTimeout(async () => {
      setTypingPostId(post.id);

      try {
        const replyText = await agent.generateContent(
          { name: replier.name, universe: replier.universe, bio: replier.bio, arc: replier.arc },
          `Reply to this post in 1-2 short sentences, casually like a social media reply. Stay completely in character — personality, speech patterns, and worldview. Do not use quotation marks. Do not start with the character's name:\n\n"${post.content}"`,
          'reply',
          () => {}
        );

        setTypingPostId(null);

        const newReply = {
          id: `reply-${Date.now()}`,
          character: {
            name: replier.name,
            universe: replier.universe,
            emoji: replier.emoji,
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
