"use client"

import React, { useState } from "react"

type MediaSlotProps = {
  file: string
  alt: string
  label: string
  poster?: string
}

export const MediaSlot = ({ file, alt, label, poster }: MediaSlotProps) => {
  const src = `/marketing/${file}`
  const isVideo = file.endsWith(".mp4")
  const [showVideo, setShowVideo] = useState(isVideo)
  const imageSrc = isVideo && poster ? `/marketing/${poster}` : src

  return (
    <figure className="overflow-hidden rounded-lg border border-mkt-steel1 bg-white" title={`Replace public/marketing/${file}`}>
      {showVideo ? (
        <video
          className="aspect-video w-full bg-[#142124] object-cover"
          controls
          playsInline
          preload="metadata"
          poster={poster ? `/marketing/${poster}` : undefined}
          src={src}
          onError={() => setShowVideo(false)}
        />
      ) : (
        <img src={imageSrc} alt={alt} className="aspect-video w-full object-cover" />
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
