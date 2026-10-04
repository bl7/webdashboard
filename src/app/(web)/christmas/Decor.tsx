export function Decor() {
  return (
    <div className="xmas-decor" aria-hidden>
      <svg className="xmas-corner xmas-corner-tl" viewBox="0 0 280 240">
        <Branch />
        <Bauble cx={78} cy={92} fill="#9c1c2e" />
        <Bauble cx={168} cy={48} fill="#c6a15a" />
        <Star x={210} y={110} />
      </svg>
      <svg className="xmas-corner xmas-corner-tr" viewBox="0 0 280 240">
        <g transform="translate(280 0) scale(-1 1)">
          <Branch />
        </g>
        <Bauble cx={196} cy={86} fill="#9c1c2e" />
        <Star x={70} y={46} />
        <Star x={128} y={128} />
      </svg>
      <svg className="xmas-corner xmas-corner-bl" viewBox="0 0 260 220">
        <g transform="translate(0 220) scale(1 -1)">
          <Branch />
        </g>
        <Bauble cx={96} cy={150} fill="#c6a15a" />
        <Star x={170} y={70} />
      </svg>
      <svg className="xmas-corner xmas-corner-br" viewBox="0 0 260 210">
        <Gift />
        <Star x={36} y={28} />
      </svg>
    </div>
  )
}

function Branch() {
  return (
    <g fill="none" stroke="#1f6a40" strokeLinecap="round">
      <path d="M8 20 C70 36 120 70 168 150" strokeWidth="3" />
      <path d="M28 28 C40 48 36 62 22 74" strokeWidth="8" />
      <path d="M48 40 C66 58 58 78 40 90" strokeWidth="8" />
      <path d="M70 58 C92 74 86 98 64 112" strokeWidth="9" />
      <path d="M96 82 C120 96 118 124 92 140" strokeWidth="9" />
      <path d="M122 110 C148 122 150 150 122 168" strokeWidth="8" />
      <path d="M40 34 C52 22 70 24 78 40" stroke="#2f8a52" strokeWidth="7" />
      <path d="M62 52 C78 40 98 46 104 66" stroke="#2f8a52" strokeWidth="7" />
      <path d="M88 76 C108 64 128 74 130 96" stroke="#2f8a52" strokeWidth="7" />
    </g>
  )
}

function Bauble({ cx, cy, fill }: { cx: number; cy: number; fill: string }) {
  return (
    <g>
      <rect x={cx - 7} y={cy - 22} width="14" height="10" rx="2" fill="#c6a15a" />
      <circle cx={cx} cy={cy} r="16" fill={fill} />
      <circle cx={cx - 5} cy={cy - 5} r="4" fill="#fff" opacity="0.35" />
    </g>
  )
}

function Star({ x, y }: { x: number; y: number }) {
  return (
    <path
      transform={`translate(${x} ${y})`}
      d="M0 -10 L2.4 -2.6 L10 -2.2 L4 2.8 L6.2 10 L0 6 L-6.2 10 L-4 2.8 L-10 -2.2 L-2.4 -2.6 Z"
      fill="#c6a15a"
    />
  )
}

function Gift() {
  return (
    <g transform="translate(78 48)">
      <rect x="0" y="36" width="120" height="78" rx="6" fill="#e7d3a1" />
      <rect x="52" y="36" width="16" height="78" fill="#9c1c2e" />
      <path d="M60 36 C40 36 28 18 40 10 C50 4 60 18 60 36 C60 18 70 4 80 10 C92 18 80 36 60 36" fill="none" stroke="#9c1c2e" strokeWidth="6" />
    </g>
  )
}
