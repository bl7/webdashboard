"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { CheckCircle, Mail, User, Building, Phone } from "lucide-react"

export const WaitlistModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    company_name: "",
    phone: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Show modal after 2 seconds on first visit (with page load delay)
  useEffect(() => {
    // Wait for page to fully load first
    const pageLoadTimer = setTimeout(() => {
      const timer = setTimeout(() => {
        if (!hasShown) {
          setIsOpen(true)
          setHasShown(true)
          // Store in localStorage to remember the user has seen it
          localStorage.setItem("waitlistModalShown", "true")
        }
      }, 2000)

      return () => clearTimeout(timer)
    }, 1000) // Wait 1 second for page load, then 2 seconds for modal

    return () => clearTimeout(pageLoadTimer)
  }, [hasShown])

  // Check if user has already seen the modal
  useEffect(() => {
    const shown = localStorage.getItem("waitlistModalShown")
    if (shown) {
      setHasShown(true)
    }
  }, [])

  // Listen for manual open event
  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true)
    }

    window.addEventListener("openWaitlistModal", handleOpenModal)
    return () => window.removeEventListener("openWaitlistModal", handleOpenModal)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.full_name) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || "Successfully joined the waitlist!")
        setIsSubmitted(true)
        setFormData({ email: "", full_name: "", company_name: "", phone: "" })
        // Close modal after 2 seconds on success
        setTimeout(() => {
          setIsOpen(false)
          setIsSubmitted(false)
        }, 2000)
      } else {
        toast.error(data.error || "Failed to join waitlist")
      }
    } catch (error) {
      console.error("Error joining waitlist:", error)
      toast.error("Failed to join waitlist. Please try again.")
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
    setFormData({ email: "", full_name: "", company_name: "", phone: "" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-gray-900">Join the Waitlist</DialogTitle>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-8 text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h3 className="mb-2 text-xl font-bold text-gray-900">You're on the list!</h3>
            <p className="mb-4 text-gray-600">
              Thank you for your interest in InstaLabel. We'll be in touch soon with updates about
              our launch.
            </p>
            <Button onClick={resetForm} variant="outline" size="sm">
              Join Another Email
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Be among the first to experience the future of food labeling. Join our waitlist and
              get early access to InstaLabel when we launch.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    name="full_name"
                    placeholder="Full Name *"
                    value={formData.full_name}
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
                    name="company_name"
                    placeholder="Company Name (Optional)"
                    value={formData.company_name}
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

              <Button
                type="submit"
                className="w-full bg-purple-600 text-white hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Joining..." : "Join the Waitlist"}
              </Button>
            </form>

            <p className="text-center text-xs text-gray-500">
              We'll only use your information to notify you about InstaLabel updates.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
