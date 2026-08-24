"use client";
import { useProjects } from "@/hooks/server/projects/useProjects";
import { Box, Typography } from "@mui/material";
import { Divider } from "@/components/ui";
import { sectionTitleSx } from "../sectionStyles";
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
        <Box
          component="section"
          aria-labelledby="featured-projects-title"
          sx={featuredSectionSx}
        >
          <Typography
            id="featured-projects-title"
            component="h2"
            sx={sectionTitleSx}
          >
            DERNIÈRES SORTIES
          </Typography>
          <Box sx={featuredContainerSx}>{renderProjects(featuredProjects)}</Box>
        </Box>
      )}

      {featuredProjects.length > 0 && regularProjects.length > 0 && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mb: 5,
          }}
        >
          <Divider />
        </Box>
      )}

      {regularProjects.length > 0 && (
        <Box
          component="section"
          aria-labelledby="regular-projects-title"
          sx={{ width: "100%" }}
        >
          <Typography
            id="regular-projects-title"
            component="h2"
            sx={sectionTitleSx}
          >
            PROJETS
          </Typography>
          <Box sx={containerSx}>{renderProjects(regularProjects)}</Box>
        </Box>
      )}
    </>
  );
}
