"use client";

import { GlassySurface } from "@/components/ui";
import {
  createNotification,
  updateNotification,
  type Notification,
} from "@/hooks/server/admin/notifications";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState, type SubmitEvent } from "react";

type Props = {
  item?: Notification;
  onCancel: () => void;
  onSuccess: () => void | Promise<void>;
};

function localDateValue(value: string | Date): string {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function NotificationFormView({ item, onCancel, onSuccess }: Props) {
  const defaultStart = new Date();
  const defaultEnd = new Date(defaultStart.getTime() + 7 * 24 * 60 * 60 * 1000);
  const [message, setMessage] = useState(item?.message ?? "");
  const [targetURL, setTargetURL] = useState(item?.target_url ?? "");
  const [startsAt, setStartsAt] = useState(localDateValue(item?.starts_at ?? defaultStart));
  const [endsAt, setEndsAt] = useState(localDateValue(item?.ends_at ?? defaultEnd));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    const start = new Date(startsAt);
    const end = new Date(endsAt);
    if (!startsAt || !endsAt || end <= start) {
      setError("La date de fin doit être postérieure à la date de début.");
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = {
        message: message.trim(),
        target_url: targetURL.trim(),
        starts_at: start.toISOString(),
        ends_at: end.toISOString(),
      };
      if (item) await updateNotification(item.id, payload);
      else await createNotification(payload);
      await onSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Impossible d’enregistrer la notification");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Stack component="form" spacing={3} onSubmit={handleSubmit}>
      <GlassySurface sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="h4">{item ? "Modifier la notification" : "Créer une notification"}</Typography>
        <TextField
          label="Texte affiché"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required multiline minRows={2}
          slotProps={{ htmlInput: { maxLength: 500 } }}
          helperText={`${message.length}/500 caractères`}
        />
        <TextField
          label="Lien de redirection"
          type="url"
          value={targetURL}
          onChange={(event) => setTargetURL(event.target.value)}
          required
          placeholder="https://…"
          slotProps={{ htmlInput: { maxLength: 2048 } }}
          helperText="Le lien s’ouvrira dans un nouvel onglet."
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Début d’affichage"
            type="datetime-local"
            sx={dateTimeFieldSx}
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
            required fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Fin d’affichage"
            type="datetime-local"
            sx={dateTimeFieldSx}
            value={endsAt}
            onChange={(event) => setEndsAt(event.target.value)}
            required fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Les dates sont saisies dans ton fuseau horaire local (jour/mois/année et heure:minute).
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
      </GlassySurface>
      <Stack direction="row" spacing={2}>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement…" : "Enregistrer"}
        </Button>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>Annuler</Button>
      </Stack>
    </Stack>
  );
}

const dateTimeFieldSx = {
  "& input": {
    colorScheme: "dark",
  },
  "& input::-webkit-calendar-picker-indicator": {
    opacity: 0.85,
    cursor: "pointer",
  },
};
