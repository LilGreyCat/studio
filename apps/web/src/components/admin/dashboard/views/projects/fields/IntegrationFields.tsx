import { Stack, TextField, Typography } from "@mui/material";
import { memo } from "react";

type ProjectIntegrationsFieldsProps = {
  spotifyEmbedURL: string;
  deezerEmbedURL: string;
  appleMusicEmbedURL: string;
  onSpotifyEmbedURLChange: (value: string) => void;
  onDeezerEmbedURLChange: (value: string) => void;
  onAppleMusicEmbedURLChange: (value: string) => void;
};

function ProjectIntegrationsFields({
  spotifyEmbedURL,
  deezerEmbedURL,
  appleMusicEmbedURL,
  onSpotifyEmbedURLChange,
  onDeezerEmbedURLChange,
  onAppleMusicEmbedURLChange,
}: ProjectIntegrationsFieldsProps) {
  return (
    <>
      <Typography variant="h6">Intégrations</Typography>

      <Stack spacing={2}>
        <TextField
          label="Intégration Spotify"
          value={spotifyEmbedURL}
          onChange={(event) => onSpotifyEmbedURLChange(event.target.value)}
          helperText="Collez le code iframe complet fourni par Spotify."
          multiline
          minRows={2}
          fullWidth
        />

        <TextField
          label="Intégration Deezer"
          value={deezerEmbedURL}
          onChange={(event) => onDeezerEmbedURLChange(event.target.value)}
          helperText="Collez le code iframe complet fourni par Deezer."
          multiline
          minRows={2}
          fullWidth
        />

        <TextField
          label="Intégration Apple Music"
          value={appleMusicEmbedURL}
          onChange={(event) => onAppleMusicEmbedURLChange(event.target.value)}
          helperText="Collez le code iframe complet fourni par Apple Music."
          multiline
          minRows={2}
          fullWidth
        />
      </Stack>
    </>
  );
}

export default memo(ProjectIntegrationsFields);
