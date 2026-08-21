import { Box } from "@mui/material";
import { STARS_1, STARS_2, STARS_3 } from "./stars";

export default function Starfield() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse 140% 55% at 50% 116%, #141414 0%, #0a0a0a 45%, #000000 100%)",
        ...animKeyframes,
      }}
    >
      <Box sx={stars1Sx} />
      <Box sx={stars2Sx} />
      <Box sx={stars3Sx} />
    </Box>
  );
}

const STARFIELD_SIZE = 2000;

const animKeyframes = {
  "@keyframes animStar": {
    from: { transform: "translate3d(0, 0, 0)" },
    to: { transform: `translate3d(0, -${STARFIELD_SIZE}px, 0)` },
  },
};

const compositorSx = {
  willChange: "transform",
  backfaceVisibility: "hidden",
  contain: "strict",
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
    transform: "none",
  },
};

function createStarLayerSx(size: number, duration: number, stars: string) {
  return {
    ...compositorSx,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: `calc(100% + ${STARFIELD_SIZE}px)`,
    backgroundImage: createStarTexture(size, stars),
    backgroundPosition: "0 0",
    backgroundRepeat: "repeat",
    backgroundSize: `${STARFIELD_SIZE}px ${STARFIELD_SIZE}px`,
    animation: `animStar ${duration}s linear infinite`,
  };
}

function createStarTexture(size: number, stars: string): string {
  const radius = size / 2;
  const circles = Array.from(stars.matchAll(/(\d+)px\s+(\d+)px/g), (match) => {
    const x = Number(match[1]) + radius;
    const y = Number(match[2]) + radius;
    return `<circle cx="${x}" cy="${y}" r="${radius}"/>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${STARFIELD_SIZE}" height="${STARFIELD_SIZE}" viewBox="0 0 ${STARFIELD_SIZE} ${STARFIELD_SIZE}" fill="white">${circles}</svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const stars1Sx = createStarLayerSx(1, 120, STARS_1);
const stars2Sx = createStarLayerSx(2, 160, STARS_2);
const stars3Sx = createStarLayerSx(3, 200, STARS_3);
