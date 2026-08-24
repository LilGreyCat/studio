import { FormControlLabel, Switch, TextField } from "@mui/material";
import { memo } from "react";

type ProjectBaseFieldsProps = {
  name: string;
  onNameChange: (value: string) => void;
  isFeatured: boolean;
  onFeaturedChange: (value: boolean) => void;
};

function ProjectBaseFields({
  name,
  onNameChange,
  isFeatured,
  onFeaturedChange,
}: ProjectBaseFieldsProps) {
  return (
    <>
      <TextField
        label="Nom du projet"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        required
        fullWidth
      />
      <FormControlLabel
        control={
          <Switch
            checked={isFeatured}
            onChange={(event) => onFeaturedChange(event.target.checked)}
          />
        }
        label="Mettre ce projet en avant sur la page Références"
      />
    </>
  );
}

export default memo(ProjectBaseFields);
