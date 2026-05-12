"use client";

import { Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import {
  useCreateProject,
  useUpdateProject,
} from "@/hooks/server/admin/projects";
import {
  useProjectIntegrations,
  useProjectLinks,
} from "@/hooks/server/projects";
import type { Project } from "@/hooks/server/projects/types";

type ProjectFormViewProps = {
  mode: "create" | "edit";
  project?: Project;
  onCancel: () => void;
  onSuccess: () => void | Promise<void>;
};

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export default function ProjectFormView({
  mode,
  project,
  onCancel,
  onSuccess,
}: ProjectFormViewProps) {
  const [name, setName] = useState(project?.name ?? "");
  const [imageURL, setImageURL] = useState(project?.image_url ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [spotifyURL, setSpotifyURL] = useState("");
  const [deezerURL, setDeezerURL] = useState("");
  const [appleMusicURL, setAppleMusicURL] = useState("");
  const [soundcloudURL, setSoundcloudURL] = useState("");
  const [youtubeURL, setYoutubeURL] = useState("");

  const [spotifyEmbedURL, setSpotifyEmbedURL] = useState("");
  const [deezerEmbedURL, setDeezerEmbedURL] = useState("");
  const [appleMusicEmbedURL, setAppleMusicEmbedURL] = useState("");

  const editProjectId = mode === "edit" ? (project?.id ?? null) : null;

  const { links } = useProjectLinks(editProjectId);
  const { integrations } = useProjectIntegrations(editProjectId);

  const { createFullProject, isCreating, createError } = useCreateProject({
    onSuccess,
  });

  const { handleUpdate, isUpdating, updateError } = useUpdateProject({
    onSuccess,
  });

  const imagePreviewURL = useMemo(() => {
    if (imageFile === null) {
      return null;
    }

    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    return () => {
      if (imagePreviewURL !== null) {
        URL.revokeObjectURL(imagePreviewURL);
      }
    };
  }, [imagePreviewURL]);

  useEffect(() => {
    if (mode !== "edit" || !links) {
      return;
    }

    setSpotifyURL(links.spotify_url ?? "");
    setDeezerURL(links.deezer_url ?? "");
    setAppleMusicURL(links.apple_music_url ?? "");
    setSoundcloudURL(links.soundcloud_url ?? "");
    setYoutubeURL(links.youtube_url ?? "");
  }, [mode, links]);

  useEffect(() => {
    if (mode !== "edit" || !integrations) {
      return;
    }

    setSpotifyEmbedURL(integrations.spotify_embed_url ?? "");
    setDeezerEmbedURL(integrations.deezer_embed_url ?? "");
    setAppleMusicEmbedURL(integrations.apple_music_embed_url ?? "");
  }, [mode, integrations]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);

    event.target.value = "";
  }

  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (mode === "edit" && project) {
      await handleUpdate(project.id, {
        project: {
          name: name.trim(),
          image_url: emptyToNull(imageURL),
        },
        links: getLinksPayload(),
        integrations: getIntegrationsPayload(),
        imageFile,
      });

      return;
    }

    await createFullProject({
      project: {
        name: name.trim(),
        image_url: null,
      },
      links: getLinksPayload(),
      integrations: getIntegrationsPayload(),
      imageFile,
    });
  }

  function getLinksPayload() {
    return {
      spotify_url: emptyToNull(spotifyURL),
      deezer_url: emptyToNull(deezerURL),
      apple_music_url: emptyToNull(appleMusicURL),
      soundcloud_url: emptyToNull(soundcloudURL),
      youtube_url: emptyToNull(youtubeURL),
    };
  }

  function getIntegrationsPayload() {
    return {
      spotify_embed_url: emptyToNull(spotifyEmbedURL),
      deezer_embed_url: emptyToNull(deezerEmbedURL),
      apple_music_embed_url: emptyToNull(appleMusicEmbedURL),
    };
  }

  return (
    <Stack component="form" spacing={3} onSubmit={handleSubmit}>
      <Typography variant="h4">
        {mode === "create" ? "Créer un projet" : "Modifier le projet"}
      </Typography>

      <TextField
        label="Nom du projet"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        fullWidth
      />

      <Button variant="outlined" component="label" disabled={isSubmitting}>
        Choisir une image
        <input
          hidden
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
        />
      </Button>

      {imageFile && (
        <Typography>
          Image sélectionnée : <strong>{imageFile.name}</strong>
        </Typography>
      )}

      {imagePreviewURL && (
        <img
          src={imagePreviewURL}
          alt="Aperçu"
          style={{
            width: "100%",
            maxWidth: 360,
            borderRadius: 8,
            objectFit: "cover",
          }}
        />
      )}

      {mode === "edit" && !imageFile && imageURL && (
        <TextField
          label="Image actuelle"
          value={imageURL}
          fullWidth
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
      )}

      <Typography variant="h6">Liens</Typography>

      <TextField
        label="Spotify URL"
        value={spotifyURL}
        onChange={(event) => setSpotifyURL(event.target.value)}
        fullWidth
      />

      <TextField
        label="Deezer URL"
        value={deezerURL}
        onChange={(event) => setDeezerURL(event.target.value)}
        fullWidth
      />

      <TextField
        label="Apple Music URL"
        value={appleMusicURL}
        onChange={(event) => setAppleMusicURL(event.target.value)}
        fullWidth
      />

      <TextField
        label="SoundCloud URL"
        value={soundcloudURL}
        onChange={(event) => setSoundcloudURL(event.target.value)}
        fullWidth
      />

      <TextField
        label="YouTube URL"
        value={youtubeURL}
        onChange={(event) => setYoutubeURL(event.target.value)}
        fullWidth
      />

      <Typography variant="h6">Intégrations</Typography>

      <TextField
        label="Spotify Embed URL"
        value={spotifyEmbedURL}
        onChange={(event) => setSpotifyEmbedURL(event.target.value)}
        fullWidth
      />

      <TextField
        label="Deezer Embed URL"
        value={deezerEmbedURL}
        onChange={(event) => setDeezerEmbedURL(event.target.value)}
        fullWidth
      />

      <TextField
        label="Apple Music Embed URL"
        value={appleMusicEmbedURL}
        onChange={(event) => setAppleMusicEmbedURL(event.target.value)}
        fullWidth
      />

      {createError && <Typography color="error">{createError}</Typography>}
      {updateError && <Typography color="error">{updateError}</Typography>}

      <Stack direction="row" spacing={2}>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "create"
              ? "Création..."
              : "Modification..."
            : mode === "create"
              ? "Créer"
              : "Enregistrer"}
        </Button>

        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
          Annuler
        </Button>
      </Stack>
    </Stack>
  );
}
