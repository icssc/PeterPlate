"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const PLACEHOLDER_SRC = "/placeholder-event.png";

/**
 * `EventImage` renders an event's image and falls back to a default placeholder
 * when the event has no image or the image fails to load. This avoids showing a
 * blank white area for events that are missing artwork.
 *
 * @param {Omit<ImageProps, "src"> & { src: string }} props - Standard next/image
 * props; `src` may be an empty string, in which case the placeholder is used.
 */
export default function EventImage({
  src,
  alt,
  className,
  ...props
}: Omit<ImageProps, "src"> & { src: string }) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const showPlaceholder = !src?.trim() || failedSrc === src;

  return (
    <Image
      {...props}
      src={showPlaceholder ? PLACEHOLDER_SRC : src}
      alt={alt}
      className={`${className} aspect-[640/412] ${showPlaceholder ? "!object-cover" : ""}`}
      onError={() => setFailedSrc(src)}
    />
  );
}
