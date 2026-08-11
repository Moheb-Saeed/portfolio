type MSLogoProps = {
  size?: number;
  className?: string;
  title?: string;
};

/**
 * "MS" monogram in a rounded accent chip. Shared mark used in the NavBar,
 * app icon, and OG image. Pure SVG so it scales crisply at any size.
 */
export function MSLogo({ size = 36, className, title = "Moheb Saeed" }: MSLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
      className={className}
    >
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="24"
        fill="oklch(33% 0.12 255)"
      />
      <text
        x="50"
        y="50"
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="var(--font-display), sans-serif"
        fontWeight="700"
        fontSize="46"
        letterSpacing="-2"
        fill="#ffffff"
      >
        MS
      </text>
    </svg>
  );
}
