"use client";

import ImageLightbox from "@/components/ui/imageLightbox/ImageLightbox";
import useImageLightbox from "@/hooks/imageLightbox/useImageLightbox";
import { useHardware } from "@/hooks/server/hardware";
import { resolveImageURL } from "@/utils/resolveImageURL";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";

import HardwareCard from "./HardwareCard";
import HardwareDescription from "./HardwareDescription";
import type { HardwareCardItem } from "./types";

export default function CardStack() {
  const { items: hardware, isLoading, error } = useHardware();
  const { image, isOpen, openImage, closeImage } = useImageLightbox();
  const items = useMemo<HardwareCardItem[]>(
    () =>
      hardware.map((item) => ({
        imageSrc: resolveImageURL(item.image_url),
        title: item.title,
        eyebrow: item.eyebrow,
        desc: <HardwareDescription value={item.description} />,
        width: item.image_width,
        height: item.image_height,
      })),
    [hardware]
  );

  const handleImageClick = useCallback(
    (item: HardwareCardItem) => {
      openImage({
        src: item.imageSrc,
        alt: item.title,
        width: item.width,
        height: item.height,
      });
    },
    [openImage]
  );

  if (isLoading) {
    return (
      <Stack alignItems="center" py={6} aria-live="polite">
        <CircularProgress size={32} />
      </Stack>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center" aria-live="polite">
        Impossible de charger le matériel.
      </Typography>
    );
  }

  if (items.length === 0) {
    return (
      <Typography color="text.secondary" textAlign="center">
        Le matériel sera bientôt présenté ici.
      </Typography>
    );
  }

  return (
    <>
      {items.map((item, index) => (
        <HardwareCard
          key={item.title}
          item={item}
          reverse={index % 2 !== 0}
          onImageClick={handleImageClick}
        />
      ))}

      <ImageLightbox image={image} open={isOpen} onClose={closeImage} />
    </>
  );
}
