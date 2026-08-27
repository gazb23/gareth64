import styles from "./gareth64.module.css";

/**
 * Coarse pixel silhouette of Australia, C64 block-graphics style.
 * 24 columns × 21 rows; '#' is land. The marker cell is the Sunshine Coast.
 */
const ROWS = [
  "................##......",
  ".........####...##......",
  "......#######...###.....",
  "....#########...####....",
  "..###########..#####....",
  "..####################..",
  ".#####################..",
  "#######################.",
  "#######################.",
  "########################",
  "########################",
  ".######################.",
  ".######################.",
  ".#####################..",
  "..####......###########.",
  "...##.......#########...",
  ".............########...",
  "..............######....",
  "........................",
  "..................##....",
  "..................#.....",
] as const;

const MARKER = { x: 23, y: 10 };

export function AustraliaMap() {
  const land: { x: number; y: number }[] = [];
  ROWS.forEach((row, y) => {
    for (let x = 0; x < row.length; x += 1) {
      if (row[x] === "#" && !(x === MARKER.x && y === MARKER.y)) land.push({ x, y });
    }
  });

  return (
    <svg
      className={styles.mapLine}
      viewBox="-0.5 -0.5 26 22"
      role="img"
      aria-label="Pixel map of Australia with the Sunshine Coast marked on the Queensland coast"
      shapeRendering="crispEdges"
    >
      {land.map(({ x, y }) => (
        <rect className={styles.mapLand} x={x} y={y} width={1} height={1} key={`${x}-${y}`} />
      ))}
      <text className={styles.mapLabel} x={21.9} y={11} textAnchor="end">SUNSHINE COAST</text>
      <rect className={styles.mapDot} x={MARKER.x - 0.35} y={MARKER.y - 0.35} width={1.7} height={1.7} />
    </svg>
  );
}
