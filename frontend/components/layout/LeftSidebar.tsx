'use client';

import { usePathname } from 'next/navigation';

const navItems = [
  { icon: '🏠', label: 'Home', href: '/feed', soon: false },
  { icon: '🔍', label: 'Explore', href: '/explore', soon: true },
  { icon: '🔔', label: 'Notifications', href: '/notifications', soon: true },
  { icon: '💬', label: 'Messages', href: '/messages', soon: true },
  { icon: '✨', label: 'Universes', href: '/universes', soon: true },
  { icon: '👤', label: 'Profile', href: '/profile', soon: true },
];

interface LeftSidebarProps {
  onCompose?: () => void;
}

export default function LeftSidebar({ onCompose }: LeftSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 h-screen flex flex-col py-6 px-4 overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-6 text-xl font-bold" style={{ color: '#c084fc' }}>
        <span className="inline-block" style={{ animation: 'planetSpin 8s linear infinite', fontSize: '24px' }}>🪐</span>
        <span><span className="text-white">Fab</span>Planet</span>
        <style>{`
          @keyframes planetSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map(item => {
          const active = pathname === item.href;
          return item.soon ? (
            <div
              key={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-default"
              style={{ color: '#505070', opacity: 0.6 }}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-auto uppercase tracking-wide"
                style={{ background: 'rgba(192,132,252,0.25)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.4)' }}>
                soon
              </span>
            </div>
          ) : (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                color: active ? '#c084fc' : '#9090b8',
                background: active ? 'rgba(192,132,252,0.12)' : 'transparent',
              }}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Post button */}
      <button
        onClick={onCompose}
        className="mt-5 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
      >
        + Post as Character
      </button>
    </div>
  );
}
