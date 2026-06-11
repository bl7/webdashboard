"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowUp, ArrowDown, Loader2, Sparkles } from "lucide-react"
import type { Subscription } from "@/app/dashboard/profile/hooks/useBillingData"
import { formatMoney, isMonthlyBilling, normalizeBillingInterval } from "@/lib/billing"

interface PlanRow {
  id: string
  name: string
  price_monthly: number
  price_yearly: number
  price_id_monthly: string
  price_id_yearly: string
  description?: string
  tier?: number
  highlight?: boolean
}

interface PendingChange {
  planId: string
  planName: string
  priceId: string
  isUpgrade: boolean
  message: string
}

interface Props {
  subscription: Subscription | null
  onChangePlan: (planId: string, priceId: string) => Promise<boolean>
  loading?: boolean
}

export function PlanTierChange({ subscription, onChangePlan, loading = false }: Props) {
  const [plans, setPlans] = useState<PlanRow[]>([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pending, setPending] = useState<PendingChange | null>(null)

  useEffect(() => {
    fetch("/api/plans/secure")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPlans(
            data.map((p: PlanRow & { stripe_price_id_monthly?: string; stripe_price_id_yearly?: string }) => ({
              ...p,
              price_id_monthly: p.price_id_monthly || p.stripe_price_id_monthly || "",
              price_id_yearly: p.price_id_yearly || p.stripe_price_id_yearly || "",
              price_monthly: Number(p.price_monthly) || 0,
              price_yearly: Number(p.price_yearly) || 0,
            }))
          )
        }
      })
      .catch(console.error)
      .finally(() => setPlansLoading(false))
  }, [])

  if (!subscription || subscription.status === "canceled") return null
  if (plansLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  const monthly = isMonthlyBilling(subscription.billing_interval)
  const currentPlanId = subscription.plan_id
  const currentTier = plans.find((p) => p.id === currentPlanId)?.tier ?? 0
  const isTrialing = subscription.status === "trialing"
  const otherPlans = plans.filter((p) => p.id !== currentPlanId)

  if (otherPlans.length === 0) return null

  const getPriceId = (plan: PlanRow) => (monthly ? plan.price_id_monthly : plan.price_id_yearly)
  const getPrice = (plan: PlanRow) => (monthly ? plan.price_monthly : plan.price_yearly)

  const openConfirm = (plan: PlanRow) => {
    const tier = plan.tier ?? 0
    const isUpgrade = tier > currentTier
    const priceId = getPriceId(plan)

    let message: string
    if (isTrialing) {
      message =
        "Your free trial will end immediately and you'll be charged for the new plan today."
    } else if (isUpgrade) {
      message =
        "This upgrade takes effect immediately. You'll be charged a prorated amount for the remainder of your billing period."
    } else {
      message = `This downgrade will take effect at the end of your current billing period (${subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : "period end"}). You'll keep your current plan until then.`
    }

    setPending({
      planId: plan.id,
      planName: plan.name,
      priceId,
      isUpgrade,
      message,
    })
    setConfirmOpen(true)
  }

  const confirmChange = async () => {
    if (!pending) return
    const ok = await onChangePlan(pending.planId, pending.priceId)
    if (ok) {
      setConfirmOpen(false)
      setPending(null)
    }
  }

  return (
    <>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending?.isUpgrade ? "Upgrade" : "Downgrade"} to {pending?.planName}?
            </AlertDialogTitle>
            <AlertDialogDescription>{pending?.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={confirmChange} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing…
                </>
              ) : pending?.isUpgrade ? (
                "Confirm upgrade"
              ) : (
                "Schedule downgrade"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Change Plan
          </CardTitle>
          <CardDescription>
            Switch between Basic and Premium on your current{" "}
            {normalizeBillingInterval(subscription.billing_interval)} billing cycle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {otherPlans.map((plan) => {
            const isUpgrade = (plan.tier ?? 0) > currentTier
            const price = getPrice(plan)
            return (
              <div
                key={plan.id}
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{plan.name}</p>
                    {plan.highlight && (
                      <Badge variant="secondary" className="text-xs">
                        Popular
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {isUpgrade ? (
                        <span className="flex items-center gap-1 text-green-700">
                          <ArrowUp className="h-3 w-3" /> Upgrade
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-orange-700">
                          <ArrowDown className="h-3 w-3" /> Downgrade
                        </span>
                      )}
                    </Badge>
                  </div>
                  {plan.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                  )}
                  <p className="mt-1 text-sm font-medium">
                    {formatMoney(price)} / {monthly ? "month" : "year"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isUpgrade
                      ? "Immediate — prorated charge today"
                      : "Scheduled — takes effect at period end"}
                  </p>
                </div>
                <Button
                  variant={isUpgrade ? "default" : "outline"}
                  onClick={() => openConfirm(plan)}
                  disabled={loading}
                  className="shrink-0"
                >
                  {isUpgrade ? "Upgrade" : "Downgrade"}
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </>
  )
}
