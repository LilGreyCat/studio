import type { SxProps, Theme } from "@mui/material";

const containerSx: SxProps<Theme> = {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    px: 3,
    pb: 6,
};

const listSx: SxProps<Theme> = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
};

const surfaceSx = (reverse: boolean): SxProps<Theme> => ({
    width: "100%",
    maxWidth: "1150px",
    display: "flex",
    flexDirection: {
        xs: "column",
        md: reverse ? "row-reverse" : "row",
    },
    alignItems: "stretch",
    gap: 3,
    p: 3,
});

const imageWrapperSx: SxProps<Theme> = {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const imageSx = {
    width: "280px",
    height: "auto",
    borderRadius: "8px",
    display: "block",
};

const textAreaSx: SxProps<Theme> = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
};

const textBoxSx: SxProps<Theme> = {
    width: "100%",
    maxWidth: "68ch",
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
};

const eyebrowSx: SxProps<Theme> = {
    fontSize: "0.8rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "text.secondary",
    opacity: 0.8,
};

const titleSx: SxProps<Theme> = {
    fontSize: "1.8rem",
    lineHeight: 1.2,
    fontWeight: 700,
    color: "text.primary",
};

const dividerSx: SxProps<Theme> = {
    width: "56px",
    height: "2px",
    borderRadius: "999px",
    backgroundColor: "rgba(255,255,255,0.18)",
    my: 0.5,
};

const descSx: SxProps<Theme> = {
    fontSize: "1.02rem",
    lineHeight: 1.8,
    color: "text.secondary",
    whiteSpace: "pre-line",
};

const imageButtonSx: SxProps<Theme> = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "zoom-in",
    borderRadius: "8px",
};

export {
    containerSx,
    descSx,
    dividerSx,
    eyebrowSx,
    imageButtonSx,
    imageSx,
    imageWrapperSx,
    listSx,
    surfaceSx,
    textAreaSx,
    textBoxSx,
    titleSx,
};
