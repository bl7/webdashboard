"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { CheckCircle, Mail, User, Building, Phone } from "lucide-react"

export default function WaitlistSection() {
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    company_name: "",
    phone: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

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

  if (isSubmitted) {
    return (
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8">
              <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
              <h3 className="mb-4 text-3xl font-bold text-gray-900">You're on the list!</h3>
              <p className="mb-6 text-lg text-gray-600">
                Thank you for your interest in InstaLabel. We'll be in touch soon with updates about
                our launch.
              </p>
              <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-4">
                Join Another Email
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-4xl font-bold text-gray-900">Join the Waitlist</h3>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Be among the first to experience the future of food labeling. Join our waitlist and
              get early access to InstaLabel when we launch.
            </p>
          </div>

          <Card className="mx-auto max-w-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Get Early Access</CardTitle>
              <CardDescription>
                Sign up below to be notified when InstaLabel becomes available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

              <p className="mt-4 text-center text-sm text-gray-500">
                We'll only use your information to notify you about InstaLabel updates.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
