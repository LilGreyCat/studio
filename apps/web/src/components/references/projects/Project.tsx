"use client";

import { GlassySurface } from "@/components/ui";
import { useProjectActions } from "@/hooks/server/projects";
import type {
  ProjectIntegrations,
  ProjectLinks,
} from "@/hooks/server/projects/types";
import { useIntegration } from "@/hooks/server/useIntegration";
import { getImageUrl } from "@/utils/getImageUrl";

import ProjectDefaultCard from "./DefaultCard";
import ProjectIntegrationCard from "./IntegrationCard";
import { surfaceSx } from "./styles";

type ProjectProps = {
  name: string;
  image_url: string | null;
  links: ProjectLinks;
  integrations: ProjectIntegrations;
};

export default function Project({
  name,
  image_url,
  links,
  integrations,
}: ProjectProps) {
  const imageSrc = getImageUrl(image_url);

  const { activeIntegration, setActiveIntegration, resetIntegration } =
    useIntegration();

  const actions = useProjectActions({
    links,
    integrations,
    setActiveIntegration,
  });

  function renderContent() {
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
