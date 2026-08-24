import { SxProps, Theme } from "@mui/material";

// LINK ICON
const iconSx: SxProps<Theme> = {
    height: "25px",
    width: "25px",
    color: "text.secondary",

    "&:hover": {
        color: { lg: "primary.main" },
    },
};

export { iconSx };

// PROJECTS
const containerSx: SxProps<Theme> = {
    width: "100%",
    display: "grid",
    gridTemplateColumns: {
        xs: "repeat(1, minmax(0, 1fr))",
        lg: "repeat(2, minmax(0, 1fr))",
    },
    gap: 3,
    alignItems: "start",
    mb: 5,
    "& > :last-child:nth-child(odd)": {
        width: { xs: "100%", lg: "calc((100% - 24px) / 2)" },
        gridColumn: { lg: "1 / -1" },
        justifySelf: "center",
    },
};

const featuredSectionSx: SxProps<Theme> = {
    width: "100%",
    mb: 5,
};

export { containerSx, featuredSectionSx };

// PROJECT
const surfaceSx: SxProps<Theme> = {
    width: "100%",
    height: "fit-content",
    p: { xs: 2, sm: 3 },
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: "center",
};

const iconsWrapperSx: SxProps<Theme> = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    gap: 1,
    mt: 4,
    flexWrap: "wrap",
};

const projectNameSx: SxProps<Theme> = {
    fontSize: "1.4rem",
    fontWeight: "bold",
};

const nameLinksWrapperSx: SxProps<Theme> = {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    ml: { xs: 0, sm: 2 },
    mt: { xs: 2, sm: 0 },
};

const imageWrapperSx: SxProps<Theme> = {
    flexShrink: 0,
    overflow: "hidden",
    borderRadius: "4px",
    position: "relative",
    height: { xs: "160px", sm: "180px" },
    aspectRatio: "1 / 1",
};

const integrationWrapperSx: SxProps<Theme> = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 2,
};

const integrationHeaderSx: SxProps<Theme> = {
    width: "100%",
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: { xs: "stretch", sm: "center" },
    justifyContent: "space-between",
    gap: 2,
};

const backButtonSx: SxProps<Theme> = {
    background: "transparent",
    border: "1px solid",
    borderColor: "divider",
    color: "text.secondary",
    borderRadius: "4px",
    px: 2,
    py: 0.5,
    cursor: "pointer",
    alignSelf: { xs: "flex-end", sm: "auto" },
};

export {
    backButtonSx,
    iconsWrapperSx,
    imageWrapperSx,
    integrationHeaderSx,
    integrationWrapperSx,
    nameLinksWrapperSx,
    projectNameSx,
    surfaceSx,
};
