import { SxProps, Theme } from "@mui/material";
import type { SystemStyleObject } from "@mui/system";
import {
    optionTileButtonSx as buttonSx,
    optionTileSx as optionBoxSx,
} from "@/components/ui/optionTileStyles";
const formSx: SxProps<Theme> = {
    width: "100%",
    height: "min-content",
    ml: { sm: "20px" },
    mb: { xs: 5, sm: 0 },
};

const surfaceSx: SxProps<Theme> = {
    width: "100%",
    height: "auto",
    p: 3,
    mb: 3,
    display: "flex",
    flexDirection: "column",
};

const titleSx: SxProps<Theme> = {
    pl: "5px",
    mb: 2,
    fontWeight: 400,
    fontSize: { xs: "1.2rem", md: "1.5rem" },
};

const contentSx: SystemStyleObject<Theme> = {
    fontSize: { xs: "0.875rem", md: "1rem" },
};

const selectedOptionSx = (isSelected: boolean): SystemStyleObject<Theme> => ({
    position: "relative",
    borderWidth: isSelected ? "2px" : "1px",
    backgroundColor: isSelected
        ? "rgba(255, 255, 255, 0.14)"
        : "transparent",
    boxShadow: isSelected
        ? "inset 0 0 18px rgba(255,255,255,0.08), 0 0 14px rgba(255,255,255,0.12)"
        : "none",
    color: isSelected ? "text.primary" : "text.secondary",
    fontWeight: isSelected ? 700 : 400,
});

const selectedIconSx: SystemStyleObject<Theme> = {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    color: "text.primary",
};

const prestationsSx: SxProps<Theme> = {
    width: "100%",
    display: "grid",
    gridTemplateColumns: {
        lg: "repeat(4, 1fr)",
        xs: "repeat(2, 1fr)",
    },
    gap: 2,
    userSelect: "none",
    mb: 3,
};

const formulesSx: SxProps<Theme> = {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 2,
    userSelect: "none",
};

const prestationIconSx: SystemStyleObject<Theme> = {
    width: { xs: "25px", md: "30px" },
    height: { xs: "25px", md: "30px" },
};

export {
    buttonSx,
    contentSx,
    formSx,
    formulesSx,
    optionBoxSx,
    prestationIconSx,
    prestationsSx,
    selectedIconSx,
    selectedOptionSx,
    surfaceSx,
    titleSx,
};
