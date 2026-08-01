export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#fffdf6" stroke="#1f3d1a" strokeWidth="2.5" />
      <circle cx="49" cy="20" r="6" fill="#f4a11f" />
      <path d="M14 34 L32 18 L50 34 Z" fill="#1f3d1a" />
      <path d="M22 34 L32 24 L42 34 Z" fill="#fffdf6" />
      <rect x="10" y="34" width="44" height="3" fill="#3f7d3a" />
      <g stroke="#7a4a12" strokeWidth="0.6">
        <circle cx="20" cy="46" r="5" fill="#f4a11f" />
        <circle cx="32" cy="48" r="5" fill="#f4a11f" />
        <circle cx="44" cy="46" r="5" fill="#f4a11f" />
      </g>
      <g fill="#7a4a12">
        <circle cx="20" cy="46" r="2" />
        <circle cx="32" cy="48" r="2" />
        <circle cx="44" cy="46" r="2" />
      </g>
    </svg>
  )
}
