import type { SxProps, Theme } from "@mui/material";
import type { SystemStyleObject } from "@mui/system";

const optionTileButtonSx: SxProps<Theme> = {
  width: "100%",
  display: "block",
  textAlign: "left",
  borderRadius: "inherit",
};

const optionTileSx = (
  isSelected: boolean
): SystemStyleObject<Theme> => ({
  px: 2,
  py: 1.2,
  width: "100%",
  height: "100px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-around",
  textAlign: "center",
  borderRadius: "4px",
  border: "1px solid",
  borderColor: isSelected ? "primary.main" : "divider",
  color: isSelected ? "text.primary" : "text.secondary",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    border: { md: "1px solid white" },
    color: { md: "text.primary" },
  },
});

export { optionTileButtonSx, optionTileSx };
