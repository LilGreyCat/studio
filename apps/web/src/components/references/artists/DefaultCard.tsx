import { Box, Typography } from "@mui/material";

import SafeImage from "@/components/ui/SafeImage";
import LinkIcon from "../projects/LinkIcon";
import {
  artistContentSx,
  artistIconsSx,
  artistImageWrapperSx,
  artistNameSx,
} from "./styles";
import type { ArtistAction } from "./types";

type Props = {
  name: string;
  imageSrc: string | null;
  actions: ArtistAction[];
};

export default function ArtistDefaultCard({ name, imageSrc, actions }: Props) {
  return (
    <>
      <Box sx={artistImageWrapperSx}>
        <SafeImage
          src={imageSrc}
          alt={name}
          fill
          sizes="(max-width: 600px) 96px, 120px"
          style={{ objectFit: "cover" }}
        />
      </Box>

      <Box sx={artistContentSx}>
        <Typography sx={artistNameSx}>{name}</Typography>

        <Box sx={artistIconsSx}>
          {actions.map((item) => (
            <LinkIcon key={item.key} icon={item.icon} action={item.action} />
          ))}
        </Box>
      </Box>
    </>
  );
}
