/* GENERATED ARTWORK — do not hand-edit the path data.
 *
 * The `< MS />` lockup as Space Grotesk outlines (brackets Medium 500,
 * initials Bold 700), carrying the manual's −0.045em tracking and 0.135 × cap
 * gap. Regenerate alongside app/icon.svg if the fonts or the lockup change.
 */

type MSMarkOutlineProps = {
  className?: string;
  /** Applied to the two bracket groups, which the loader animates separately. */
  bracketClassName?: string;
  /** Applied to the initials group. */
  initialsClassName?: string;
  title?: string;
};

/**
 * Outlines rather than live text, deliberately: this renders during the loading
 * screen, before the webfont is guaranteed to have arrived, so text here would
 * risk showing the fallback face and then swapping mid-animation.
 *
 * Brackets and initials are separate groups so they can be animated apart. The
 * outer group flips the y-axis (font coordinates are y-up, SVG is y-down); the
 * inner groups only ever translate on x, which that flip leaves alone.
 */
export function MSMarkOutline({
  className,
  bracketClassName,
  initialsClassName,
  title,
}: MSMarkOutlineProps) {
  return (
    <svg
      viewBox="0 0 3023 914"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g transform="translate(-100 714) scale(1 -1)">
        <g className={bracketClassName}>
          <path d="M100 291L100 409L520 570L520 474L194 357L194 343L520 226L520 130Z" />
        </g>
        <g className={initialsClassName}>
          <path d="M727.5 700L955.5 700L1103.5 138L1115.5 138L1263.5 700L1491.5 700L1491.5 0L1363.5 0L1363.5 560L1351.5 560L1206.5 0L1012.5 0L867.5 560L855.5 560L855.5 0L727.5 0Z M1801.5 714Q1916.5 714 1988.5 654.5Q2060.5 595 2060.5 492L2060.5 462L1932.5 462L1932.5 483Q1932.5 598 1801.5 598Q1749.5 598 1719 575Q1688.5 552 1688.5 515Q1688.5 499 1692.5 486.5Q1696.5 474 1708.5 464.5Q1720.5 455 1729 449Q1737.5 443 1760.5 436.5Q1783.5 430 1793.5 427.5Q1803.5 425 1834.5 418L1843.5 416Q1959.5 390 2016 343Q2072.5 296 2072.5 206Q2072.5 103 2000.5 44.5Q1928.5 -14 1813.5 -14Q1683.5 -14 1608 53Q1532.5 120 1532.5 242L1532.5 264L1662.5 264L1662.5 246Q1662.5 179 1701.5 140.5Q1740.5 102 1817.5 102Q1878.5 102 1910.5 129.5Q1942.5 157 1942.5 199Q1942.5 242 1909 262.5Q1875.5 283 1798.5 300L1789.5 302Q1672.5 328 1615.5 374.5Q1558.5 421 1558.5 511Q1558.5 603 1628 658.5Q1697.5 714 1801.5 714Z" />
        </g>
        <g className={bracketClassName}>
          <path d="M2500 700L2596 700L2302 -200L2206 -200Z M3123 291L2703 130L2703 226L3029 343L3029 357L2703 474L2703 570L3123 409Z" />
        </g>
      </g>
    </svg>
  );
}
