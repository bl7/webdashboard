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
}

export default function BillingAddress({ profile }: Props) {
  return (
    <Card>
      <CardContent className="space-y-2 p-6">
        <div className="text-sm text-muted-foreground">Billing Address</div>
        <div className="whitespace-pre-line text-base">
          {profile
            ? `${profile.address || ""}\n${profile.city || ""}, ${profile.state || ""} ${profile.zip || ""}\n${profile.country || ""}`
            : "No billing address available"}
        </div>
        <Button variant="outline" className="mt-4">
          Edit
        </Button>
      </CardContent>
    </Card>
  )
}
