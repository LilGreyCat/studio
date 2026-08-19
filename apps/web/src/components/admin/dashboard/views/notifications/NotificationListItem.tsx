import { GlassySurface } from "@/components/ui";
import type { Notification } from "@/hooks/server/admin/notifications";
import { Box, Button, Chip, Link, Stack, Typography } from "@mui/material";

type Props = {
  item: Notification;
  isBusy: boolean;
  onEdit: (item: Notification) => void;
  onDelete: (item: Notification) => void;
};

const formatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

function status(item: Notification): { label: string; color: "success" | "info" | "default" } {
  const now = Date.now();
  if (now < new Date(item.starts_at).getTime()) return { label: "Planifiée", color: "info" };
  if (now >= new Date(item.ends_at).getTime()) return { label: "Terminée", color: "default" };
  return { label: "Active", color: "success" };
}

export default function NotificationListItem({ item, isBusy, onEdit, onDelete }: Props) {
  const currentStatus = status(item);
  return (
    <GlassySurface
      sx={{
        p: { xs: 2, sm: 2.5 },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) auto" },
        gridTemplateAreas: {
          xs: '"status" "content" "actions"',
          md: '"content status" "content actions"',
        },
        columnGap: 3,
        rowGap: 2,
      }}
    >
      <Stack spacing={2} sx={{ gridArea: "content", minWidth: 0 }}>
        <Typography variant="body1" fontWeight={700} sx={{ lineHeight: 1.4 }}>
          {item.message}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "auto minmax(0, 1fr)", sm: "70px minmax(0, 1fr)" },
            columnGap: 1.5,
            rowGap: 0.75,
            alignItems: "baseline",
          }}
        >
          <Typography variant="caption" color="text.secondary">Lien</Typography>
          <Link
            href={item.target_url}
            target="_blank"
            rel="noopener noreferrer"
            color="text.secondary"
            variant="body2"
            noWrap
          >
            {item.target_url}
          </Link>
          <Typography variant="caption" color="text.secondary">Début</Typography>
          <Typography variant="body2">
            {formatter.format(new Date(item.starts_at))}
          </Typography>
          <Typography variant="caption" color="text.secondary">Fin</Typography>
          <Typography variant="body2">
            {formatter.format(new Date(item.ends_at))}
          </Typography>
        </Box>
      </Stack>

      <Chip
        size="small"
        color={currentStatus.color}
        label={currentStatus.label}
        sx={{ gridArea: "status", justifySelf: "end" }}
      />

      <Stack
        direction="row"
        spacing={1}
        sx={{ gridArea: "actions", alignSelf: "end", justifySelf: "end" }}
      >
        <Button variant="outlined" disabled={isBusy} onClick={() => onEdit(item)}>
          Modifier
        </Button>
        <Button
          variant="outlined"
          color="error"
          disabled={isBusy}
          onClick={() => onDelete(item)}
        >
          Supprimer
        </Button>
      </Stack>
    </GlassySurface>
  );
}
