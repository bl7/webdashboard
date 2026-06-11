"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { X, MessageSquare, Loader2 } from "lucide-react"
import type { Subscription } from "@/app/dashboard/profile/hooks/useBillingData"

interface Props {
  subscription: Subscription | null
  cancellationRequestPending?: boolean
  onSubmitRequest: (reason: string) => Promise<boolean>
  loading?: boolean
}

export function CancellationSection({
  subscription,
  cancellationRequestPending = false,
  onSubmitRequest,
  loading = false,
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [reason, setReason] = useState("")

  if (!subscription || subscription.status === "canceled") return null
  if (subscription.cancel_at_period_end || subscription.cancel_at) return null
  if (cancellationRequestPending) return null

  const handleSubmit = async () => {
    if (!reason.trim()) return
    const ok = await onSubmitRequest(reason)
    if (ok) {
      setIsDialogOpen(false)
      setReason("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <X className="h-5 w-5" />
          Request Cancellation
        </CardTitle>
        <CardDescription>
          Submit a cancellation request. We&apos;ll review it and process it within 1–2 business
          days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              Request Cancellation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Request Subscription Cancellation</DialogTitle>
              <DialogDescription>
                Please tell us why you&apos;d like to cancel. This helps us improve our service.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="cancel-reason" className="text-sm font-medium">
                  Reason for cancellation *
                </label>
                <Textarea
                  id="cancel-reason"
                  placeholder="Please provide your reason for cancelling..."
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
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !reason.trim()}
                variant="destructive"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
