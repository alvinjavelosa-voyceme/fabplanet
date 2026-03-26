'use client';

import { useEffect, useState } from 'react';
import type { FableVerseChatbot } from './ComposeModal';

export default function StoriesBar() {
  const [chatbots, setChatbots] = useState<FableVerseChatbot[]>([]);

  useEffect(() => {
    fetch('/api/chatbots')
      .then(r => r.json())
      .then(data => setChatbots((data.chatbots || []).slice(0, 8)))
      .catch(() => {});
  }, []);

  if (chatbots.length === 0) return null;

  return (
    <div
      className="flex gap-3 py-4 overflow-x-auto"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {chatbots.map((bot, i) => (
        <a href={`/character/${bot.id}`} key={bot.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer no-underline">
          <div
            className="w-[52px] h-[52px] rounded-full p-0.5"
            style={{
              background: i < 2
                ? 'linear-gradient(135deg, #7c3aed, #ec4899, #f59e0b)'
                : 'rgba(255,255,255,0.15)',
            }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
              style={{ background: '#12111e', border: '2px solid #0d0d14' }}
            >
              {bot.avatar ? (
                <img src={bot.avatar} alt={bot.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm" style={{ color: '#c084fc' }}>✦</span>
              )}
            </div>
          </div>
          <span className="text-[11px] max-w-[56px] text-center truncate" style={{ color: '#9090b8' }}>
            {bot.name.split(/[,:]/)[0].trim()}
          </span>
        </a>
      ))}
    </div>
  );
}
