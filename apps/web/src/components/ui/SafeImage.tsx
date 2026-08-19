"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "src"> & {
  src: string | null;
  fallbackSrc?: string;
};

export default function SafeImage({
  src,
  fallbackSrc = "/logo-complet.svg",
  alt,
  onError,
  ...props
}: Props) {
  const candidateSrc = src ?? fallbackSrc;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const safeSrc = failedSrc === candidateSrc ? fallbackSrc : candidateSrc;

  return (
    <Image
      {...props}
      src={safeSrc}
      alt={alt}
      unoptimized
      onError={(event) => {
        setFailedSrc(candidateSrc);
        onError?.(event);
      }}
    />
  );
}
