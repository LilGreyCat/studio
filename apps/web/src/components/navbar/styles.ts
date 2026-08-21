import type { SxProps, Theme } from "@mui/material/styles";
import { SystemStyleObject } from "@mui/system";

import { NAVBAR_HEIGHT } from "@/components/ui/constants";

const navSx: SxProps<Theme> = {
    position: "fixed",
    top: "var(--notification-band-height, 0px)",
    left: 0,
    right: 0,
    height: NAVBAR_HEIGHT,
    zIndex: (theme) => theme.zIndex.appBar,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 2,
    backgroundColor: `rgba(255, 255, 255, 0.05)`,
    boxShadow:
        "0 8px 30px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(5px) saturate(150%)",
    WebkitBackdropFilter: "blur(5px) saturate(150%)",
    transition: "top 250ms ease",

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

const logoSx: SxProps<Theme> = {
    height: "78px",
    mr: { sm: "10px", lg: "25px" },
    zIndex: 1,
};

const underlinedWrapperSx = (
    transformOrigin: string,
    isActive?: boolean
): SystemStyleObject<Theme> => ({
    position: "relative",

    "&::after": {
        content: '""',
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -2,
        height: "1px",
        backgroundColor: "text.secondary",
        transform: isActive ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: transformOrigin,
        transition: "transform 250ms cubic-bezier(.4,0,.2,1)",
    },

    ".MuiButtonBase-root:hover &::after, .MuiButtonBase-root:focus-visible &::after":
        {
            transform: { lg: "scaleX(1)" },
        },

    ".MuiButtonBase-root:active &::after": {
        transform: "scaleX(1)",
    },
});

export { logoSx, navSx, underlinedWrapperSx };
