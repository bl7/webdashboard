"use client"

import { useEffect, useState } from "react"
import { cleaningToken } from "@/lib/cleaningApi"

const apiBase = () => process.env.NEXT_PUBLIC_API_URL || ""

export default function CleaningPhoto({ occurrenceId }: { occurrenceId: string }) {
  const [url, setUrl] = useState("")

  useEffect(() => {
    const token = cleaningToken()
    if (!token) return
    let objectUrl = ""
    let cancelled = false
    fetch(`${apiBase()}/cleaning/occurrences/${occurrenceId}/photo`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => (response.ok ? response.blob() : null))
      .then((blob) => {
        if (!blob || cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setUrl(objectUrl)
      })
      .catch(() => setUrl(""))
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [occurrenceId])

  if (!url) return null
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <img src={url} alt="Finished cleaning" className="h-16 w-16 rounded-md object-cover" />
    </a>
  )
}
