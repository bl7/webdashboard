"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { CheckCircle, Mail, User, Building, Phone, MessageSquare } from "lucide-react"

export const DemoRequestModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Show modal after 2 seconds on each page visit
  useEffect(() => {
    // Wait for page to fully load first, then show modal after 2 seconds
    const pageLoadTimer = setTimeout(() => {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2000)

      return () => clearTimeout(timer)
    }, 1000) // Wait 1 second for page load, then 2 seconds for modal

    return () => clearTimeout(pageLoadTimer)
  }, []) // Empty dependency array means this runs on every page visit

  // Listen for manual open event
  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true)
    }

    window.addEventListener("openDemoModal", handleOpenModal)
    return () => window.removeEventListener("openDemoModal", handleOpenModal)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.name) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/bookdemo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "",
          company: formData.company || "",
          role: "",
          message: formData.message || "",
          source: "homepage-popup",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Demo request submitted successfully! We'll contact you soon.")
        setIsSubmitted(true)
        setFormData({ name: "", email: "", company: "", phone: "", message: "" })
        // Close modal after 3 seconds on success
        setTimeout(() => {
          setIsOpen(false)
          setIsSubmitted(false)
        }, 3000)
      } else {
        toast.error(data.error || "Failed to submit demo request")
      }
    } catch (error) {
      console.error("Error submitting demo request:", error)
      toast.error("Failed to submit demo request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsSubmitted(false)
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setFormData({ name: "", email: "", company: "", phone: "", message: "" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-gray-900">Request a Demo</DialogTitle>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-8 text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h3 className="mb-2 text-xl font-bold text-gray-900">Request Received!</h3>
            <p className="mb-4 text-gray-600">
              Thank you for your interest in InstaLabel. Our team will contact you shortly to
              schedule your demo.
            </p>
            <Button onClick={resetForm} variant="outline" size="sm">
              Request Another Demo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              See InstaLabel in action! Book a free demo and discover how our kitchen labeling
              solution can streamline your operations.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    name="name"
                    placeholder="Full Name *"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    name="company"
                    placeholder="Company Name (Optional)"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  name="message"
                  placeholder="Additional Information (Optional)"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="min-h-[80px] pl-10"
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 text-white hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Request Demo"}
              </Button>
            </form>

            <p className="text-center text-xs text-gray-500">
              We'll contact you within 24 hours to schedule your demo.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
