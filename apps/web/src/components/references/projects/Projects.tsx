"use client";
import { useProjects } from "@/hooks/server/projects/useProjects";
import { Box } from "@mui/material";
import Project from "./Project";

import { containerSx } from "./styles";

export default function Projects() {
  const { projects, isLoading, error } = useProjects();

  if (isLoading) {
    return <div>Chargement des projets...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box sx={containerSx}>
      {projects.map((project) => (
        <Project
          key={project.id}
          id={project.id}
          name={project.name}
          image_url={project.image_url}
        />
      ))}
    </Box>
  );
}
