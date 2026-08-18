"use client";

import { Button, Stack, Typography } from "@mui/material";

import { GlassySurface } from "@/components/ui";

import { useProjectForm } from "@/hooks/server/admin/projects/useProjectForm";
import {
  ProjectBaseFields,
  ProjectImageField,
  ProjectIntegrationsFields,
  ProjectLinksFields,
} from "./fields";

import type { Project } from "@/hooks/server/projects/types";

type ProjectFormViewProps = {
  mode: "create" | "edit";
  project?: Project;
  onCancel: () => void;
  onSuccess: () => void | Promise<void>;
};

const SurfaceSx = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function ProjectFormView({
  mode,
  project,
  onCancel,
  onSuccess,
}: ProjectFormViewProps) {
  const form = useProjectForm({
    mode,
    project,
    onSuccess,
  });

  return (
    <Stack component="form" spacing={3} onSubmit={form.handleSubmit}>
      <Typography variant="h4">
        {mode === "create" ? "Créer un projet" : "Modifier le projet"}
      </Typography>

      <GlassySurface sx={SurfaceSx}>
        <ProjectBaseFields name={form.name} onNameChange={form.setName} />

        <ProjectImageField
          mode={mode}
          imageURL={form.imageURL}
          imageFile={form.imageFile}
          imagePreviewURL={form.imagePreviewURL}
          isSubmitting={form.isSubmitting}
          onImageChange={form.handleImageChange}
        />
      </GlassySurface>

      <GlassySurface sx={SurfaceSx}>
        <ProjectLinksFields
          spotifyURL={form.spotifyURL}
          deezerURL={form.deezerURL}
          appleMusicURL={form.appleMusicURL}
          soundcloudURL={form.soundcloudURL}
          youtubeURL={form.youtubeURL}
          onSpotifyURLChange={form.setSpotifyURL}
          onDeezerURLChange={form.setDeezerURL}
          onAppleMusicURLChange={form.setAppleMusicURL}
          onSoundcloudURLChange={form.setSoundcloudURL}
          onYoutubeURLChange={form.setYoutubeURL}
        />
      </GlassySurface>

      <GlassySurface sx={SurfaceSx}>
        <ProjectIntegrationsFields
          spotifyEmbedURL={form.spotifyEmbedURL}
          deezerEmbedURL={form.deezerEmbedURL}
          appleMusicEmbedURL={form.appleMusicEmbedURL}
          onSpotifyEmbedURLChange={form.setSpotifyEmbedURL}
          onDeezerEmbedURLChange={form.setDeezerEmbedURL}
          onAppleMusicEmbedURLChange={form.setAppleMusicEmbedURL}
        />
      </GlassySurface>

      {form.createError && (
        <Typography color="error">{form.createError}</Typography>
      )}

      {form.updateError && (
        <Typography color="error">{form.updateError}</Typography>
      )}

      <Stack direction="row" spacing={2}>
        <Button type="submit" variant="contained" disabled={form.isSubmitting}>
          {form.isSubmitting
            ? mode === "create"
              ? "Création..."
              : "Modification..."
            : mode === "create"
              ? "Créer"
              : "Enregistrer"}
        </Button>

        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={form.isSubmitting}
        >
          Annuler
        </Button>
      </Stack>
    </Stack>
  );
}
