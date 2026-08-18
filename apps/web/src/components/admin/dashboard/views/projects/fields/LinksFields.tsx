import { Stack, TextField, Typography } from "@mui/material";
import { memo } from "react";

type ProjectLinksFieldsProps = {
  spotifyURL: string;
  deezerURL: string;
  appleMusicURL: string;
  soundcloudURL: string;
  youtubeURL: string;
  onSpotifyURLChange: (value: string) => void;
  onDeezerURLChange: (value: string) => void;
  onAppleMusicURLChange: (value: string) => void;
  onSoundcloudURLChange: (value: string) => void;
  onYoutubeURLChange: (value: string) => void;
};

function ProjectLinksFields({
  spotifyURL,
  deezerURL,
  appleMusicURL,
  soundcloudURL,
  youtubeURL,
  onSpotifyURLChange,
  onDeezerURLChange,
  onAppleMusicURLChange,
  onSoundcloudURLChange,
  onYoutubeURLChange,
}: ProjectLinksFieldsProps) {
  return (
    <>
      <Typography variant="h6">Liens</Typography>

      <Stack spacing={2}>
        <TextField
          label="Spotify URL"
          value={spotifyURL}
          onChange={(event) => onSpotifyURLChange(event.target.value)}
          fullWidth
        />

        <TextField
          label="Deezer URL"
          value={deezerURL}
          onChange={(event) => onDeezerURLChange(event.target.value)}
          fullWidth
        />

        <TextField
          label="Apple Music URL"
          value={appleMusicURL}
          onChange={(event) => onAppleMusicURLChange(event.target.value)}
          fullWidth
        />

        <TextField
          label="SoundCloud URL"
          value={soundcloudURL}
          onChange={(event) => onSoundcloudURLChange(event.target.value)}
          fullWidth
        />

        <TextField
          label="YouTube URL"
          value={youtubeURL}
          onChange={(event) => onYoutubeURLChange(event.target.value)}
          fullWidth
        />
      </Stack>
    </>
  );
}

export default memo(ProjectLinksFields);
