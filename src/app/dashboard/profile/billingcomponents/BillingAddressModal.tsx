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

interface Profile {
  address: string
  city: string
  state: string
  country: string
  zip: string
}

interface Props {
  profile: Profile | null
  open: boolean
  onClose: () => void
  onSave: (updatedProfile: Profile) => Promise<void> // async save handler
}

export default function BillingAddressModal({ profile, open, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<Profile>({
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sync form data when profile or open changes (reset form on open)
  useEffect(() => {
    if (profile && open) {
      setFormData(profile)
      setError(null)
    }
  }, [profile, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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

        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSubmit() }}>
          {error && (
            <div className="text-red-600 text-sm mb-2" role="alert">
              {error}
            </div>
          )}

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Address</span>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">City</span>
            <Input
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">State</span>
            <Input
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">ZIP Code</span>
            <Input
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Country</span>
            <Input
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </label>

          <DialogFooter className="flex justify-end gap-2 mt-6">
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
