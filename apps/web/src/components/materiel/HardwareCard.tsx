import GlassySurface from "@/components/ui/GlassySurface";
import { Box, ButtonBase, Typography } from "@mui/material";
import Image from "next/image";
import { memo } from "react";
import {
  descSx,
  dividerSx,
  eyebrowSx,
  imageButtonSx,
  imageSx,
  imageWrapperSx,
  surfaceSx,
  textAreaSx,
  textBoxSx,
  titleSx,
} from "./styles";

type HardwareItem = {
  imageSrc: string;
  title: string;
  eyebrow: string;
  desc: React.ReactNode;
  height: number;
  width: number;
};

type Props = {
  item: HardwareItem;
  reverse?: boolean;
  onImageClick: (item: HardwareItem) => void;
};

function HardwareCard({ item, reverse = false, onImageClick }: Props) {
  return (
    <GlassySurface sx={surfaceSx(reverse)}>
      <ButtonBase
        onClick={() => onImageClick(item)}
        aria-label={`Ouvrir l'image en plein écran: ${item.title}`}
        sx={imageButtonSx}
      >
        <Box sx={imageWrapperSx}>
          <Image
            src={item.imageSrc}
            alt={item.title}
            width={item.width}
            height={item.height}
            sizes="280px"
            style={imageSx}
          />
        </Box>
      </ButtonBase>

      <Box sx={textAreaSx}>
        <Box sx={textBoxSx}>
          <Typography sx={eyebrowSx}>{item.eyebrow}</Typography>

          <Typography sx={titleSx}>{item.title}</Typography>

          <Box sx={dividerSx} />

          <Typography sx={descSx}>{item.desc}</Typography>
        </Box>
      </Box>
    </GlassySurface>
  );
}

export default memo(HardwareCard);
