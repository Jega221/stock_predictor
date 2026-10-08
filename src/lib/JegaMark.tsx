import type { CSSProperties } from 'react'

/**
 * Jega brand mark: precision geometric 'J' monogram engineered to match
 * the exact institutional aesthetic, weight, and aspect ratio of the platform.
 */
export default function JegaMark({
  width = 32,
  height = 26,
  className = '',
  style,
  color = 'currentColor',
}: {
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
  color?: string
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 34 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Top horizontal accent bar */}
      <rect x="4" y="0" width="16" height="5.5" fill={color} />
      {/* Vertical stem and stylized hook of 'J' */}
      <path
        d="M20 0H28V15C28 21.0751 23.0751 26 17 26H13C6.92487 26 2 21.0751 2 15V12.5H8.5V15C8.5 17.4853 10.5147 19.5 13 19.5H17C19.4853 19.5 21.5 17.4853 21.5 15V5.5H20V0Z"
        fill={color}
      />
      {/* Luminous dynamic corner tick */}
      <rect x="23.5" y="0" width="4.5" height="5.5" fill="#70B6FF" />
    </svg>
  )
}
