"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui"
import { Star, CheckCircle2 } from "lucide-react"

export const TestimonialForm = () => {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    const form = e.currentTarget
    const data = new FormData(form)
    const name = data.get("name")?.toString().trim() || ""
    const message = data.get("message")?.toString().trim() || ""

    if (!name || !message) {
      setError("Please fill in your name and testimonial.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: data.get("email")?.toString().trim() || "",
          company: data.get("company")?.toString().trim() || "",
          role: data.get("role")?.toString().trim() || "",
          rating: rating || null,
          message,
          consent: data.get("consent") === "on",
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || "Failed to submit testimonial.")
      }
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Failed to submit testimonial.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle2 className="h-14 w-14 text-green-500" />
        <h2 className="text-2xl font-semibold text-gray-900">Thank you!</h2>
        <p className="max-w-md text-gray-600">
          Your testimonial has been received. We really appreciate you taking the time to share
          your experience.
        </p>
      </div>
    )
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Your rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="p-0.5"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              <Star
                className={`h-7 w-7 transition ${
                  (hover || rating) >= n
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Name <span className="text-red-500">*</span>
        </label>
        <input name="name" type="text" className={inputClass} placeholder="Jane Smith" required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
          <input name="role" type="text" className={inputClass} placeholder="Head Chef" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Company</label>
          <input name="company" type="text" className={inputClass} placeholder="Restaurant name" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
        <input name="email" type="email" className={inputClass} placeholder="jane@example.com" />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Your testimonial <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          rows={5}
          className={inputClass}
          placeholder="Tell us about your experience with InstaLabel..."
          required
        />
      </div>

      <label className="flex items-start gap-2.5 text-sm text-gray-600">
        <input
          name="consent"
          type="checkbox"
          defaultChecked
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <span>I agree that InstaLabel may publish this testimonial on its website and marketing materials.</span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Submit testimonial"}
      </Button>
    </form>
  )
}
