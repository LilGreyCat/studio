import type { SxProps, Theme } from "@mui/material/styles";
import { SystemStyleObject } from "@mui/system";

export const glassSx = (): SxProps<Theme> => ({
    backgroundColor: "rgba(255,255,255,0.05)",
    backdropFilter: `blur(5px) saturate(150%)`,
    WebkitBackdropFilter: `blur(5px) saturate(150%)`,
    boxShadow:
        "0 8px 30px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
});

export const animatedBorderSx = (): SystemStyleObject<Theme> => ({
    position: "relative",

    "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        padding: `2px`,
        pointerEvents: "none",

        background:
            "linear-gradient(-45deg," +
            "#141414 0%," +
            "#2a2a2a 12%," +
            "#6f6f6f 32%," +
            "#ffffff 50%," +
            "#6f6f6f 68%," +
            "#2a2a2a 88%," +
            "#141414 100%)",

        backgroundSize: "300% 100%",
        opacity: 0.9,
        animation: "borderGlow 6s linear infinite",

        "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
            backgroundPosition: "50% 50%",
        },

        WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
    },

    "@keyframes borderGlow": {
        "0%": { backgroundPosition: "0% 50%" },
        "50%": { backgroundPosition: "100% 50%" },
        "100%": { backgroundPosition: "0% 50%" },
    },
});
