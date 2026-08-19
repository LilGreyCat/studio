"use client";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useState } from "react";
import {
  deleteArtist,
  reorderArtists,
  updateArtist,
  useAdminArtists,
} from "@/hooks/server/admin/artists";
import type { Artist } from "@/hooks/server/artists/types";
import ArtistFormView from "./ArtistFormView";
import ArtistListItem from "./ArtistListItem";

type Props = { onBack: () => void };
export default function AdminArtistsView({ onBack }: Props) {
  const { artists, isLoading, error, refresh } = useAdminArtists();
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [selected, setSelected] = useState<Artist>();
  const [isBusy, setIsBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const close = () => {
    setMode("list");
    setSelected(undefined);
  };
  const success = async () => {
    await refresh();
    close();
  };
  async function run(action: () => Promise<unknown>) {
    try {
      setIsBusy(true);
      setActionError(null);
      await action();
      await refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "L’action a échoué");
    } finally {
      setIsBusy(false);
    }
  }
  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= artists.length) return;
    const reordered = [...artists];
    [reordered[index], reordered[target]] = [
      reordered[target],
      reordered[index],
    ];
    await run(() => reorderArtists(reordered.map(({ id }) => id)));
  }
  async function remove(artist: Artist) {
    if (window.confirm(`Supprimer « ${artist.name} » ?`))
      await run(() => deleteArtist(artist.id));
  }
  if (mode !== "list")
    return (
      <ArtistFormView
        mode={mode}
        artist={selected}
        onCancel={close}
        onSuccess={success}
      />
    );
  return (
    <Stack spacing={4}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Typography variant="h4">Gestion des artistes</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => setMode("create")}>
            Ajouter un artiste
          </Button>
          <Button variant="outlined" onClick={onBack}>
            Retour
          </Button>
        </Stack>
      </Stack>
      {actionError && <Typography color="error">{actionError}</Typography>}
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : artists.length === 0 ? (
        <Typography>Aucun artiste enregistré.</Typography>
      ) : (
        <Stack spacing={2}>
          {artists.map((artist, index) => (
            <ArtistListItem
              key={artist.id}
              artist={artist}
              index={index}
              count={artists.length}
              isBusy={isBusy}
              onMove={move}
              onEdit={(item) => {
                setSelected(item);
                setMode("edit");
              }}
              onToggle={(item) =>
                run(() =>
                  updateArtist(item.id, { is_visible: !item.is_visible })
                ).then(() => undefined)
              }
              onDelete={remove}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
