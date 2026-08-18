"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

type Props = Omit<ImageProps, "src"> & {
  src: string | null;
  fallbackSrc?: string;
};

export default function SafeImage({
  src,
  fallbackSrc = "/logo2.svg",
  alt,
  ...props
}: Props) {
  const [safeSrc, setSafeSrc] = useState<string>(fallbackSrc);

  useEffect(() => {
    let cancelled = false;
    const candidateSrc = src ?? fallbackSrc;

    const img = new window.Image();

    img.onload = () => {
      if (!cancelled) {
        setSafeSrc(candidateSrc);
      }
    };

    img.onerror = () => {
      if (!cancelled) {
        setSafeSrc(fallbackSrc);
      }
    };

    img.src = candidateSrc;

    return () => {
      cancelled = true;
    };
  }, [src, fallbackSrc]);

  return <Image {...props} src={safeSrc} alt={alt} unoptimized />;
}
