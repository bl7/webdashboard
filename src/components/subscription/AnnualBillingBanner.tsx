"use client"

import { useState } from "react"
import { Gift, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Subscription } from "@/app/dashboard/profile/hooks/useBillingData"
import { isMonthlyBilling } from "@/lib/billing"

interface Props {
  subscription: Subscription | null
  onUpgrade: () => Promise<boolean>
  loading?: boolean
}

export function AnnualBillingBanner({ subscription, onUpgrade, loading = false }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!subscription) return null
  if (subscription.status === "canceled") return null
  if (subscription.cancel_at_period_end || subscription.cancel_at) return null
  if (subscription.pending_plan_interval || subscription.pending_price_id) return null
  if (!isMonthlyBilling(subscription.billing_interval)) return null

  const handleConfirm = async () => {
    const ok = await onUpgrade()
    if (ok) setConfirmOpen(false)
  }

  return (
    <>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch to annual billing?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ll be credited for unused monthly time and charged for the annual plan
              immediately (proration applies). You can switch back to monthly at the end of the
              annual period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep monthly</AlertDialogCancel>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Switch to annual"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col gap-3 rounded-lg border border-emerald-800/20 bg-emerald-950 px-4 py-3 text-emerald-50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Gift className="h-4 w-4 shrink-0 text-emerald-300" />
          <span>Switch to annual billing and save on your plan</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 border-0 bg-white text-emerald-950 hover:bg-emerald-50"
          onClick={() => setConfirmOpen(true)}
          disabled={loading}
        >
          Upgrade Now
        </Button>
      </div>
    </>
  )
}
