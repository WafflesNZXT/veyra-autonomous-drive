/**
 * VEYRA brand assets — minimalist "V" mark built from converging
 * road lines / sensor beams, plus a wide-tracked wordmark.
 */

export function VeyraMark({
  size = 28,
  color = '#00d4ff',
  strokeColor = '#ffffff',
}: {
  size?: number;
  color?: string;
  strokeColor?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-label="VEYRA logo"
      data-testid="veyra-mark"
    >
      {/* Outer V — two converging road lines */}
      <path d="M3 5 L14.4 27 L17.6 27 L29 5 L25.2 5 L16 22.9 L6.8 5 Z" fill={strokeColor} />
      {/* Inner sensor beam */}
      <path d="M12 5 L16 12.8 L20 5 Z" fill={color} />
    </svg>
  );
}

export function VeyraWordmark({
  className = '',
  as: Tag = 'span',
}: {
  className?: string;
  as?: 'span' | 'h1' | 'div';
}) {
  return (
    <Tag
      className={`font-sans font-semibold tracking-[0.42em] text-white ${className}`}
      data-testid="veyra-wordmark"
    >
      VEYRA
    </Tag>
  );
}
