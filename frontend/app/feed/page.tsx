'use client';

import { useEffect, useState } from 'react';
import { feed, Post } from '@/lib/api';
import PostCard from '@/components/feed/PostCard';
import StoriesBar from '@/components/feed/StoriesBar';
import ComposeBox from '@/components/feed/ComposeBox';
import ComposeModal from '@/components/feed/ComposeModal';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import { dummyPosts } from '@/lib/dummyData';

const USE_DUMMY = true;
const TABS = ['For You', 'Following', 'Universes', 'Trending ⚡'];

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);

  useEffect(() => {
    if (USE_DUMMY) {
      setPosts(dummyPosts);
      setLoading(false);
      return;
    }
    feed.getPersonalized().then(data => {
      setPosts(data.posts);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen">
      <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} />
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
        <LeftSidebar />

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
                {posts.map(post => <PostCard key={post.id} post={post} />)}
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
