import CardStack from "@/components/materiel/CardStack";
import { containerSx, listSx } from "@/components/materiel/styles";
import { MainLogo } from "@/components/ui";
import { Box } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matériel",
  description: "Découvrez le matériel du studio Nha Dès Records.",
};

export default function Materiel() {
  return (
    <Box sx={containerSx}>
      <Box sx={listSx}>
        <MainLogo marginBottom={1} />
        <CardStack />
      </Box>
    </Box>
  );
}
