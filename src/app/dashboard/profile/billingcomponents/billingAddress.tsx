import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Profile {
  address: string
  city: string
  state: string
  country: string
  zip: string
}

interface Props {
  profile: Profile | null
  onEdit: () => void
}

export default function BillingAddress({ profile, onEdit }: Props) {
  return (
<Card className="h-80 flex items-center">
  <CardContent className="space-y-4 p-6 w-full">
    <div className="text-sm text-muted-foreground font-semibold">
      Billing Address
    </div>
    <div className="whitespace-pre-line text-base text-gray-800 leading-relaxed">
      {profile
        ? `${profile.address || ""}\n${profile.city || ""}, ${profile.state || ""} ${profile.zip || ""}\n${profile.country || ""}`
        : "No billing address available"}
    </div>
    <Button
      variant="outline"
      className="mt-6 w-full font-medium tracking-wide border-purple-800"
      onClick={onEdit}
    >
      Edit
    </Button>
  </CardContent>
</Card>
  )
}
