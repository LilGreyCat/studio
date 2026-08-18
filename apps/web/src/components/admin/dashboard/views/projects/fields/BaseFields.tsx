import { TextField } from "@mui/material";
import { memo } from "react";

type ProjectBaseFieldsProps = {
  name: string;
  onNameChange: (value: string) => void;
};

function ProjectBaseFields({ name, onNameChange }: ProjectBaseFieldsProps) {
  return (
    <TextField
      label="Nom du projet"
      value={name}
      onChange={(event) => onNameChange(event.target.value)}
      required
      fullWidth
    />
  );
}

export default memo(ProjectBaseFields);
