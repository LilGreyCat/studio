import { Box, Button, Chip, Stack, Typography } from "@mui/material";

import type { HardwareItem } from "@/hooks/server/admin/hardware";

import { resolveHardwareImageURL } from "./utils";

type Props = {
  item: HardwareItem;
  index: number;
  itemCount: number;
  isBusy: boolean;
  onEdit: (item: HardwareItem) => void;
  onDelete: (item: HardwareItem) => Promise<void>;
  onToggleVisibility: (item: HardwareItem) => Promise<void>;
  onMove: (index: number, direction: -1 | 1) => Promise<void>;
};

export default function HardwareListItem({
  item,
  index,
  itemCount,
  isBusy,
  onEdit,
  onDelete,
  onToggleVisibility,
  onMove,
}: Props) {
  return (
    <Box
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
        component="img"
        src={resolveHardwareImageURL(item.image_url)}
        alt={item.title}
        sx={{
          width: { xs: "100%", md: 112 },
          height: 96,
          borderRadius: 1.5,
          objectFit: "cover",
        }}
      />

      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="h6">{item.title}</Typography>
          <Chip
            size="small"
            color={item.is_visible ? "success" : "default"}
            label={item.is_visible ? "Visible" : "Masqué"}
          />
        </Stack>
        <Typography color="text.secondary">{item.eyebrow}</Typography>
        <Typography variant="caption" color="text.secondary">
          Position {index + 1} · {item.slug}
        </Typography>
      </Stack>

      <Stack spacing={1} sx={{ minWidth: { md: 220 } }}>
        <Stack direction="row" spacing={1}>
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
            disabled={isBusy || index === itemCount - 1}
            onClick={() => onMove(index, 1)}
          >
            Descendre
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button
            size="small"
            variant="outlined"
            disabled={isBusy}
            onClick={() => onEdit(item)}
          >
            Modifier
          </Button>
          <Button
            size="small"
            variant="outlined"
            disabled={isBusy}
            onClick={() => onToggleVisibility(item)}
          >
            {item.is_visible ? "Masquer" : "Afficher"}
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            disabled={isBusy}
            onClick={() => onDelete(item)}
          >
            Supprimer
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
