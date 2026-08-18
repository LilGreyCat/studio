import { Button, TextField, Typography } from "@mui/material";

type ProjectImageFieldProps = {
  mode: "create" | "edit";
  imageURL: string;
  imageFile: File | null;
  imagePreviewURL: string | null;
  isSubmitting: boolean;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ProjectImageField({
  mode,
  imageURL,
  imageFile,
  imagePreviewURL,
  isSubmitting,
  onImageChange,
}: ProjectImageFieldProps) {
  return (
    <>
      <Button variant="outlined" component="label" disabled={isSubmitting}>
        Choisir une image
        <input
          hidden
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onImageChange}
        />
      </Button>

      {imageFile && (
        <Typography>
          Image sélectionnée : <strong>{imageFile.name}</strong>
        </Typography>
      )}

      {imagePreviewURL && (
        // Local blob previews cannot benefit from Next.js image optimization.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imagePreviewURL}
          alt="Aperçu"
          style={{
            width: "100%",
            maxWidth: 360,
            borderRadius: 8,
            objectFit: "cover",
          }}
        />
      )}

      {mode === "edit" && !imageFile && imageURL && (
        <TextField
          label="Image actuelle"
          value={imageURL}
          fullWidth
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
      )}
    </>
  );
}
