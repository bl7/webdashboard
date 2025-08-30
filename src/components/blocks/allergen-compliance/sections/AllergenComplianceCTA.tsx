"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Download, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export const AllergenComplianceCTA = () => {
  const [formData, setFormData] = useState({
    email: "",
    businessName: "",
    businessType: "",
    locations: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // For now, just simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Download the HACCP guide
      const link = document.createElement("a")
      link.href = "/HACCP-Guide.pdf"
      link.download = "UK-Allergen-Compliance-Kit.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          email: "",
          businessName: "",
          businessType: "",
          locations: "",
        })
      }, 5000)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <section className="bg-gray-900 px-4 py-20 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-6 text-3xl font-bold lg:text-4xl"
        >
          Get Your Free Allergen Compliance Toolkit
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-8 text-xl text-gray-300"
        >
          Join hundreds of professional kitchens that are already compliant
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl rounded-xl border bg-white p-8 shadow-lg"
          id="allergen-compliance-form"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                Business Name *
              </Label>
              <Input
                id="businessName"
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                placeholder="Your Business Name"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessType" className="text-sm font-medium text-gray-700">
                  Business Type *
                </Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => handleInputChange("businessType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="cafe">Cafe</SelectItem>
                    <SelectItem value="pub">Pub</SelectItem>
                    <SelectItem value="takeaway">Takeaway</SelectItem>
                    <SelectItem value="catering">Catering</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="locations" className="text-sm font-medium text-gray-700">
                  Locations *
                </Label>
                <Select
                  value={formData.locations}
                  onValueChange={(value) => handleInputChange("locations", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2-5">2-5</SelectItem>
                    <SelectItem value="6+">6+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 py-3 text-lg text-white hover:bg-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Free Toolkit Now
                </>
              )}
            </Button>
            <div className="space-y-1 text-center text-xs text-gray-500">
              <p>No spam, unsubscribe anytime</p>
              <p>We respect your privacy - GDPR compliant</p>
              <p>Instant download + bonus email tips</p>
            </div>
          </form>
        </motion.div>

        {/* Success Message */}
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Download Started!</h3>
                <p className="text-sm text-green-700">
                  Your UK Allergen Compliance Kit is downloading. Check your downloads folder for
                  "UK-Allergen-Compliance-Kit.pdf"
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
