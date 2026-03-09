'use client';

import { dummyStories } from '@/lib/dummyData';

export default function StoriesBar() {
  return (
    <div
      className="flex gap-3 py-4 overflow-x-auto"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {dummyStories.map(story => (
        <div key={story.name} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer">
          <div
            className="w-[52px] h-[52px] rounded-full p-0.5"
            style={{
              background: story.seen
                ? 'rgba(255,255,255,0.15)'
                : 'linear-gradient(135deg, #7c3aed, #ec4899, #f59e0b)',
            }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-xl"
              style={{ background: '#12111e', border: '2px solid #0d0d14' }}
            >
              {story.emoji}
            </div>
          </div>
          <span className="text-[11px] max-w-[56px] text-center truncate" style={{ color: '#9090b8' }}>
            {story.name}
          </span>
        </div>
      ))}
    </div>
  );
}
