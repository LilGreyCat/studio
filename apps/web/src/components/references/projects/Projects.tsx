"use client";
import { useProjects } from "@/hooks/server/projects/useProjects";
import { Box, Typography } from "@mui/material";
import Project from "./Project";

import { containerSx, featuredSectionSx, featuredTitleSx } from "./styles";

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

  const renderProjects = (items: typeof projects) =>
    items.map((project) => (
      <Project
        key={project.id}
        id={project.id}
        name={project.name}
        image_url={project.image_url}
      />
    ));

  return (
    <>
      {featuredProjects.length > 0 && (
        <Box component="section" aria-labelledby="featured-projects-title" sx={featuredSectionSx}>
          <Typography id="featured-projects-title" component="h2" sx={featuredTitleSx}>
            À la une
          </Typography>
          <Box sx={{ ...containerSx, mb: 0 }}>{renderProjects(featuredProjects)}</Box>
        </Box>
      )}

      {regularProjects.length > 0 && (
        <Box sx={containerSx}>{renderProjects(regularProjects)}</Box>
      )}
    </>
  );
}
