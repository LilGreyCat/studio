"use client";

import CloseIcon from "@mui/icons-material/Close";
import { Box, Dialog, IconButton } from "@mui/material";
import Image from "next/image";

import {
  lightboxCloseButtonSx,
  lightboxContentSx,
  lightboxImageSx,
  lightboxImageWrapperSx,
  lightboxPaperSx,
} from "./styles";
import type { LightboxImage } from "./types";

type ImageLightboxProps = {
  image: LightboxImage | null;
  open: boolean;
  onClose: () => void;
};

export default function ImageLightbox({
  image,
  open,
  onClose,
}: ImageLightboxProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      slotProps={{
        paper: {
          sx: lightboxPaperSx,
        },
      }}
    >
      {image && (
        <Box sx={lightboxContentSx}>
          <IconButton
            onClick={onClose}
            aria-label="Close fullscreen image"
            sx={lightboxCloseButtonSx}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={lightboxImageWrapperSx}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="100vw"
              style={lightboxImageSx}
              priority
              unoptimized={image.src.startsWith("http")}
            />
          </Box>
        </Box>
      )}
    </Dialog>
  );
}
