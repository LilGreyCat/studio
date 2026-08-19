"use client";

import { GlassySurface } from "@/components/ui";
import { getAdminPrices, updateAllPrices } from "@/hooks/server/admin/prices";
import { priceKeys, toPriceMap, type PriceMap } from "@/hooks/server/prices";
import { Button, CircularProgress, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState, type ReactNode, type SubmitEvent } from "react";

const labels: Record<keyof PriceMap, string> = {
  recording: "Enregistrement — par heure",
  mixing: "Mixage — par titre",
  mastering: "Mastering — par titre",
  live_setup: "Setup live — par heure",
  live_performance: "Live — par cachet",
  single: "Formule Single",
  ep: "Formule EP — par titre",
  album: "Formule Album — par titre",
};

type Props = { onBack: () => void };

export default function AdminPricesView({ onBack }: Props) {
  const [prices, setPrices] = useState<PriceMap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void getAdminPrices()
        .then((items) => setPrices(toPriceMap(items)))
        .catch((error) => setError(error instanceof Error ? error.message : "Impossible de charger les tarifs"));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!prices) return;
    try {
      setIsSaving(true); setError(null); setSuccess(false);
      const updated = await updateAllPrices(prices);
      setPrices(toPriceMap(updated)); setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Impossible d’enregistrer les tarifs");
    } finally { setIsSaving(false); }
  }

  if (!prices && !error) return <CircularProgress />;
  if (!prices) {
    return (
      <Stack spacing={2}>
        <Button variant="outlined" onClick={onBack} sx={{ alignSelf: "flex-start" }}>Retour</Button>
        <Typography color="error">{error}</Typography>
      </Stack>
    );
  }

  return (
    <Stack component="form" spacing={3} onSubmit={handleSubmit}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
        <Typography variant="h4">Gestion des tarifs</Typography>
        <Button variant="outlined" onClick={onBack}>Retour</Button>
      </Stack>

      <GlassySurface sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Typography color="text.secondary">
          Modifie uniquement les montants affichés sur la page Tarifs.
        </Typography>
        <BoxGrid>
          {priceKeys.map((key) => (
            <TextField
              key={key}
              label={labels[key]}
              type="number"
              value={prices[key] / 100}
              onChange={(event) => {
                const euros = Number(event.target.value);
                setPrices((current) => current ? { ...current, [key]: Math.round(euros * 100) } : current);
                setSuccess(false);
              }}
              required
              slotProps={{
                htmlInput: { min: 0, max: 1000000, step: 0.01 },
                input: { endAdornment: <InputAdornment position="end">€</InputAdornment> },
              }}
            />
          ))}
        </BoxGrid>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">Tarifs enregistrés.</Typography>}
      </GlassySurface>

      <Button type="submit" variant="contained" disabled={!prices || isSaving} sx={{ alignSelf: "flex-start" }}>
        {isSaving ? "Enregistrement…" : "Enregistrer les tarifs"}
      </Button>
    </Stack>
  );
}

function BoxGrid({ children }: { children: ReactNode }) {
  return (
    <Stack
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        gap: 2,
      }}
    >
      {children}
    </Stack>
  );
}
