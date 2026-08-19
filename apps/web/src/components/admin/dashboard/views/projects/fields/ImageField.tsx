import SafeImage from "@/components/ui/SafeImage";
import { getImageUrl } from "@/utils/getImageUrl";
import { Box, Button, Typography } from "@mui/material";
import { memo } from "react";

type ProjectImageFieldProps = {
  mode: "create" | "edit";
  imageURL: string;
  imageFile: File | null;
  imagePreviewURL: string | null;
  isSubmitting: boolean;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function ProjectImageField({
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
        <Box>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Image actuelle
          </Typography>
          <Box
            sx={{
              position: "relative",
              width: 160,
              height: 120,
              overflow: "hidden",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <SafeImage
              src={getImageUrl(imageURL)}
              alt="Image actuelle du projet"
              fill
              sizes="160px"
              style={{ objectFit: "cover" }}
            />
          </Box>
        </Box>
      )}
    </>
  );
}

export default memo(ProjectImageField);
