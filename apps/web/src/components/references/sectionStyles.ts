import type { SxProps, Theme } from "@mui/material";

const sectionTitleSx: SxProps<Theme> = {
    mb: 3,
    textAlign: "center",
    color: "text.secondary",
    fontSize: { xs: "1.15rem", sm: "1.35rem" },
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
};

export { sectionTitleSx };
