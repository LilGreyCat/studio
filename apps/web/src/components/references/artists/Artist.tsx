"use client";

import { Typography } from "@mui/material";

import { GlassySurface } from "@/components/ui";
import { useArtistActions, useArtistDetails } from "@/hooks/server/artists";
import { useIntegration } from "@/hooks/server/useIntegration";
import { getImageUrl } from "@/utils/getImageUrl";
import ProjectIntegrationCard from "../projects/IntegrationCard";
import ArtistDefaultCard from "./DefaultCard";
import { artistSurfaceSx } from "./styles";

type Props = {
  id: number;
  name: string;
  imageURL: string | null;
};

export default function Artist({ id, name, imageURL }: Props) {
  const { links, integrations, isLoading, error } = useArtistDetails(id);
  const { activeIntegration, setActiveIntegration, resetIntegration } =
    useIntegration();
  const actions = useArtistActions({
    links,
    integrations,
    setActiveIntegration,
  });

  function renderContent() {
    if (isLoading) {
      return <Typography>Chargement...</Typography>;
    }

    if (error) {
      return (
        <Typography color="error">Impossible de charger l’artiste.</Typography>
      );
    }

    if (activeIntegration !== null) {
      return (
        <ProjectIntegrationCard
          name={name}
          activeIntegration={activeIntegration}
          integrations={integrations}
          onBack={resetIntegration}
        />
      );
    }

    return (
      <ArtistDefaultCard
        name={name}
        imageSrc={getImageUrl(imageURL)}
        actions={actions}
      />
    );
  }

  return <GlassySurface sx={artistSurfaceSx}>{renderContent()}</GlassySurface>;
}
