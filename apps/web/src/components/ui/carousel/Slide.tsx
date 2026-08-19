import { Box, ButtonBase } from "@mui/material";
import Image from "next/image";
import { memo } from "react";

import type { StudioSlide } from "./constants";
import { slideButtonSx, slideInnerSx, slideSx } from "./styles";

type SlideProps = {
  slide: StudioSlide;
  eager?: boolean;
  onClick: (slide: StudioSlide) => void;
};

function Slide({ slide, eager = false, onClick }: SlideProps) {
  return (
    <Box sx={slideSx}>
      <ButtonBase
        onClick={() => onClick(slide)}
        aria-label={`Open image in fullscreen: ${slide.alt}`}
        sx={slideButtonSx}
      >
        <Box sx={slideInnerSx}>
          <Image
            src={`/studio/${slide.src}`}
            alt={slide.alt}
            width={slide.width}
            height={slide.height}
            sizes="100vw"
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            style={{ width: "75%", height: "auto" }}
          />
        </Box>
      </ButtonBase>
    </Box>
  );
}

export default memo(Slide);
