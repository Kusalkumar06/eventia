"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/utilities/styling";

interface EventImageProps extends Omit<ImageProps, "className"> {
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
}

export default function EventImage({
  src,
  alt,
  fill,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  quality = 75,
  className,
  containerClassName,
  fallbackSrc = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
  ...props
}: EventImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        containerClassName,
        fill ? "h-full w-full" : "",
      )}
    >
      <Image
        src={imgSrc}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        quality={quality}
        onLoad={() => setIsLoading(false)}
        onError={() => setImgSrc(fallbackSrc)}
        className={cn(
          "object-cover transition-all duration-300",
          isLoading ? "scale-105 blur-sm" : "scale-100 blur-0",
          className,
        )}
        {...props}
      />
    </div>
  );
}
