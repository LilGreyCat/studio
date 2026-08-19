import { GlassySurface } from "@/components/ui";
import type { Notification } from "@/hooks/server/admin/notifications";
import { Button, Chip, Stack, Typography } from "@mui/material";

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
    <GlassySurface sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
        <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip size="small" color={currentStatus.color} label={currentStatus.label} />
            <Typography fontWeight={700}>{item.message}</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" noWrap>{item.target_url}</Typography>
          <Typography variant="caption" color="text.secondary">
            Du {formatter.format(new Date(item.starts_at))} au {formatter.format(new Date(item.ends_at))}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" disabled={isBusy} onClick={() => onEdit(item)}>Modifier</Button>
          <Button variant="outlined" color="error" disabled={isBusy} onClick={() => onDelete(item)}>Supprimer</Button>
        </Stack>
      </Stack>
    </GlassySurface>
  );
}
