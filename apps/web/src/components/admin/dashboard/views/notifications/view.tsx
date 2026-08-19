"use client";

import {
  deleteNotification,
  type Notification,
  useAdminNotifications,
} from "@/hooks/server/admin/notifications";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useState } from "react";
import NotificationFormView from "./NotificationFormView";
import NotificationListItem from "./NotificationListItem";

type Props = { onBack: () => void };

export default function AdminNotificationsView({ onBack }: Props) {
  const { items, isLoading, error, refresh } = useAdminNotifications();
  const [selected, setSelected] = useState<Notification | null | undefined>(undefined);
  const [isBusy, setIsBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (selected !== undefined) {
    return <NotificationFormView item={selected ?? undefined} onCancel={() => setSelected(undefined)} onSuccess={async () => { await refresh(); setSelected(undefined); }} />;
  }

  async function handleDelete(item: Notification): Promise<void> {
    if (!window.confirm(`Supprimer la notification « ${item.message} » ?`)) return;
    try {
      setIsBusy(true); setActionError(null);
      await deleteNotification(item.id); await refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "La suppression a échoué");
    } finally { setIsBusy(false); }
  }

  return (
    <Stack spacing={4}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
        <Typography variant="h4">Gestion des notifications</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => setSelected(null)}>Créer une notification</Button>
          <Button variant="outlined" onClick={onBack}>Retour</Button>
        </Stack>
      </Stack>
      {actionError && <Typography color="error">{actionError}</Typography>}
      {isLoading ? <CircularProgress /> : error ? <Typography color="error">{error}</Typography> : items.length === 0 ? (
        <Typography>Aucune notification enregistrée.</Typography>
      ) : (
        <Stack spacing={2}>{items.map((item) => <NotificationListItem key={item.id} item={item} isBusy={isBusy} onEdit={setSelected} onDelete={(item) => void handleDelete(item)} />)}</Stack>
      )}
    </Stack>
  );
}
