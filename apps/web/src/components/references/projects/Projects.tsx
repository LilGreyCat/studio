"use client";
import { useProjects } from "@/hooks/server/projects/useProjects";
import { Box } from "@mui/material";
import Project from "./Project";

import { containerSx, featuredContainerSx, featuredSectionSx } from "./styles";

export default function Projects() {
  const { projects, isLoading, error } = useProjects();

  if (isLoading) {
    return <div>Chargement des projets...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const featuredProjects = projects.filter((project) => project.is_featured);
  const regularProjects = projects.filter((project) => !project.is_featured);

  const renderProjects = (items: typeof projects, isFeatured = false) =>
    items.map((project) => (
      <Project
        key={project.id}
        id={project.id}
        name={project.name}
        image_url={project.image_url}
        isFeatured={isFeatured}
      />
    ));

  return (
    <>
      {featuredProjects.length > 0 && (
        <Box
          component="section"
          aria-label="Dernières sorties"
          sx={featuredSectionSx}
        >
          <Box sx={featuredContainerSx}>
            {renderProjects(featuredProjects, true)}
          </Box>
        </Box>
      )}

      {regularProjects.length > 0 && (
        <Box component="section" aria-label="Projets" sx={{ width: "100%" }}>
          <Box sx={containerSx}>{renderProjects(regularProjects)}</Box>
        </Box>
      )}
    </>
  );
}
