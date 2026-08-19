"use client";

import { Box, type SxProps, type Theme, Typography } from "@mui/material";

import { useArtists } from "@/hooks/server/artists";
import Artist from "./Artist";

const artistContainerSx: SxProps<Theme> = {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: 3,
  alignItems: "start",
  mb: 5,
};

export default function Artists() {
  const { artists, isLoading, error } = useArtists();

  if (isLoading) {
    return <Typography sx={{ mt: 5 }}>Chargement des artistes...</Typography>;
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 5 }}>
        Impossible de charger les artistes.
      </Typography>
    );
  }

  if (artists.length === 0) {
    return null;
  }

  return (
    <Box
      component="section"
      aria-label="Artistes"
      sx={{ width: "100%", mt: 5 }}
    >
      <Box sx={artistContainerSx}>
        {artists.map((artist) => (
          <Artist
            key={artist.id}
            id={artist.id}
            name={artist.name}
            imageURL={artist.image_url}
          />
        ))}
      </Box>
    </Box>
  );
}
