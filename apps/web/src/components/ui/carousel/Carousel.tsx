"use client";

import ImageLightbox from "@/components/ui/imageLightbox/ImageLightbox";
import useCarousel from "@/hooks/carousel/useCarousel";
import useImageLightbox from "@/hooks/imageLightbox/useImageLightbox";
import { useCallback } from "react";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, IconButton } from "@mui/material";

import GlassySurface from "../GlassySurface";
import { studioSlides, type StudioSlide } from "./constants";
import Dot from "./Dot";
import Slide from "./Slide";
import {
  containerSx,
  controlsRowSx,
  dotsSx,
  rootSx,
  viewportSx,
  viewportWrapperSx,
} from "./styles";

export default function Carousel() {
  const {
    emblaRef,
    selectedIndex,
    scrollSnaps,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
    scrollTo,
  } = useCarousel();

  const { image, isOpen, openImage, closeImage } = useImageLightbox();

  const handleSlideClick = useCallback(
    (slide: StudioSlide) => {
      openImage({
        src: `/studio/${slide.src}`,
        alt: slide.alt,
        width: slide.width,
        height: slide.height,
      });
    },
    [openImage]
  );

  return (
    <>
      <GlassySurface sx={rootSx}>
        <Box sx={viewportWrapperSx}>
          <Box ref={emblaRef} sx={viewportSx}>
            <Box sx={containerSx}>
              {studioSlides.map((slide, index) => (
                <Slide
                  key={slide.src}
                  slide={slide}
                  eager={index === 0}
                  onClick={handleSlideClick}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={controlsRowSx}>
          <IconButton
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous slide"
          >
            <ChevronLeftIcon />
          </IconButton>

          <Box sx={dotsSx}>
            {scrollSnaps.map((_, index) => (
              <Dot
                key={index}
                index={index}
                selectedIndex={selectedIndex}
                scrollTo={scrollTo}
              />
            ))}
          </Box>

          <IconButton
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next slide"
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </GlassySurface>

      <ImageLightbox image={image} open={isOpen} onClose={closeImage} />
    </>
  );
}
