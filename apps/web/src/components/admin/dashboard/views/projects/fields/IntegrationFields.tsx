import { Stack, TextField, Typography } from "@mui/material";

type ProjectIntegrationsFieldsProps = {
  spotifyEmbedURL: string;
  deezerEmbedURL: string;
  appleMusicEmbedURL: string;
  onSpotifyEmbedURLChange: (value: string) => void;
  onDeezerEmbedURLChange: (value: string) => void;
  onAppleMusicEmbedURLChange: (value: string) => void;
};

export default function ProjectIntegrationsFields({
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
          label="Spotify Embed URL"
          value={spotifyEmbedURL}
          onChange={(event) => onSpotifyEmbedURLChange(event.target.value)}
          fullWidth
        />

        <TextField
          label="Deezer Embed URL"
          value={deezerEmbedURL}
          onChange={(event) => onDeezerEmbedURLChange(event.target.value)}
          fullWidth
        />

        <TextField
          label="Apple Music Embed URL"
          value={appleMusicEmbedURL}
          onChange={(event) => onAppleMusicEmbedURLChange(event.target.value)}
          fullWidth
        />
      </Stack>
    </>
  );
}
