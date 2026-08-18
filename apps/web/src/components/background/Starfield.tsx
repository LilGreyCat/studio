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

const animKeyframes = {
  "@keyframes animStar": {
    from: { transform: "translate3d(0, 0, 0)" },
    to: { transform: "translate3d(0, -2000px, 0)" },
  },
};

const compositorSx = {
  willChange: "transform",
  backfaceVisibility: "hidden",
};

function createStarLayerSx(size: number, duration: number, stars: string) {
  const pixelSize = `${size}px`;

  return {
    ...compositorSx,
    position: "absolute",
    top: 0,
    left: 0,
    width: pixelSize,
    height: pixelSize,
    background: "transparent",
    borderRadius: "50%",
    animation: `animStar ${duration}s linear infinite`,
    boxShadow: stars,
    "&::after": {
      content: '""',
      position: "absolute",
      top: "2000px",
      width: pixelSize,
      height: pixelSize,
      background: "transparent",
      borderRadius: "50%",
      boxShadow: stars,
    },
  };
}

const stars1Sx = createStarLayerSx(1, 120, STARS_1);
const stars2Sx = createStarLayerSx(2, 160, STARS_2);
const stars3Sx = createStarLayerSx(3, 200, STARS_3);
