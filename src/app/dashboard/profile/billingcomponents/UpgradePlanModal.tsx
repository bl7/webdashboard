import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Crown, Star } from "lucide-react"
import clsx from "clsx"

interface Plan {
  id: string
  name: string
  tier: number
  price_id_monthly: string
  price_id_yearly: string
  monthlyValue: number
  yearlyValue: number
  description: string
  features: string[]
  highlight: boolean
}

interface UpgradePlanModalProps {
  open: boolean
  onClose: () => void
  currentPlanTier: number
  currentPlanPrice: number
  userId: string
  onUpgrade: () => void
}

export const UpgradePlanModal: React.FC<UpgradePlanModalProps> = ({ open, onClose, currentPlanTier, currentPlanPrice, userId, onUpgrade }) => {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [upgradeError, setUpgradeError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch('/api/plans/secure')
      .then(res => res.json())
      .then(data => {
        setPlans(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load plans')
        setLoading(false)
      })
  }, [open])

  const upgradePlans = plans.filter(plan => plan.tier > currentPlanTier || (plan.tier === currentPlanTier && plan.monthlyValue > currentPlanPrice))

  const handleUpgrade = async () => {
    if (!selectedPlan) return
    setUpgradeLoading(true)
    setUpgradeError(null)
    try {
      const res = await fetch('/api/subscription_better/change-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          plan_id: selectedPlan.id,
          price_id: selectedPlan.price_id_monthly // or yearly, add toggle if needed
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to upgrade')
      onUpgrade()
      onClose()
    } catch (e: any) {
      setUpgradeError(e.message)
    } finally {
      setUpgradeLoading(false)
    }
  }

  const renderPlanCard = (plan: Plan) => {
    const isSelected = selectedPlan?.id === plan.id
    return (
      <div
        key={plan.id}
        className={clsx(
          "relative rounded-2xl border-2 bg-white p-6 shadow-lg transition-all duration-300 cursor-pointer group",
          isSelected 
            ? "ring-4 ring-blue-600 border-purple-600 bg-purple-50 shadow-2xl" 
            : "hover:border-purple-400 hover:shadow-xl border-gray-200",
          plan.highlight ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50" : ""
        )}
        onClick={() => setSelectedPlan(plan)}
        tabIndex={0}
        role="button"
        aria-pressed={!!isSelected}
        aria-label={`Select ${plan.name}`}
      >
        {plan.highlight && (
          <div className="absolute top-0 right-0 z-20 flex flex-col items-end">
            <div className="relative">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold text-xs px-3 py-1 rounded-bl-lg shadow-lg flex items-center gap-1"
                   style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', borderTopRightRadius: '0.5rem', borderBottomLeftRadius: '0.5rem' }}>
                <Star size={14} className="inline-block mr-1" />
                Best Seller
              </div>
              <div style={{
                width: 0,
                height: 0,
                borderLeft: '12px solid transparent',
                borderTop: '12px solid #f59e42',
                position: 'absolute',
                right: 0,
                bottom: '-12px',
                zIndex: 10
              }} />
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
            {plan.highlight && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold">
                <Crown size={12} />
                Popular
              </div>
            )}
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            Monthly
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              £{(plan.monthlyValue / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-gray-500">/month</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            £{(plan.yearlyValue / 100).toFixed(2)}/year
          </div>
        </div>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{plan.description}</p>
        {plan.features && Array.isArray(plan.features) && plan.features.length > 0 && (
          <div className="space-y-2 mb-6">
            {plan.features.slice(0, 5).map((feature: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
            {plan.features.length > 5 && (
              <div className="text-xs text-gray-500 mt-2">
                +{plan.features.length - 5} more features
              </div>
            )}
          </div>
        )}
        {isSelected && (
          <div className="absolute top-4 right-4 bg-purple-500 text-white rounded-full p-1">
            <CheckCircle2 size={16} />
          </div>
        )}
      </div>
    );
  };

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="relative w-full max-w-7xl rounded-xl p-8 shadow-xl bg-white">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">Upgrade Your Plan</h3>
          <button onClick={onClose} className="rounded-md p-1 text-gray-600 hover:bg-gray-100 text-2xl font-bold">×</button>
        </div>
        <div className="mb-6 flex justify-end">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded" onClick={onUpgrade}>
            Reactivate Subscription
          </Button>
        </div>
        {loading ? (
          <div>Loading plans...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : upgradePlans.length === 0 ? (
          <div className="text-gray-700">No upgrade options available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upgradePlans.map(plan => renderPlanCard(plan))}
          </div>
        )}
        <div className="mt-8 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpgrade} disabled={!selectedPlan || upgradeLoading}>
            {upgradeLoading ? 'Upgrading...' : 'Upgrade Now'}
          </Button>
        </div>
        {upgradeError && <div className="text-red-600 mt-2">{upgradeError}</div>}
      </div>
    </div>
  )
}

export default UpgradePlanModal; 