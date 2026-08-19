"use client";

import { GlassySurface } from "@/components/ui";
import {
  createFullArtist,
  updateFullArtist,
} from "@/hooks/server/admin/artists";
import { uploadImage } from "@/hooks/server/admin/uploads/api";
import {
  getArtistIntegrations,
  getArtistLinks,
} from "@/hooks/server/artists/api";
import type { Artist } from "@/hooks/server/artists/types";
import { emptyToNull } from "@/utils/emptyToNull";
import SafeImage from "@/components/ui/SafeImage";
import { getImageUrl } from "@/utils/getImageUrl";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState, type SubmitEvent } from "react";

type Props = {
  mode: "create" | "edit";
  artist?: Artist;
  onCancel: () => void;
  onSuccess: () => void | Promise<void>;
};
const surfaceSx = { display: "flex", flexDirection: "column", gap: 2 };
const linkFields = [
  ["spotify_url", "Spotify URL"],
  ["deezer_url", "Deezer URL"],
  ["apple_music_url", "Apple Music URL"],
  ["soundcloud_url", "SoundCloud URL"],
  ["youtube_url", "YouTube URL"],
  ["instagram_url", "Instagram URL"],
  ["tiktok_url", "TikTok URL"],
] as const;
const integrationFields = [
  ["spotify_embed_url", "Spotify"],
  ["deezer_embed_url", "Deezer"],
  ["apple_music_embed_url", "Apple Music"],
] as const;

export default function ArtistFormView({
  mode,
  artist,
  onCancel,
  onSuccess,
}: Props) {
  const [name, setName] = useState(artist?.name ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [links, setLinks] = useState<Record<string, string>>({});
  const [integrations, setIntegrations] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!artist) return;
    Promise.all([getArtistLinks(artist.id), getArtistIntegrations(artist.id)])
      .then(([nextLinks, nextIntegrations]) => {
        setLinks(
          Object.fromEntries(
            linkFields.map(([key]) => [key, nextLinks[key] ?? ""])
          )
        );
        setIntegrations(
          Object.fromEntries(
            integrationFields.map(([key]) => [key, nextIntegrations[key] ?? ""])
          )
        );
      })
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Impossible de charger l’artiste"
        )
      );
  }, [artist]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      let imageURL = artist?.image_url;
      if (file) imageURL = (await uploadImage(file, "artists")).url;
      const normalizedLinks = Object.fromEntries(
        linkFields.map(([key]) => [key, emptyToNull(links[key] ?? "")])
      ) as never;
      const normalizedIntegrations = Object.fromEntries(
        integrationFields.map(([key]) => [key, emptyToNull(integrations[key] ?? "")])
      ) as never;
      if (mode === "create") {
        await createFullArtist({
          name: name.trim(), image_url: imageURL ?? null,
          links: normalizedLinks, integrations: normalizedIntegrations,
        });
      } else {
        await updateFullArtist(artist!.id, {
          artist: { name: name.trim(), ...(file ? { image_url: imageURL } : {}) },
          links: normalizedLinks, integrations: normalizedIntegrations,
        });
      }
      await onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d’enregistrer l’artiste"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Stack component="form" spacing={3} onSubmit={handleSubmit}>
      <GlassySurface sx={surfaceSx}>
        <Typography variant="h4">
          {mode === "create" ? "Ajouter un artiste" : "Modifier l’artiste"}
        </Typography>
        <TextField
          label="Nom"
          value={name}
          required
          onChange={(event) => setName(event.target.value)}
        />
        <Button variant="outlined" component="label" disabled={isSubmitting}>
          Choisir une image
          <input
            hidden
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </Button>
        {file && <Typography>{file.name}</Typography>}
        {mode === "edit" && !file && artist?.image_url && (
          <Box>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              Image actuelle
            </Typography>
            <Box
              sx={{
                position: "relative",
                width: 160,
                height: 120,
                overflow: "hidden",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <SafeImage
                src={getImageUrl(artist.image_url)}
                alt="Image actuelle de l’artiste"
                fill
                sizes="160px"
                style={{ objectFit: "cover" }}
              />
            </Box>
          </Box>
        )}
      </GlassySurface>
      <GlassySurface sx={surfaceSx}>
        <Typography variant="h6">Liens</Typography>
        {linkFields.map(([key, label]) => (
          <TextField
            key={key}
            label={label}
            value={links[key] ?? ""}
            onChange={(event) =>
              setLinks((current) => ({ ...current, [key]: event.target.value }))
            }
          />
        ))}
      </GlassySurface>
      <GlassySurface sx={surfaceSx}>
        <Typography variant="h6">Intégrations</Typography>
        {integrationFields.map(([key, provider]) => (
          <TextField
            key={key}
            label={`Intégration ${provider}`}
            value={integrations[key] ?? ""}
            onChange={(event) =>
              setIntegrations((current) => ({
                ...current,
                [key]: event.target.value,
              }))
            }
            helperText={`Collez le code iframe complet fourni par ${provider}.`}
            multiline
            minRows={2}
          />
        ))}
      </GlassySurface>
      {error && <Typography color="error">{error}</Typography>}
      <Stack direction="row" spacing={2}>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          Enregistrer
        </Button>
        <Button variant="outlined" disabled={isSubmitting} onClick={onCancel}>
          Annuler
        </Button>
      </Stack>
    </Stack>
  );
}
