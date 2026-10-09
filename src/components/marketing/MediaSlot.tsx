"use client"

import React, { useState } from "react"

type MediaSlotProps = {
  file: string
  alt: string
  label: string
  poster?: string
  fit?: "cover" | "contain"
}

export const MediaSlot = ({ file, alt, label, poster, fit = "cover" }: MediaSlotProps) => {
  const src = `/marketing/${file}?v=20260930e`
  const isVideo = file.endsWith(".mp4")
  const [showVideo, setShowVideo] = useState(isVideo)
  const posterSrc = poster ? `/marketing/${poster}?v=20260930e` : undefined
  const imageSrc = isVideo && posterSrc ? posterSrc : src

  return (
    <figure className="overflow-hidden rounded-lg border border-mkt-steel1 bg-white" title={`Replace public/marketing/${file}`}>
      {showVideo ? (
        <video
          className="aspect-video w-full bg-[#142124] object-cover object-top"
          controls
          playsInline
          preload="metadata"
          poster={posterSrc}
          src={src}
          onError={() => setShowVideo(false)}
        />
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          className={
            fit === "contain"
              ? "max-h-[32rem] w-full bg-mkt-canvas object-contain"
              : "aspect-video w-full object-cover object-top"
          }
        />
      )}
      <figcaption className="border-t border-mkt-steel1 px-3 py-2 text-xs leading-relaxed text-mkt-steel">
        {label}
      </figcaption>
    </figure>
  )
}

export const ShotStrip = ({
  title,
  shots,
}: {
  title?: string
  shots: MediaSlotProps[]
}) => (
  <section className="bg-white px-4 py-12 sm:px-6 md:px-12 lg:px-16">
    <div className="container mx-auto max-w-6xl">
      {title ? (
        <h2 className="mb-6 text-2xl font-black tracking-tight text-mkt-ink sm:text-3xl">{title}</h2>
      ) : null}
      <div
        className={`grid gap-4 ${shots.length > 2 ? "sm:grid-cols-2 lg:grid-cols-3" : shots.length > 1 ? "md:grid-cols-2" : ""}`}
      >
        {shots.map((shot) => (
          <MediaSlot key={shot.file} {...shot} />
        ))}
      </div>
    </div>
  </section>
)
