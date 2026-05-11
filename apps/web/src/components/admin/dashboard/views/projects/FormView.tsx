"use client";

import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

import { useCreateProject } from "@/hooks/server/admin/projects";
import { useImageUpload } from "@/hooks/server/admin/uploads";

type ProjectFormViewProps = {
  onCancel: () => void;
  onSuccess: () => void | Promise<void>;
};

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export default function ProjectFormView({
  onCancel,
  onSuccess,
}: ProjectFormViewProps) {
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState("");

  const [spotifyURL, setSpotifyURL] = useState("");
  const [deezerURL, setDeezerURL] = useState("");
  const [appleMusicURL, setAppleMusicURL] = useState("");
  const [soundcloudURL, setSoundcloudURL] = useState("");
  const [youtubeURL, setYoutubeURL] = useState("");

  const [spotifyEmbedURL, setSpotifyEmbedURL] = useState("");
  const [deezerEmbedURL, setDeezerEmbedURL] = useState("");
  const [appleMusicEmbedURL, setAppleMusicEmbedURL] = useState("");

  const { createFullProject, isCreating, createError } = useCreateProject({
    onSuccess,
  });

  const { isUploading, uploadError, handleFileChange } = useImageUpload({
    folder: "projects",
    onUploaded: setImageURL,
  });

  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    await createFullProject({
      project: {
        name: name.trim(),
        image_url: emptyToNull(imageURL),
      },
      links: {
        spotify_url: emptyToNull(spotifyURL),
        deezer_url: emptyToNull(deezerURL),
        apple_music_url: emptyToNull(appleMusicURL),
        soundcloud_url: emptyToNull(soundcloudURL),
        youtube_url: emptyToNull(youtubeURL),
      },
      integrations: {
        spotify_embed_url: emptyToNull(spotifyEmbedURL),
        deezer_embed_url: emptyToNull(deezerEmbedURL),
        apple_music_embed_url: emptyToNull(appleMusicEmbedURL),
      },
    });
  }

  return (
    <Stack component="form" spacing={3} onSubmit={handleSubmit}>
      <Typography variant="h4">Créer un projet</Typography>

      <TextField
        label="Nom du projet"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        fullWidth
      />

      <Button variant="outlined" component="label" disabled={isUploading}>
        {isUploading ? "Upload en cours..." : "Choisir une image"}

        <input
          hidden
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
        />
      </Button>

      <TextField
        label="Image URL"
        value={imageURL}
        fullWidth
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />

      {uploadError && <Typography color="error">{uploadError}</Typography>}

      <Typography variant="h6">Liens</Typography>

      <TextField
        label="Spotify URL"
        value={spotifyURL}
        onChange={(e) => setSpotifyURL(e.target.value)}
        fullWidth
      />
      <TextField
        label="Deezer URL"
        value={deezerURL}
        onChange={(e) => setDeezerURL(e.target.value)}
        fullWidth
      />
      <TextField
        label="Apple Music URL"
        value={appleMusicURL}
        onChange={(e) => setAppleMusicURL(e.target.value)}
        fullWidth
      />
      <TextField
        label="SoundCloud URL"
        value={soundcloudURL}
        onChange={(e) => setSoundcloudURL(e.target.value)}
        fullWidth
      />
      <TextField
        label="YouTube URL"
        value={youtubeURL}
        onChange={(e) => setYoutubeURL(e.target.value)}
        fullWidth
      />

      <Typography variant="h6">Intégrations</Typography>

      <TextField
        label="Spotify Embed URL"
        value={spotifyEmbedURL}
        onChange={(e) => setSpotifyEmbedURL(e.target.value)}
        fullWidth
      />
      <TextField
        label="Deezer Embed URL"
        value={deezerEmbedURL}
        onChange={(e) => setDeezerEmbedURL(e.target.value)}
        fullWidth
      />
      <TextField
        label="Apple Music Embed URL"
        value={appleMusicEmbedURL}
        onChange={(e) => setAppleMusicEmbedURL(e.target.value)}
        fullWidth
      />

      {createError && <Typography color="error">{createError}</Typography>}

      <Stack direction="row" spacing={2}>
        <Button type="submit" variant="contained" disabled={isCreating}>
          {isCreating ? "Création..." : "Créer"}
        </Button>

        <Button variant="outlined" onClick={onCancel} disabled={isCreating}>
          Annuler
        </Button>
      </Stack>
    </Stack>
  );
}
