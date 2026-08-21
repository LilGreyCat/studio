import { SxProps, Theme } from "@mui/material";

const surfaceSx: SxProps<Theme> = {
    height: "initial",
    py: 4,
    px: 2,
    mt: { xs: 5, sm: 0 },
    display: { xs: "grid", sm: "flex" },
    flexDirection: "column",
    gridTemplateColumns: "minmax(0, 1fr) 1fr",
    columnGap: 3,
    alignItems: "center",
    justifyContent: "stretch",
    justifyItems: "stretch",
};

const logoSx: SxProps<Theme> = {
    width: "100%",
    maxWidth: { xs: "165px", md: "198px" },
    height: "auto",
    userSelect: "none",
    aspectRatio: "1 / 1",
    objectFit: "contain",
    justifySelf: "center",
    mb: "30px",
};

const locationWrapperSx: SxProps<Theme> = {
    mt: 3,
    width: "100%",
    height: "100%",
    borderRadius: "4px",
    overflow: "hidden",
    gridColumn: "span 2",
};

export { locationWrapperSx, logoSx, surfaceSx };
