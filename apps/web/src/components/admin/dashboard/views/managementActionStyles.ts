import type { SxProps, Theme } from "@mui/material";

const managementActionsSx: SxProps<Theme> = {
  minWidth: { md: 240 },
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 1,
  "& .MuiButton-root": {
    width: "100%",
  },
};

const destructiveActionSx: SxProps<Theme> = {
  gridColumn: "1 / -1",
};

export { destructiveActionSx, managementActionsSx };
