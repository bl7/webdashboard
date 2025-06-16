import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Profile } from "../hooks/useBillingData"

interface Props {
  profile: Profile | null
  open: boolean
  onClose: () => void
  onSave: (updatedProfile: Profile) => Promise<void> // async save handler
}

export default function BillingAddressModal({ profile, open, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<Profile>({
    name: "",
    email: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sync form data when profile or open changes (reset form on open)
  useEffect(() => {
    if (open) {
      if (profile) {
        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          address_line1: profile.address_line1 || "",
          address_line2: profile.address_line2 || "",
          city: profile.city || "",
          state: profile.state || "",
          postal_code: profile.postal_code || "",
          country: profile.country || "",
          phone: profile.phone || "",
          user_id: profile.user_id,
        })
      }
      setError(null)
    }
  }, [profile, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      await onSave(formData) // await async save
      onClose() // close dialog on success
    } catch (err) {
      setError("Failed to save billing address. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Billing Address</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          {error && (
            <div className="mb-2 text-sm text-red-600" role="alert">
              {error}
            </div>
          )}

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Full Name</span>
            <Input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <Input
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Address Line 1</span>
            <Input
              name="address_line1"
              value={formData.address_line1 || ""}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Address Line 2 (Optional)</span>
            <Input
              name="address_line2"
              value={formData.address_line2 || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">City</span>
              <Input
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">State</span>
              <Input
                name="state"
                value={formData.state || ""}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Postal Code</span>
              <Input
                name="postal_code"
                value={formData.postal_code || ""}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Country</span>
              <Input
                name="country"
                value={formData.country || ""}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Phone (Optional)</span>
            <Input
              name="phone"
              type="tel"
              value={formData.phone || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </label>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
