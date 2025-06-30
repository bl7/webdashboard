"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, 
  Loader2, 
  X, 
  AlertTriangle, 
  Info, 
  Crown, 
  Calendar,
  CreditCard,
  Shield,
  Zap,
  Users,
  Database,
  Clock,
  ArrowRight,
  ArrowDown,
  RefreshCw,
  AlertCircle,
  Star,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import clsx from "clsx"

interface PlanConfig {
  id: string
  name: string
  monthly: string
  yearly: string

  price_id_monthly: string | null
  price_id_yearly: string | null
  features: Record<string, boolean | string>
  description: string
  highlight: boolean
  cta: string
  tier: number
  monthlyValue: number
  yearlyValue: number
}

type ChangeType = "upgrade" | "downgrade" | "same" | "billing_change"
type SubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "trialing"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
type BillingPeriod = "monthly" | "yearly"

type OnUpdateFn = (planId: string | null, priceId: string | null) => Promise<any>;

interface Props {
  userid: string
  currentPlan: string
  currentBillingPeriod?: BillingPeriod
  subscriptionStatus?: SubscriptionStatus
  nextBillingDate?: string
  subscriptionData?: any
  onClose: () => void
  onUpdate: OnUpdateFn
}

export default function PlanSelectionModal({
  userid,
  currentPlan,
  currentBillingPeriod = "monthly",
  subscriptionStatus = "active",
  nextBillingDate,
  subscriptionData,
  onClose,
  onUpdate,
}: Props) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(currentBillingPeriod)
  const [selectedPlan, setSelectedPlan] = useState<{ planId: string; interval: BillingPeriod } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [backendMessage, setBackendMessage] = useState<string | null>(null)
  const [plans, setPlans] = useState<PlanConfig[]>([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [plansError, setPlansError] = useState<string | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelMessage, setCancelMessage] = useState<string | null>(null)
  const [pendingPlan, setPendingPlan] = useState<PlanConfig | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState<'plans' | 'billing' | 'usage'>('plans')
  const [confirmMessage, setConfirmMessage] = useState<any>(null)

  // Enhanced plan data structure for better display
  const planFeatureIcons = {
    'users': Users,
    'storage': Database,
    'support': Shield,
    'api': Zap,
    'analytics': TrendingUp,
    'integrations': RefreshCw,
    'priority': Star
  }

  // Fetch plans from API
  useEffect(() => {
    setPlansLoading(true)
    setPlansError(null)
    fetch('/api/plans/secure')
      .then(res => res.json())
      .then(data => {
        // Use backend tier directly
        setPlans(data.map((plan: any) => ({
          ...plan,
          id: String(plan.id),
          tier: typeof plan.tier === 'number' ? plan.tier : parseInt(plan.tier, 10) || 0,
        })));
        setPlansLoading(false)
      })
      .catch(err => {
        setPlansError('Failed to load plans')
        setPlansLoading(false)
      })
  }, [])

  // Helper functions (preserved from original)
  const getPlanInfo = (planId: string, plans: PlanConfig[]) => {
    const planConfig = plans.find((p) => p.id === planId)
    return {
      id: planId,
      config: planConfig,
      isValid: !!planConfig,
      originalPlanId: planId,
    }
  }

  const getEffectiveMonthlyValue = (plan: PlanConfig, billingPeriod: BillingPeriod): number => {
    if (!plan) return 0
    if (billingPeriod === "monthly") {
      return typeof plan.monthlyValue === 'number' ? plan.monthlyValue : parseFloat(plan.monthly?.replace(/[^\d.]/g, "") || "0")
    } else {
      return typeof plan.yearlyValue === 'number' ? plan.yearlyValue / 12 : parseFloat(plan.yearly?.replace(/[^\d.]/g, "") || "0") / 12
    }
  }

  const findPlan = useCallback((planId: string): PlanConfig | undefined => {
    return plans.find((p) => p.id === planId)
  }, [plans])

  // Set selectedPlan to current plan and interval only if it is null when plans are loaded or modal opens
  useEffect(() => {
    if (!plans.length) return;
    setSelectedPlan(prev => prev ?? { planId: String(currentPlan), interval: billingPeriod });
  }, [plans, currentPlan, billingPeriod]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const email = localStorage.getItem("email")
        setUserEmail(email)
      } catch (err) {
        console.warn("Failed to access localStorage:", err)
      }
    }
  }, [])

  const currentPlanInfo = useMemo(() => {
    return getPlanInfo(currentPlan, plans)
  }, [currentPlan, subscriptionData, plans])

  // Enhanced change type calculation (preserved)
  const changeType = useMemo((): ChangeType => {
    if (subscriptionStatus === 'canceled' || !currentPlan) {
      return selectedPlan && billingPeriod ? "upgrade" : "same";
    }
    const currentPlanConfig = findPlan(currentPlan)
    const selectedPlanConfig = findPlan(selectedPlan?.planId ?? "");
    if (!currentPlanConfig || !selectedPlanConfig) return "same"
    if (selectedPlan?.planId === currentPlan && billingPeriod !== currentBillingPeriod) {
      return "billing_change"
    }
    if (selectedPlan?.planId === currentPlan && billingPeriod === currentBillingPeriod) {
      return "same"
    }
    if (selectedPlanConfig.tier > currentPlanConfig.tier) {
      return "upgrade";
    } else if (selectedPlanConfig.tier < currentPlanConfig.tier) {
      return "downgrade";
    } else {
      const currentEffectiveMonthlyValue = getEffectiveMonthlyValue(currentPlanConfig, currentBillingPeriod)
      const selectedEffectiveMonthlyValue = getEffectiveMonthlyValue(selectedPlanConfig, billingPeriod)
      if (selectedEffectiveMonthlyValue > currentEffectiveMonthlyValue) {
        return "upgrade"
      } else if (selectedEffectiveMonthlyValue < currentEffectiveMonthlyValue) {
        return "downgrade"
      } else {
        return "same"
      }
    }
  }, [selectedPlan, billingPeriod, currentPlan, currentBillingPeriod, findPlan, subscriptionStatus])

  const getSelectedPriceId = useCallback((): string | null => {
    if (!selectedPlan) return null
    const plan = findPlan(selectedPlan.planId)
    if (!plan) return null
    return selectedPlan.interval === "monthly" ? plan.price_id_monthly : plan.price_id_yearly
  }, [selectedPlan, findPlan])

  // Enhanced change message with better formatting
  const changeMessage = useMemo(() => {
    const currentPlanConfig = findPlan(currentPlan)
    const selectedPlanConfig = findPlan(selectedPlan?.planId??"")
    if (!selectedPlanConfig) return null

    const isTrialing = subscriptionStatus === 'trialing' || (subscriptionData?.trial_end && Date.now() / 1000 < subscriptionData.trial_end)

    if (subscriptionStatus === "past_due") {
      return {
        type: "error" as const,
        title: "Payment Required",
        message: "Your current subscription is past due. Please update your payment method before changing plans.",
        icon: AlertCircle
      }
    }

    if (subscriptionStatus === "canceled") {
      return {
        type: "warning" as const,
        title: "Subscription Canceled",
        message: "Your subscription is canceled. Selecting a new plan will create a new subscription.",
        icon: AlertTriangle
      }
    }

    if (isTrialing) {
      switch (changeType) {
        case "upgrade":
          return {
            type: "success" as const,
            title: "Upgrade Plan",
            message: `Your trial will end immediately and you'll be charged for the new plan. The new plan will start right away.`,
            icon: TrendingUp
          }
        case "downgrade":
          return {
            type: "info" as const,
            title: "Downgrade Plan",
            message: `Your trial will end immediately and you'll be charged for the new plan. The new plan will start right away.`,
            icon: TrendingDown
          }
        case "billing_change":
          return {
            type: "info" as const,
            title: "Switch Billing Period",
            message: `Your trial will end immediately and you'll be charged for the new billing period. The new billing period will start right away.`,
            icon: RefreshCw
          }
        default:
          return null
      }
    }

    switch (changeType) {
      case "upgrade":
        return {
          type: "success" as const,
          title: "Upgrade Plan",
          message: `You'll be upgraded immediately. The cost will be prorated based on your current billing period.`,
          icon: TrendingUp
        }
      case "downgrade":
        const formatDate = (dateString?: string) => {
          if (!dateString) return ""
          try {
            return new Date(dateString).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })
          } catch {
            return ""
          }
        }
        const dateStr = formatDate(nextBillingDate)
        return {
          type: "info" as const,
          title: "Downgrade Plan",
          message: `Your plan will be downgraded at the end of your billing period${dateStr ? ` on ${dateStr}` : ""}. No immediate charge will occur.`,
          icon: TrendingDown
        }
      case "billing_change":
        return {
          type: "info" as const,
          title: "Switch Billing Period",
          message: `You are switching your billing period from ${currentBillingPeriod} to ${billingPeriod}. This will take effect immediately with prorated billing.`,
          icon: RefreshCw
        }
      default:
        return null
    }
  }, [selectedPlan, subscriptionStatus, changeType, billingPeriod, nextBillingDate, currentPlan, currentBillingPeriod, findPlan])

  // Debug: log changeMessage, changeType, selectedPlan
  console.log('changeMessage', changeMessage, 'changeType', changeType, 'selectedPlan', selectedPlan);

  // Helper to determine upgrade/downgrade for a plan card
  const getPlanChangeType = (planVariant: any) => {
    const currentPlanConfig = findPlan(currentPlan);
    if (!currentPlanConfig) return null;
    if (planVariant.id === currentPlan && planVariant.interval === currentBillingPeriod) return null;
    if (planVariant.tier > currentPlanConfig.tier) return 'upgrade';
    if (planVariant.tier < currentPlanConfig.tier) return 'downgrade';
    return null;
  };

  const validateInputs = useCallback((): boolean => {
    setError(null)
    if (!userid?.trim()) {
      setError("Invalid user ID")
      return false
    }
    const plan = plans.find((p) => String(p.id) === String(selectedPlan?.planId ?? ""))
    console.log('validateInputs: selectedPlan', selectedPlan, 'found plan:', plan);
    if (!plan) {
      setError("Invalid plan selection")
      return false
    }
    const priceId = getSelectedPriceId()
    if (priceId && !userEmail?.trim()) {
      setError("Email is required for paid plans. Please refresh and try again.")
      return false
    }
    return true
  }, [userid, selectedPlan, userEmail, plans, getSelectedPriceId])

  const getButtonLabel = () => {
    if (changeType === "upgrade") return "Upgrade Now";
    if (changeType === "downgrade") return "Schedule Downgrade";
    if (changeType === "same") return "Choose Plan";
    return "Choose Plan";
  }

  // Enhanced update plan function (preserved logic)
  const updatePlan = useCallback(async () => {
    if (!validateInputs() || !selectedPlan) return
    setLoading(true)
    setError(null)
    setBackendMessage(null)
    try {
      const priceId = getSelectedPriceId()
      
      if (
        subscriptionStatus === "active" ||
        (subscriptionStatus === "trialing" && ["upgrade", "downgrade", "billing_change"].includes(changeType))
      ) {
        const result = await onUpdate(selectedPlan.planId, priceId)
        if (result && typeof result === 'object' && 'message' in result && typeof result.message === 'string') {
          setBackendMessage(result.message)
        } else if (typeof result === 'string') {
          setBackendMessage(result)
        } else {
          setBackendMessage("Plan updated successfully.")
        }
      } else if (subscriptionStatus === "canceled" || subscriptionStatus === "incomplete") {
        if (!userEmail) {
          throw new Error("Email is required for checkout")
        }
        const response = await fetch("/api/subscription_better/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userid,
            email: userEmail,
            plan_id: selectedPlan.planId,
            price_id: priceId,
          }),
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || "Failed to create checkout session")
        }
        if (data.url) {
          window.location.href = data.url
        } else {
          throw new Error("No checkout URL received")
        }
      } else if (subscriptionStatus === "past_due" || subscriptionStatus === "unpaid") {
        try {
          const result = await onUpdate(selectedPlan.planId, priceId)
          if (result && typeof result === 'object' && 'message' in result && typeof result.message === 'string') {
            setBackendMessage(result.message)
          } else if (typeof result === 'string') {
            setBackendMessage(result)
          } else {
            setBackendMessage("Plan updated successfully.")
          }
        } catch (error) {
          if (!userEmail) {
            throw new Error("Email is required for checkout")
          }
          const response = await fetch("/api/subscription_better/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userid,
              email: userEmail,
              plan_id: selectedPlan.planId,
              price_id: priceId,
            }),
          })
          const data = await response.json()
          if (!response.ok) {
            throw new Error(data.error || "Failed to create checkout session")
          }
          if (data.url) {
            window.location.href = data.url
          } else {
            throw new Error("No checkout URL received")
          }
        }
      } else {
        throw new Error(`Cannot update subscription with status: ${subscriptionStatus}`)
      }
    } catch (err: any) {
      console.error("Plan update error:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }, [validateInputs, selectedPlan, billingPeriod, getSelectedPriceId, currentPlan, subscriptionStatus, userid, userEmail, onUpdate, changeType])

  // Enhanced cancel subscription with confirmation
  const handleCancelSubscription = async () => {
    setCancelLoading(true)
    setCancelMessage(null)
    try {
      const res = await fetch("/api/subscription_better/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userid }),
      })
      const data = await res.json()
      if (res.ok) {
        setCancelMessage(data.message || "Subscription cancelled.")
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setCancelMessage(data.error || "Failed to cancel subscription.")
      }
    } catch (err: any) {
      setCancelMessage(err.message || "Failed to cancel subscription.")
    } finally {
      setCancelLoading(false)
      setShowCancelConfirm(false)
    }
  }

  // Helper functions for plan rendering
  const normalizeInterval = (interval: string | undefined | null) => {
    if (!interval) return '';
    if (interval === 'month' || interval === 'monthly') return 'monthly';
    if (interval === 'year' || interval === 'yearly' || interval === 'annual') return 'yearly';
    return interval;
  };

  const currentPlanPriceId = useMemo(() => {
    return subscriptionData?.price_id || null;
  }, [subscriptionData]);

  const currentPlanInterval = normalizeInterval(subscriptionData?.billing_interval);

  const isCurrentPlan = (planVariant: any) => {
    return (
      planVariant.price_id === currentPlanPriceId &&
      normalizeInterval(planVariant.interval) === currentPlanInterval
    );
  };

  // Use new pending plan change fields from subscriptionData
  const hasPendingChange = !!subscriptionData?.pending_plan_change && !!subscriptionData?.pending_plan_change_effective;
  const pendingPlanName = hasPendingChange
    ? (subscriptionData.pending_plan_name || (plans.find(p => p.id === subscriptionData.pending_plan_change)?.name) || subscriptionData.pending_plan_change)
    : null;
  const pendingPlanInterval = hasPendingChange ? (subscriptionData.pending_plan_interval || '') : '';
  const pendingPlanPriceId = hasPendingChange ? (subscriptionData.pending_price_id || '') : '';
  const pendingPlanEffective = hasPendingChange ? new Date(subscriptionData.pending_plan_change_effective).toLocaleDateString() : null;

  const isButtonDisabled =
    loading ||
    hasPendingChange ||
    !selectedPlan ||
    isCurrentPlan({
      id: String(selectedPlan?.planId ?? ''),
      interval: String(selectedPlan?.interval ?? 'monthly'),
      price_id: String(getSelectedPriceId() ?? ''),
    });

  // Enhanced plan card rendering
  const renderPlanCard = (planVariant: any) => {
    const isCurrent = isCurrentPlan(planVariant);
    if (isCurrent) return null;

    const price = planVariant.interval === 'monthly'
      ? (planVariant.price_monthly ? planVariant.price_monthly / 100 : 0)
      : (planVariant.price_yearly ? planVariant.price_yearly / 100 : 0);

    const yearlyPrice = planVariant.price_yearly ? planVariant.price_yearly / 100 : 0;
    const monthlyPrice = planVariant.price_monthly ? planVariant.price_monthly / 100 : 0;
    const yearlySavings = planVariant.interval === 'yearly' && monthlyPrice > 0 
      ? Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100) 
      : 0;

    let features: string[] = [];
    if (Array.isArray(planVariant.features)) {
      features = planVariant.features;
    } else if (typeof planVariant.features === 'string') {
      try {
        features = JSON.parse(planVariant.features);
      } catch {
        features = [];
      }
    }

    const isSelected = !!selectedPlan &&
      String(selectedPlan.planId) === String(planVariant.id) &&
      selectedPlan.interval === planVariant.interval;

    const planChangeType = getPlanChangeType(planVariant);

    return (
      <div
        key={planVariant.id + '-' + planVariant.interval}
        className={clsx(
          "relative rounded-2xl border-2 bg-white p-6 shadow-lg transition-all duration-300 cursor-pointer group",
          isSelected 
            ? "ring-4 ring-blue-600 border-blue-600 bg-blue-50 shadow-2xl" 
            : "hover:border-blue-400 hover:shadow-xl border-gray-200",
          hasPendingChange ? "opacity-50 pointer-events-none" : "",
          planVariant.highlight ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50" : ""
        )}
        onClick={() => {
          if (!hasPendingChange && !loading) {
            const newSelection = { planId: String(planVariant.id), interval: planVariant.interval };
            setSelectedPlan(newSelection);
          }
        }}
        tabIndex={0}
        role="button"
        aria-pressed={!!isSelected}
        aria-label={`Select ${planVariant.name} (${planVariant.interval})`}
      >
        {/* Upgrade/Downgrade Tag */}
        {!showConfirm && planChangeType === 'upgrade' && (
          <div className="absolute top-0 right-0 z-20 flex flex-col items-end">
            <div className="relative">
              <div className="bg-green-600 text-white font-bold text-xs px-3 py-1 rounded-bl-lg shadow-lg"
                   style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', borderTopRightRadius: '0.5rem', borderBottomLeftRadius: '0.5rem' }}>
                Upgrade
              </div>
              <div style={{
                width: 0,
                height: 0,
                borderLeft: '12px solid transparent',
                borderTop: '12px solid #16a34a', // green-600
                position: 'absolute',
                right: 0,
                bottom: '-12px',
                zIndex: 10
              }} />
            </div>
          </div>
        )}
        {!showConfirm && planChangeType === 'downgrade' && (
          <div className="absolute top-0 right-0 z-20 flex flex-col items-end">
            <div className="relative">
              <div className="bg-orange-500 text-white font-bold text-xs px-3 py-1 rounded-bl-lg shadow-lg"
                   style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', borderTopRightRadius: '0.5rem', borderBottomLeftRadius: '0.5rem' }}>
                Downgrade
              </div>
              <div style={{
                width: 0,
                height: 0,
                borderLeft: '12px solid transparent',
                borderTop: '12px solid #f97316', // orange-500
                position: 'absolute',
                right: 0,
                bottom: '-12px',
                zIndex: 10
              }} />
            </div>
          </div>
        )}

        {/* Plan Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900">{planVariant.name}</h3>
            {planVariant.highlight && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold">
                <Crown size={12} />
                Popular
              </div>
            )}
          </div>
          <div className={clsx(
            "px-3 py-1 rounded-full text-xs font-medium",
            planVariant.interval === 'monthly' 
              ? "bg-blue-100 text-blue-700" 
              : "bg-green-100 text-green-700"
          )}>
            {planVariant.interval === 'monthly' ? 'Monthly' : 'Yearly'}
            {yearlySavings > 0 && (
              <span className="ml-1 font-bold">({yearlySavings}% off)</span>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              £{price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-gray-500">
              /{planVariant.interval === 'monthly' ? 'month' : 'year'}
            </span>
          </div>
          {planVariant.interval === 'yearly' && monthlyPrice > 0 && (
            <div className="text-sm text-gray-600 mt-1">
              £{(yearlyPrice / 12).toFixed(2)}/month billed annually
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{planVariant.description}</p>

        {/* Features */}
        {features.length > 0 && (
          <div className="space-y-2 mb-6">
            {features.slice(0, 5).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
            {features.length > 5 && (
              <div className="text-xs text-gray-500 mt-2">
                +{features.length - 5} more features
              </div>
            )}
          </div>
        )}

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white rounded-full p-1">
            <CheckCircle2 size={16} />
          </div>
        )}
      </div>
    );
  };

// Compact Current Plan Summary for Plan Selection Modal
const CurrentPlanSummary = () => {
  const currentPlanConfig = findPlan(currentPlan);
  if (!currentPlanConfig) return null;

  const statusConfig = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    trialing: "bg-blue-50 text-blue-700 border-blue-200", 
    past_due: "bg-red-50 text-red-700 border-red-200",
    canceled: "bg-gray-50 text-gray-700 border-gray-200",
    incomplete: "bg-amber-50 text-amber-700 border-amber-200"
  };

  const currentStatus = statusConfig[subscriptionStatus as keyof typeof statusConfig] || statusConfig.active;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span className="text-sm font-medium text-blue-900">Your Current Plan</span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${currentStatus}`}>
          {subscriptionStatus.replace('_', ' ').charAt(0).toUpperCase() + subscriptionStatus.replace('_', ' ').slice(1)}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{currentPlanConfig.name}</h3>
          <p className="text-sm text-gray-600">
            {currentBillingPeriod === 'monthly' ? 'month' : 'year'}
            {nextBillingDate && (
              <span className="ml-2 text-gray-500">
                • Renews {new Date(nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            {currentBillingPeriod === 'monthly' ? 'Monthly' : 'Annual'}
          </div>
          {currentBillingPeriod === 'yearly' && (
            <div className="text-xs text-green-600 font-medium">Save 20%</div>
          )}
        </div>
      </div>
    </div>
  );
};

  // Set default tab to 'plans' when modal opens (when plans are loaded)
  useEffect(() => {
    if (!plans.length) return;
    setActiveTab('plans');
  }, [plans]);

  if (plansLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-white rounded-lg p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-lg font-medium">Loading plans...</p>
        </div>
      </div>
    )
  }

  if (plansError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-white rounded-lg p-8 text-center max-w-md">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-red-600 mb-4">{plansError}</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="max-h-[95vh] w-full max-w-7xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Subscription Management</h2>
            <p className="text-gray-600 mt-1">Manage your plan, billing, and subscription settings</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Current Plan Summary */}
          <CurrentPlanSummary />

          

          {/* Pending Change Banner */}
          {hasPendingChange && (
            <div className="mb-6 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-6">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">Pending Plan Change</h4>
                  <p className="text-sm text-yellow-800">
                    You have a scheduled plan change to <strong>{pendingPlanName}</strong>
                    {pendingPlanInterval && (
                      <> (<span className="capitalize">{pendingPlanInterval}</span>)</>
                    )}
                    {pendingPlanPriceId && (
                      <> [Price ID: <span className="font-mono text-xs">{pendingPlanPriceId}</span>]</>
                    )}
                    {pendingPlanEffective && (
                      <> that will take effect on <strong>{pendingPlanEffective}</strong></>
                    )}.
                    You cannot make additional changes until then.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Billing Period Toggle */}
          <div className="mb-6 flex justify-center">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={clsx(
                  "px-6 py-2 rounded-md text-sm font-medium transition-all",
                  billingPeriod === "monthly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
                disabled={hasPendingChange || loading}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={clsx(
                  "px-6 py-2 rounded-md text-sm font-medium transition-all relative",
                  billingPeriod === "yearly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
                disabled={hasPendingChange || loading}
              >
                Yearly
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  Save
                </span>
              </button>
            </div>
          </div>

        {/* Plan Cards Grid */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
            {(() => {
              // Sort by tier only
              const sorted = [...plans].sort((a, b) => a.tier - b.tier);
              // Generate plan variants for both intervals, using backend tier
              const allPlanVariants = sorted.flatMap(plan => [
                {
                  ...plan,
                  interval: 'monthly',
                  price_id: plan.price_id_monthly,
                  monthly: plan.monthly,
                  yearly: plan.yearly,
                  tier: plan.tier,
                },
                {
                  ...plan,
                  interval: 'yearly',
                  price_id: plan.price_id_yearly,
                  monthly: plan.monthly,
                  yearly: plan.yearly,
                  tier: plan.tier,
                }
              ]);
              const filteredVariants = allPlanVariants.filter(planVariant => 
                !isCurrentPlan(planVariant) && planVariant.interval === billingPeriod
              );
              return filteredVariants.map(renderPlanCard);
            })()}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {backendMessage && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <p className="text-green-800 font-medium">{backendMessage}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
            {/* Cancel Subscription */}
            {subscriptionData && subscriptionStatus !== "canceled" && (
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={cancelLoading}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  {cancelLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Cancel Subscription
                    </>
                  )}
                </Button>
                {cancelMessage && (
                  <div className="text-sm text-green-600 bg-green-50 rounded px-3 py-1">
                    {cancelMessage}
                  </div>
                )}
              </div>
            )}

            {/* Main Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={onClose} 
                disabled={loading}
                className="px-8"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setConfirmMessage(changeMessage);
                  setShowConfirm(true);
                }} 
                disabled={isButtonDisabled} 
                className={clsx(
                  "px-8 min-w-[140px]",
                  changeType === "upgrade" ? "bg-green-600 hover:bg-green-700" :
                  changeType === "downgrade" ? "bg-orange-600 hover:bg-orange-700" :
                  "bg-blue-600 hover:bg-blue-700"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {changeType === "upgrade" && <TrendingUp className="mr-2 h-4 w-4" />}
                    {changeType === "downgrade" && <TrendingDown className="mr-2 h-4 w-4" />}
                    {changeType === "same" && <CheckCircle2 className="mr-2 h-4 w-4" />}
                    {getButtonLabel()}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cancel Subscription
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel your subscription? You'll lose access to all features at the end of your current billing period.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={cancelLoading}
                >
                  Keep Subscription
                </Button>
                <Button
                  onClick={handleCancelSubscription}
                  disabled={cancelLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {cancelLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Yes, Cancel"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Popup overlays all content and disables interaction with modal */}
      {showConfirm && confirmMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl relative">
            <div className="flex items-start gap-3 mb-4">
              {React.createElement(confirmMessage.icon, {
                className: clsx(
                  "h-6 w-6 flex-shrink-0",
                  confirmMessage.type === "error" ? "text-red-500" :
                  confirmMessage.type === "warning" ? "text-yellow-500" :
                  confirmMessage.type === "success" ? "text-green-500" :
                  confirmMessage.type === "info" ? "text-orange-500" :
                  "text-blue-500"
                )
              })}
              <div>
                <h4 className={clsx(
                  "font-semibold mb-1 text-lg",
                  confirmMessage.type === "error" ? "text-red-900" :
                  confirmMessage.type === "warning" ? "text-yellow-900" :
                  confirmMessage.type === "success" ? "text-green-900" :
                  confirmMessage.type === "info" ? "text-orange-900" :
                  "text-blue-900"
                )}>
                  {confirmMessage.title}
                </h4>
                <p className={clsx(
                  "text-base",
                  confirmMessage.type === "error" ? "text-red-800" :
                  confirmMessage.type === "warning" ? "text-yellow-800" :
                  confirmMessage.type === "success" ? "text-green-800" :
                  confirmMessage.type === "info" ? "text-orange-800" :
                  "text-blue-800"
                )}>
                  {confirmMessage.message}
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  setShowConfirm(false);
                  setConfirmMessage(null);
                  await updatePlan();
                }}
                disabled={loading}
                className={clsx(
                  changeType === "upgrade" ? "bg-green-600 hover:bg-green-700" :
                  changeType === "downgrade" ? "bg-orange-600 hover:bg-orange-700" :
                  "bg-blue-600 hover:bg-blue-700",
                  "text-white"
                )}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}