import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { GlassySurface } from "@/components/ui";
import SafeImage from "@/components/ui/SafeImage";
import type { Artist } from "@/hooks/server/artists/types";
import { getImageUrl } from "@/utils/getImageUrl";
import {
  destructiveActionSx,
  managementActionsSx,
} from "../managementActionStyles";

type Props = {
  artist: Artist;
  index: number;
  count: number;
  isBusy: boolean;
  onMove: (index: number, direction: -1 | 1) => Promise<void>;
  onEdit: (artist: Artist) => void;
  onToggle: (artist: Artist) => Promise<void>;
  onDelete: (artist: Artist) => Promise<void>;
};

export default function ArtistListItem({
  artist,
  index,
  count,
  isBusy,
  onMove,
  onEdit,
  onToggle,
  onDelete,
}: Props) {
  return (
    <GlassySurface
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        gap: 2,
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          width: { xs: "100%", md: 112 },
          height: 96,
          flexShrink: 0,
          borderRadius: 1.5,
        }}
      >
        <SafeImage
          src={getImageUrl(artist.image_url)}
          alt={artist.name}
          fill
          sizes="(max-width: 900px) 100vw, 112px"
          style={{ objectFit: "cover" }}
        />
      </Box>
      <Stack sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="h6">{artist.name}</Typography>
          <Chip
            size="small"
            color={artist.is_visible ? "success" : "default"}
            label={artist.is_visible ? "Visible" : "Masqué"}
          />
        </Stack>
      </Stack>
      <Box sx={managementActionsSx}>
        <Button
          size="small"
          variant="outlined"
          disabled={isBusy || index === 0}
          onClick={() => onMove(index, -1)}
        >
          Monter
        </Button>
        <Button
          size="small"
          variant="outlined"
          disabled={isBusy || index === count - 1}
          onClick={() => onMove(index, 1)}
        >
          Descendre
        </Button>
        <Button
          size="small"
          variant="outlined"
          disabled={isBusy}
          onClick={() => onEdit(artist)}
        >
          Modifier
        </Button>
        <Button
          size="small"
          variant="outlined"
          disabled={isBusy}
          onClick={() => onToggle(artist)}
        >
          {artist.is_visible ? "Masquer" : "Afficher"}
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          disabled={isBusy}
          onClick={() => onDelete(artist)}
          sx={destructiveActionSx}
        >
          Supprimer
        </Button>
      </Box>
    </GlassySurface>
  );
}
