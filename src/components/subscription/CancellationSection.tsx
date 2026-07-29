"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import type { Subscription } from "@/app/dashboard/profile/hooks/useBillingData"

interface Props {
  subscription: Subscription | null
  cancellationRequestPending?: boolean
  onSubmitRequest: (reason: string) => Promise<boolean>
  onWithdrawRequest?: () => Promise<boolean>
  loading?: boolean
  withdrawLoading?: boolean
}

export function CancellationSection({
  subscription,
  cancellationRequestPending = false,
  onSubmitRequest,
  onWithdrawRequest,
  loading = false,
  withdrawLoading = false,
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [withdrawConfirmOpen, setWithdrawConfirmOpen] = useState(false)
  const [reason, setReason] = useState("")

  if (!subscription || subscription.status === "canceled") return null
  if (subscription.cancel_at_period_end || subscription.cancel_at) return null

  const handleSubmit = async () => {
    if (!reason.trim()) return
    const ok = await onSubmitRequest(reason)
    if (ok) {
      setIsDialogOpen(false)
      setReason("")
    }
  }

  const handleWithdraw = async () => {
    if (!onWithdrawRequest) return
    const ok = await onWithdrawRequest()
    if (ok) setWithdrawConfirmOpen(false)
  }

  if (cancellationRequestPending) {
    return (
      <>
        <AlertDialog open={withdrawConfirmOpen} onOpenChange={setWithdrawConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Withdraw cancellation request?</AlertDialogTitle>
              <AlertDialogDescription>
                Your request will be cancelled and your plan stays active. Billing continues as
                normal — nothing changes in Stripe.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={withdrawLoading}>Keep request</AlertDialogCancel>
              <Button onClick={handleWithdraw} disabled={withdrawLoading}>
                {withdrawLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Withdrawing…
                  </>
                ) : (
                  "Withdraw request"
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <section className="rounded-xl border border-zinc-200 bg-white px-5 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Cancel</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Cancellation request pending review. Nothing changes until we process it.
              </p>
            </div>
            {onWithdrawRequest && (
              <Button
                variant="outline"
                className="shrink-0"
                onClick={() => setWithdrawConfirmOpen(true)}
                disabled={withdrawLoading}
              >
                Withdraw request
              </Button>
            )}
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel subscription</DialogTitle>
            <DialogDescription>
              Tell us why you&apos;re leaving. We&apos;ll review your request within 1–2 business
              days. Your plan stays active until then.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <label htmlFor="cancel-reason" className="text-sm font-medium text-zinc-900">
                Reason *
              </label>
              <Textarea
                id="cancel-reason"
                placeholder="What made you decide to cancel?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false)
                setReason("")
              }}
              disabled={loading}
            >
              Keep subscription
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !reason.trim()} variant="outline">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit request"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <section className="rounded-xl border border-zinc-200 bg-white px-5 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Cancel</h2>
            <p className="mt-1 text-sm text-zinc-500">We&apos;ll be sad to see you go.</p>
          </div>
          <Button variant="outline" className="shrink-0" onClick={() => setIsDialogOpen(true)}>
            Cancel
          </Button>
        </div>
      </section>
    </>
  )
}
