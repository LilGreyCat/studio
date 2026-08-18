import { NAVBAR_HEIGHT } from "@/components/ui/constants";
import { type SxProps, type Theme } from "@mui/material";
import { type SystemStyleObject } from "@mui/system";

const iconSx: SystemStyleObject<Theme> = {
    display: "block",
    width: "auto",
    mb: "5px",
};

const nhaIconSx: SystemStyleObject<Theme> = {
    ...iconSx,
    height: "10px",
};

const desIconSx: SystemStyleObject<Theme> = {
    ...iconSx,
    height: "13px",
};

const recordsIconSx: SystemStyleObject<Theme> = {
    ...iconSx,
    height: "10px",
    ml: "2px",
    mt: "10px",
};

const studioNameBtnSx: SxProps<Theme> = {
    height: NAVBAR_HEIGHT,
    maxWidth: "175px",
    width: "125px",
    ml: { xs: "10px", lg: "20px" },

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
};

const nhadesWrapperSx: SxProps<Theme> = {
    width: "175px",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
};

export {
    desIconSx,
    nhadesWrapperSx,
    nhaIconSx,
    recordsIconSx,
    studioNameBtnSx,
};
