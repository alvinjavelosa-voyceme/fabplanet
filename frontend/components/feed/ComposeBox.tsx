'use client';

interface ComposeBoxProps {
  onOpen: () => void;
}

export default function ComposeBox({ onOpen }: ComposeBoxProps) {
  return (
    <div className="py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex gap-3 items-start">
        {/* Avatar */}
        <button
          onClick={onOpen}
          className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-xl flex-shrink-0 transition-opacity hover:opacity-80"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            border: '2px solid rgba(192,132,252,0.4)',
          }}
        >
          ✦
        </button>

        {/* Right side */}
        <div className="flex-1 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpen}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors hover:bg-purple-400/20"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#c084fc',
              }}
            >
              ✦ Select a character ▾
            </button>
          </div>

          <div
            className="text-sm cursor-text"
            style={{ color: '#4040a0' }}
            onClick={onOpen}
          >
            What&apos;s on their mind…
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex gap-4">
              {['🖼️', '📊', '🏷️', '@'].map(tool => (
                <button
                  key={tool}
                  onClick={onOpen}
                  className="text-lg opacity-40 hover:opacity-100 transition-opacity"
                >
                  {tool}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[11px]" style={{ color: '#5050a0' }}>0 / 280</span>
              <button
                onClick={onOpen}
                className="text-sm font-semibold text-white px-4 py-1.5 rounded-full transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
              >
                Post ✦
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
