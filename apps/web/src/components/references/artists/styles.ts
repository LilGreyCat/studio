import type { SxProps, Theme } from "@mui/material";

const artistSurfaceSx: SxProps<Theme> = {
  width: "calc(100% - 32px)",
  mx: 2,
  minWidth: 0,
  height: "fit-content",
  p: 2,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
};

const artistImageWrapperSx: SxProps<Theme> = {
  flexShrink: 0,
  overflow: "hidden",
  borderRadius: "4px",
  position: "relative",
  width: { xs: 96, sm: 120 },
  aspectRatio: "1 / 1",
};

const artistContentSx: SxProps<Theme> = {
  minWidth: 0,
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  ml: 2,
};

const artistNameSx: SxProps<Theme> = {
  fontSize: "1.4rem",
  fontWeight: "bold",
  textAlign: "center",
};

const artistIconsSx: SxProps<Theme> = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  gap: 1,
  mt: 2,
  flexWrap: "wrap",
};

export {
  artistContentSx,
  artistIconsSx,
  artistImageWrapperSx,
  artistNameSx,
  artistSurfaceSx,
};
