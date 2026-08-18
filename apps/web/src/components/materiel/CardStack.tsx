"use client";

import ImageLightbox from "@/components/ui/imageLightbox/ImageLightbox";
import useImageLightbox from "@/hooks/imageLightbox/useImageLightbox";
import { useCallback } from "react";

import HardwareCard from "./HardwareCard";
import { hardwareObj, type HardwareItem } from "./constants";

export default function CardStack() {
  const items = Object.values(hardwareObj);
  const { image, isOpen, openImage, closeImage } = useImageLightbox();

  const handleImageClick = useCallback(
    (item: HardwareItem) => {
      openImage({
        src: item.imageSrc,
        alt: item.title,
        width: item.width,
        height: item.height,
      });
    },
    [openImage]
  );

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
