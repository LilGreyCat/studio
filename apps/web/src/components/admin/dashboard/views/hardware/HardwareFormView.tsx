"use client";

import {
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, useEffect, useState } from "react";

import {
  createHardware,
  type CreateHardwarePayload,
  type HardwareItem,
  type UpdateHardwarePayload,
  updateHardware,
} from "@/hooks/server/admin/hardware";
import { uploadImage } from "@/hooks/server/admin/uploads/api";

import {
  readImageDimensions,
  resolveHardwareImageURL,
  slugifyHardwareTitle,
} from "./utils";

type Props = {
  mode: "create" | "edit";
  item?: HardwareItem;
  onCancel: () => void;
  onSuccess: () => void | Promise<void>;
};

export default function HardwareFormView({
  mode,
  item,
  onCancel,
  onSuccess,
}: Props) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [eyebrow, setEyebrow] = useState(item?.eyebrow ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [isVisible, setIsVisible] = useState(item?.is_visible ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewURL, setImagePreviewURL] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState(item?.image_width ?? 0);
  const [imageHeight, setImageHeight] = useState(item?.image_height ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreviewURL) {
        URL.revokeObjectURL(imagePreviewURL);
      }
    };
  }, [imagePreviewURL]);

  function handleTitleChange(value: string): void {
    setTitle(value);
    if (!slugEdited) {
      setSlug(slugifyHardwareTitle(value));
    }
  }

  async function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      setError(null);
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("L’image doit peser au maximum 5 Mo");
      }
      const dimensions = await readImageDimensions(file);
      setImageFile(file);
      setImageWidth(dimensions.width);
      setImageHeight(dimensions.height);
      setImagePreviewURL(URL.createObjectURL(file));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossible de lire cette image"
      );
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    setError(null);

    if (mode === "create" && imageFile === null) {
      setError("Une image est obligatoire pour créer un matériel");
      return;
    }
    if (!slug) {
      setError("Le slug ne peut pas être vide");
      return;
    }

    try {
      setIsSubmitting(true);
      let uploadedImageURL: string | null = null;
      if (imageFile) {
        uploadedImageURL = (await uploadImage(imageFile, "hardware")).url;
      }

      const commonPayload = {
        slug,
        eyebrow,
        title,
        description,
        is_visible: isVisible,
      };

      if (mode === "create") {
        const payload: CreateHardwarePayload = {
          ...commonPayload,
          image_url: uploadedImageURL as string,
          image_width: imageWidth,
          image_height: imageHeight,
        };
        await createHardware(payload);
      } else if (item) {
        const payload: UpdateHardwarePayload = { ...commonPayload };
        if (uploadedImageURL) {
          payload.image_url = uploadedImageURL;
          payload.image_width = imageWidth;
          payload.image_height = imageHeight;
        }
        await updateHardware(item.id, payload);
      }

      await onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d’enregistrer le matériel"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentImageURL =
    imagePreviewURL ?? (item ? resolveHardwareImageURL(item.image_url) : null);

  return (
    <Stack component="form" spacing={3} onSubmit={handleSubmit}>
      <Typography variant="h4">
        {mode === "create" ? "Ajouter un matériel" : "Modifier le matériel"}
      </Typography>

      <TextField
        label="Titre"
        value={title}
        required
        inputProps={{ maxLength: 160 }}
        onChange={(event) => handleTitleChange(event.target.value)}
      />
      <TextField
        label="Slug"
        value={slug}
        required
        inputProps={{ maxLength: 80, pattern: "[a-z0-9]+(-[a-z0-9]+)*" }}
        helperText="Identifiant technique unique, généré automatiquement depuis le titre."
        onChange={(event) => {
          setSlugEdited(true);
          setSlug(slugifyHardwareTitle(event.target.value));
        }}
      />
      <TextField
        label="Catégorie courte"
        value={eyebrow}
        required
        inputProps={{ maxLength: 80 }}
        onChange={(event) => setEyebrow(event.target.value)}
      />
      <TextField
        label="Description"
        value={description}
        required
        multiline
        minRows={7}
        inputProps={{ maxLength: 10000 }}
        helperText="Utilisez **texte** pour conserver une partie en gras."
        onChange={(event) => setDescription(event.target.value)}
      />

      <FormControlLabel
        control={
          <Switch
            checked={isVisible}
            onChange={(event) => setIsVisible(event.target.checked)}
          />
        }
        label="Visible sur la page Matériel"
      />

      <Button variant="outlined" component="label" disabled={isSubmitting}>
        {mode === "create" ? "Choisir une image" : "Remplacer l’image"}
        <input
          hidden
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
        />
      </Button>

      {imageFile && (
        <Typography>
          {imageFile.name} — {imageWidth} × {imageHeight}px
        </Typography>
      )}

      {currentImageURL && (
        // Blob and authenticated API image previews are intentionally unoptimized.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentImageURL}
          alt="Aperçu du matériel"
          style={{
            width: "100%",
            maxWidth: 420,
            maxHeight: 320,
            borderRadius: 8,
            objectFit: "cover",
          }}
        />
      )}

      {error && <Typography color="error">{error}</Typography>}

      <Stack direction="row" spacing={2}>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <Button variant="outlined" disabled={isSubmitting} onClick={onCancel}>
          Annuler
        </Button>
      </Stack>
    </Stack>
  );
}
