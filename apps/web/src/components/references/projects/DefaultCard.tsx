import { Box, Typography } from "@mui/material";

import SafeImage from "@/components/ui/SafeImage";
import LinkIcon from "./LinkIcon";
import type { ProjectAction } from "./types";

import {
  iconsWrapperSx,
  imageWrapperSx,
  nameLinksWrapperSx,
  projectNameSx,
} from "./styles";

type Props = {
  name: string;
  imageSrc: string | null;
  actions: ProjectAction[];
};

export default function ProjectDefaultCard({ name, imageSrc, actions }: Props) {
  return (
    <>
      <Box sx={imageWrapperSx}>
        <SafeImage
          src={imageSrc}
          alt={name}
          fill
          sizes="(max-width: 600px) 160px, 180px"
          style={{ objectFit: "cover" }}
        />
      </Box>

      <Box sx={nameLinksWrapperSx}>
        <Typography sx={projectNameSx}>{name}</Typography>

        <Box sx={iconsWrapperSx}>
          {actions.map((item) => (
            <LinkIcon key={item.key} icon={item.icon} action={item.action} />
          ))}
        </Box>
      </Box>
    </>
  );
}
