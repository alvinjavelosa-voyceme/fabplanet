'use client';

import { usePathname } from 'next/navigation';

const navItems = [
  { icon: '🏠', label: 'Home', href: '/feed' },
  { icon: '🔍', label: 'Explore', href: '/explore' },
  { icon: '🔔', label: 'Notifications', href: '/notifications' },
  { icon: '💬', label: 'Messages', href: '/messages' },
  { icon: '✨', label: 'Universes', href: '/universes' },
  { icon: '👤', label: 'Profile', href: '/profile' },
];

export default function LeftSidebar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 h-screen flex flex-col py-6 px-4 overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-6 text-xl font-bold" style={{ color: '#c084fc' }}>
        ✦ <span className="text-white">Char</span>Verse
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map(item => {
          const active = pathname === item.href;
          return (
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
        className="mt-5 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
      >
        + Post as Character
      </button>
    </div>
  );
}
