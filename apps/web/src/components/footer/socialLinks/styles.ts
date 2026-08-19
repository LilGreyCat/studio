import type { SxProps, Theme } from "@mui/material";

const iconSx: SxProps<Theme> = {
    height: "25px",
    width: "25px",
    color: "text.secondary",

    "&:hover": {
        color: "primary.main",
    },
};

const containerSx: SxProps<Theme> = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    mt: { xs: "20px", lg: "0px" },
    mb: { xs: "50px", lg: "0px" },
    mr: { xs: "0px", lg: "230px" },
};

const logoSx: SxProps<Theme> = {
    width: "auto",
    height: "220px",
};

export { containerSx, iconSx, logoSx };
