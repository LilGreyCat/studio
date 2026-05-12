import { TextField } from "@mui/material";

type ProjectBaseFieldsProps = {
  name: string;
  onNameChange: (value: string) => void;
};

export default function ProjectBaseFields({
  name,
  onNameChange,
}: ProjectBaseFieldsProps) {
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
