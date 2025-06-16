import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Edit3 } from "lucide-react"

interface Profile {
  user_id?: string
  name?: string
  email?: string
  address_line1?: string
  address_line2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  phone?: string
}

interface Props {
  profile: Profile | null
  onEdit: () => void
}

export default function BillingAddress({ profile, onEdit }: Props) {
  // Format the address properly
  const formatAddress = () => {
    if (!profile) return null

    const addressParts = []

    // Add address lines
    if (profile.address_line1?.trim()) {
      addressParts.push(profile.address_line1.trim())
    }
    if (profile.address_line2?.trim()) {
      addressParts.push(profile.address_line2.trim())
    }

    // Add city, state, postal code line
    const cityStateLine = []
    if (profile.city?.trim()) {
      cityStateLine.push(profile.city.trim())
    }
    if (profile.state?.trim()) {
      cityStateLine.push(profile.state.trim())
    }

    if (cityStateLine.length > 0) {
      let cityStateString = cityStateLine.join(", ")
      if (profile.postal_code?.trim()) {
        cityStateString += ` ${profile.postal_code.trim()}`
      }
      addressParts.push(cityStateString)
    } else if (profile.postal_code?.trim()) {
      addressParts.push(profile.postal_code.trim())
    }

    // Add country
    if (profile.country?.trim()) {
      addressParts.push(profile.country.trim())
    }

    return addressParts.length > 0 ? addressParts : null
  }

  const hasAnyAddressInfo = () => {
    if (!profile) return false
    return !!(
      profile.address_line1?.trim() ||
      profile.address_line2?.trim() ||
      profile.city?.trim() ||
      profile.state?.trim() ||
      profile.postal_code?.trim() ||
      profile.country?.trim()
    )
  }

  const addressParts = formatAddress()
  const hasAddress = hasAnyAddressInfo()

  // Loading state
  if (profile === null) {
    return (
      <Card className="flex h-80 items-center">
        <CardContent className="w-full space-y-4 p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded bg-gray-300"></div>
            <div className="h-4 w-24 animate-pulse rounded bg-gray-300"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-300"></div>
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300"></div>
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-300"></div>
          </div>
          <div className="mt-6 h-10 w-full animate-pulse rounded bg-gray-300"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex h-80 items-center shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="w-full space-y-4 p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <MapPin className="h-4 w-4" />
          Billing Address
        </div>

        <div className="flex min-h-[120px] flex-1 items-start">
          {hasAddress && addressParts ? (
            <div className="w-full text-base leading-relaxed text-gray-800">
              {addressParts.map((line, index) => (
                <div key={index} className="mb-1 last:mb-0">
                  {line}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-center">
              <MapPin className="mb-2 h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-500">No billing address added</div>
              <div className="mt-1 text-xs text-gray-400">
                Add your address for billing purposes
              </div>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          className="mt-6 w-full border-purple-200 font-medium tracking-wide text-purple-700 transition-colors hover:border-purple-300 hover:bg-purple-50 hover:text-purple-800"
          onClick={onEdit}
        >
          <Edit3 className="mr-2 h-4 w-4" />
          {hasAddress ? "Edit Address" : "Add Address"}
        </Button>
      </CardContent>
    </Card>
  )
}
