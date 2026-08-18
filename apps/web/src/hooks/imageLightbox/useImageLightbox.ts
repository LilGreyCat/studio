"use client";

import type { LightboxImage } from "@/components/ui/imageLightbox/types";
import { useCallback, useState } from "react";

export default function useImageLightbox() {
    const [image, setImage] = useState<LightboxImage | null>(null);

    const openImage = useCallback((nextImage: LightboxImage) => {
        setImage(nextImage);
    }, []);

    const closeImage = useCallback(() => {
        setImage(null);
    }, []);

    return {
        image,
        isOpen: image !== null,
        openImage,
        closeImage,
        lightboxProps: {
            image,
            open: image !== null,
            onClose: closeImage,
        },
    };
}
