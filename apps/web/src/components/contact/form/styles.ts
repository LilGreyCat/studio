import { SxProps, Theme } from "@mui/material";
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

const contentSx: SxProps<Theme> = {
    fontSize: { xs: "0.875rem", md: "1rem" },
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

const prestationIconSx: SxProps<Theme> = {
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
    surfaceSx,
    titleSx,
};
