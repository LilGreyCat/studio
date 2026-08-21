import { Box } from "@mui/material";

export default function Divider() {
  return <Box sx={dividerSx} />;
}

const dividerSx = {
  position: "relative",
  top: 0,
  left: 0,
  right: 0,
  width: "98%",
  height: "1px",
  borderRadius: "999px",
  backgroundColor: `rgba(255, 255, 255, 0.05)`,
  boxShadow:
    "0 8px 30px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(5px) saturate(150%)",
  WebkitBackdropFilter: "blur(5px) saturate(150%)",

  "&::after": {
    content: '""',
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: "1px",
    pointerEvents: "none",

    background:
      "linear-gradient(90deg, " +
      "#141414 0%, " +
      "#303030 15%, " +
      "#888888 35%, " +
      "#ffffff 50%, " +
      "#888888 65%, " +
      "#303030 85%, " +
      "#141414 100%)",

    backgroundSize: "300% 100%",
    animation: "navBorderGlow 6s linear infinite",
    opacity: 0.9,
    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
      backgroundPosition: "50% 50%",
    },
  },

  "@keyframes navBorderGlow": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
};
