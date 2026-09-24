import React from "react"
import { MobileAppHero } from "./sections/MobileAppHero"
import { MobileAppBody } from "./sections/MobileAppBody"
import { ShotStrip } from "@/components/marketing/MediaSlot"

export const MobileAppPage = () => {
  return (
    <>
      <MobileAppHero />
      <ShotStrip
        shots={[
          {
            file: "android-print.mp4",
            poster: "rw411b.png",
            alt: "Android app printing to a MUNBYN RW411B",
            label: "MUNBYN RW411B. Replace this clip with that printer.",
          },
          {
            file: "db403-print.mp4",
            poster: "db403.png",
            alt: "Android app printing to a Born4Ship DB403",
            label: "Born4Ship DB403. Replace this clip with that printer.",
          },
        ]}
      />
      <MobileAppBody />
    </>
  )
}
