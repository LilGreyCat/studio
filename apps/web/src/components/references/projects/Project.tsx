"use client";

import { Typography } from "@mui/material";

import { GlassySurface } from "@/components/ui";
import { useProjectActions, useProjectDetails } from "@/hooks/server/projects";
import { useIntegration } from "@/hooks/server/useIntegration";
import { getImageUrl } from "@/utils/getImageUrl";

import ProjectDefaultCard from "./DefaultCard";
import ProjectIntegrationCard from "./IntegrationCard";
import { surfaceSx } from "./styles";

type ProjectProps = {
  id: number;
  name: string;
  image_url: string | null;
};

export default function Project({ id, name, image_url }: ProjectProps) {
  const imageSrc = getImageUrl(image_url);

  const { links, integrations, isLoading, error } = useProjectDetails(id);

  const { activeIntegration, setActiveIntegration, resetIntegration } =
    useIntegration();

  const actions = useProjectActions({
    links,
    integrations,
    setActiveIntegration,
  });

  function renderContent() {
    if (isLoading) {
      return <Typography>Chargement...</Typography>;
    }

    if (error) {
      return <Typography>{error}</Typography>;
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
      <ProjectDefaultCard name={name} imageSrc={imageSrc} actions={actions} />
    );
  }

  return <GlassySurface sx={surfaceSx}>{renderContent()}</GlassySurface>;
}
