"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useDarkMode } from "../context/DarkModeContext"
import { Search, X, Edit, Trash2, AlertTriangle } from "lucide-react"

interface PlanFormData {
  name: string
  price_monthly: string
  price_yearly: string
  stripe_price_id_monthly: string
  stripe_price_id_yearly: string
  stripe_product_id: string
  description: string
  features: string
  is_active: boolean
  tier: string
  highlight?: boolean
  include_device?: boolean
}

interface FormErrors {
  name?: string
  price_monthly?: string
  price_yearly?: string
  stripe_price_id_monthly?: string
  stripe_price_id_yearly?: string
  stripe_product_id?: string
  description?: string
  features?: string
  tier?: string
}

function PlanModal({ open, onClose, onSuccess, isDarkMode, plan = null, mode = "add" }: any) {
  const [form, setForm] = useState<PlanFormData>({
    name: "",
    price_monthly: "",
    price_yearly: "",
    stripe_price_id_monthly: "",
    stripe_price_id_yearly: "",
    stripe_product_id: "",
    description: "",
    features: "",
    is_active: true,
    tier: "",
    highlight: false,
    include_device: false
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset form when modal opens/closes or plan changes
  useEffect(() => {
    if (open) {
      if (plan && mode === "edit") {
        setForm({
          name: plan.name || "",
          price_monthly: plan.price_monthly ? (plan.price_monthly / 100).toString() : "",
          price_yearly: plan.price_yearly ? (plan.price_yearly / 100).toString() : "",
          stripe_price_id_monthly: plan.stripe_price_id_monthly || "",
          stripe_price_id_yearly: plan.stripe_price_id_yearly || "",
          stripe_product_id: plan.stripe_product_id || "",
          description: plan.description || "",
          features: Array.isArray(plan.features) ? plan.features.join(", ") : "",
          is_active: plan.is_active ?? true,
          tier: plan.tier !== undefined && plan.tier !== null ? String(plan.tier) : "",
          highlight: !!plan.highlight,
          include_device: !!plan.include_device
        })
      } else {
        setForm({
          name: "",
          price_monthly: "",
          price_yearly: "",
          stripe_price_id_monthly: "",
          stripe_price_id_yearly: "",
          stripe_product_id: "",
          description: "",
          features: "",
          is_active: true,
          tier: "",
          highlight: false,
          include_device: false
        })
      }
      setErrors({})
      setError(null)
    }
  }, [open, plan, mode])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Plan name is required"
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Plan name must be at least 2 characters"
    }

    // Price validation
    if (!form.price_monthly || Number(form.price_monthly) <= 0) {
      newErrors.price_monthly = "Monthly price must be greater than 0"
    }
    if (!form.price_yearly || Number(form.price_yearly) <= 0) {
      newErrors.price_yearly = "Yearly price must be greater than 0"
    }

    // Stripe validation (optional but if provided, should be valid)
    if (form.stripe_price_id_monthly && !form.stripe_price_id_monthly.startsWith("price_")) {
      newErrors.stripe_price_id_monthly = "Invalid Stripe price ID format"
    }
    if (form.stripe_price_id_yearly && !form.stripe_price_id_yearly.startsWith("price_")) {
      newErrors.stripe_price_id_yearly = "Invalid Stripe price ID format"
    }
    if (form.stripe_product_id && !form.stripe_product_id.startsWith("prod_")) {
      newErrors.stripe_product_id = "Invalid Stripe product ID format"
    }

    // Description validation
    if (form.description && form.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters"
    }

    // Tier validation
    if (!form.tier || isNaN(Number(form.tier))) {
      newErrors.tier = "Tier is required and must be a number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    let newValue: any = value
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked
    }
    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }))
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...form,
        price_monthly: Math.round(Number(form.price_monthly) * 100),
        price_yearly: Math.round(Number(form.price_yearly) * 100),
        features: form.features.split(",").map(f => f.trim()).filter(Boolean),
        tier: Number(form.tier),
        highlight: !!form.highlight,
        include_device: !!form.include_device
      }

      const url = mode === "edit" ? `/api/plans/${plan.id}` : "/api/plans"
      const method = mode === "edit" ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to ${mode} plan`)
      }

      onSuccess()
      onClose()
    } catch (e: any) {
      setError(e.message || `Failed to ${mode} plan`)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className={`relative w-full max-w-lg rounded-lg p-6 shadow-xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {mode === "edit" ? "Edit Plan" : "Add New Plan"}
          </h3>
          <button
            onClick={onClose}
            className={`rounded-md p-1 transition-colors ${isDarkMode ? "text-gray-400 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`mb-1 block text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}>
              Name *
            </label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              className={`w-full rounded-md border px-3 py-2 ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} ${errors.name ? "border-red-500" : ""}`} 
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className={`mb-1 block text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                Monthly Price (\u00a3) *
              </label>
              <input 
                name="price_monthly" 
                type="number" 
                min="0" 
                step="0.01" 
                value={form.price_monthly} 
                onChange={handleChange} 
                className={`w-full rounded-md border px-3 py-2 ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} ${errors.price_monthly ? "border-red-500" : ""}`} 
              />
              {errors.price_monthly && <p className="mt-1 text-sm text-red-500">{errors.price_monthly}</p>}
            </div>
            <div className="flex-1">
              <label className={`mb-1 block text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                Yearly Price (\u00a3) *
              </label>
              <input 
                name="price_yearly" 
                type="number" 
                min="0" 
                step="0.01" 
                value={form.price_yearly} 
                onChange={handleChange} 
                className={`w-full rounded-md border px-3 py-2 ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} ${errors.price_yearly ? "border-red-500" : ""}`} 
              />
              {errors.price_yearly && <p className="mt-1 text-sm text-red-500">{errors.price_yearly}</p>}
            </div>
            <div className="flex-1">
              <label className={`mb-1 block text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                Tier *
              </label>
              <input 
                name="tier" 
                type="number" 
                min="1" 
                step="1" 
                value={form.tier} 
                onChange={handleChange} 
                className={`w-full rounded-md border px-3 py-2 ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} ${errors.tier ? "border-red-500" : ""}`} 
              />
              {errors.tier && <p className="mt-1 text-sm text-red-500">{errors.tier}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className={`mb-1 block text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                Stripe Price ID (Monthly)
              </label>
              <input 
                name="stripe_price_id_monthly" 
                value={form.stripe_price_id_monthly} 
                onChange={handleChange} 
                placeholder="price_..."
                className={`w-full rounded-md border px-3 py-2 ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} ${errors.stripe_price_id_monthly ? "border-red-500" : ""}`} 
              />
              {errors.stripe_price_id_monthly && <p className="mt-1 text-sm text-red-500">{errors.stripe_price_id_monthly}</p>}
            </div>
            <div className="flex-1">
              <label className={`mb-1 block text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                Stripe Price ID (Yearly)
              </label>
              <input 
                name="stripe_price_id_yearly" 
                value={form.stripe_price_id_yearly} 
                onChange={handleChange} 
                placeholder="price_..."
                className={`w-full rounded-md border px-3 py-2 ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} ${errors.stripe_price_id_yearly ? "border-red-500" : ""}`} 
              />
              {errors.stripe_price_id_yearly && <p className="mt-1 text-sm text-red-500">{errors.stripe_price_id_yearly}</p>}
            </div>
          </div>
          <div>
            <label className={`mb-1 block text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}>
              Stripe Product ID
            </label>
            <input 
              name="stripe_product_id" 
              value={form.stripe_product_id} 
              onChange={handleChange} 
              placeholder="prod_..."
              className={`w-full rounded-md border px-3 py-2 ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} ${errors.stripe_product_id ? "border-red-500" : ""}`} 
            />
            {errors.stripe_product_id && <p className="mt-1 text-sm text-red-500">{errors.stripe_product_id}</p>}
          </div>
          <div>
            <label className={`mb-1 block text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}>
              Description
            </label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              rows={3}
              className={`w-full rounded-md border px-3 py-2 ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} ${errors.description ? "border-red-500" : ""}`} 
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>
          <div>
            <label className={`mb-1 block text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}>
              Features (comma separated)
            </label>
            <textarea 
              name="features" 
              value={form.features} 
              onChange={handleChange} 
              rows={3}
              placeholder="Feature 1, Feature 2, Feature 3"
              className={`w-full rounded-md border px-3 py-2 ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} ${errors.features ? "border-red-500" : ""}`} 
            />
            {errors.features && <p className="mt-1 text-sm text-red-500">{errors.features}</p>}
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              name="is_active" 
              checked={form.is_active} 
              onChange={handleChange} 
              id="is_active" 
              className="rounded"
            />
            <label htmlFor="is_active" className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}>
              Active
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="include_device"
              checked={!!form.include_device}
              onChange={handleChange}
              id="include_device"
              className="rounded"
            />
            <label htmlFor="include_device" className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}>
              Includes Device
            </label>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="highlight"
              checked={!!form.highlight}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-yellow-500"
            />
            <span className="text-sm">Best Seller (highlight this plan)</span>
          </label>
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (mode === "edit" ? "Updating..." : "Adding...") : (mode === "edit" ? "Update Plan" : "Add Plan")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteConfirmationModal({ open, onClose, onConfirm, planName, isDarkMode, loading }: any) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className={`relative w-full max-w-md rounded-lg p-6 shadow-xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Delete Plan</h3>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>This action cannot be undone.</p>
          </div>
        </div>
        <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          Are you sure you want to delete <span className="font-semibold">"{planName}"</span>? This will permanently remove the plan and may affect existing subscriptions.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="flex-1" disabled={loading}>
            {loading ? "Deleting..." : "Delete Plan"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [deleteLoading, setDeleteLoading] = useState(false)
  const plansPerPage = 10
  const { isDarkMode } = useDarkMode()

  const fetchPlans = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/plans")
      if (!res.ok) throw new Error("Failed to fetch plans")
      const data = await res.json()
      setPlans(data)
    } catch (e: any) {
      setError(e.message || "Failed to fetch plans")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPlans() }, [])

  const handleAddPlan = () => {
    setModalMode("add")
    setSelectedPlan(null)
    setShowModal(true)
  }

  const handleEditPlan = (plan: any) => {
    setModalMode("edit")
    setSelectedPlan(plan)
    setShowModal(true)
  }

  const handleDeletePlan = (plan: any) => {
    setSelectedPlan(plan)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedPlan) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/plans/${selectedPlan.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete plan")
      await fetchPlans()
      setShowDeleteModal(false)
      setSelectedPlan(null)
    } catch (e: any) {
      setError(e.message || "Failed to delete plan")
    } finally {
      setDeleteLoading(false)
    }
  }

  // Filtering
  const filteredPlans = plans.filter(plan => {
    const matchesSearch =
      (plan.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (plan.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter ? (statusFilter === "active" ? plan.is_active : !plan.is_active) : true
    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredPlans.length / plansPerPage)
  const startIndex = (currentPage - 1) * plansPerPage
  const paginatedPlans = filteredPlans.slice(startIndex, startIndex + plansPerPage)

  return (
    <div className={`p-6 md:p-10 min-h-screen space-y-8 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">Plans Management</h1>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <div className="flex gap-2 items-center">
          <div className={`flex items-center rounded border ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"}`}>
            <Search className="ml-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              className={`ml-2 bg-transparent py-2 px-2 outline-none ${isDarkMode ? "text-white" : "text-gray-900"}`}
            />
          </div>
          <select
            className={`rounded border p-2 ${isDarkMode ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"}`}
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1) }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <Button onClick={handleAddPlan}>+ Add Plan</Button>
      </div>
      
      <PlanModal 
        open={showModal} 
        onClose={() => setShowModal(false)} 
        onSuccess={fetchPlans} 
        isDarkMode={isDarkMode}
        plan={selectedPlan}
        mode={modalMode}
      />
      
      <DeleteConfirmationModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        planName={selectedPlan?.name}
        isDarkMode={isDarkMode}
        loading={deleteLoading}
      />

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-lg">Loading plans...</div>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      ) : (
        <>
        <div className={`overflow-x-auto rounded-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={isDarkMode ? "bg-gray-800" : "bg-gray-100"}>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Monthly</th>
                <th className="px-4 py-2 text-left">Yearly</th>
                <th className="px-4 py-2 text-left">Tier</th>
                <th className="px-4 py-2 text-left">Stripe Monthly</th>
                <th className="px-4 py-2 text-left">Stripe Yearly</th>
                <th className="px-4 py-2 text-left">Stripe Product</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Features</th>
                <th className="px-4 py-2 text-left">Includes Device</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedPlans.map((plan) => (
                <tr key={plan.id} className={isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}>
                  <td className="px-4 py-2 font-semibold">{plan.name}</td>
                  <td className="px-4 py-2">£{(plan.price_monthly / 100).toFixed(2)}</td>
                  <td className="px-4 py-2">£{(plan.price_yearly / 100).toFixed(2)}</td>
                  <td className="px-4 py-2">{plan.tier ?? '-'}</td>
                  <td className="px-4 py-2 text-xs">{plan.stripe_price_id_monthly || "-"}</td>
                  <td className="px-4 py-2 text-xs">{plan.stripe_price_id_yearly || "-"}</td>
                  <td className="px-4 py-2 text-xs">{plan.stripe_product_id || "-"}</td>
                  <td className="px-4 py-2 text-xs max-w-xs truncate">{plan.description || "-"}</td>
                  <td className="px-4 py-2 text-xs max-w-xs truncate">
                    {Array.isArray(plan.features) ? plan.features.join(', ') : JSON.stringify(plan.features) || "-"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {plan.include_device ? (
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-purple-400">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {plan.is_active ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEditPlan(plan)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDeletePlan(plan)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Showing {startIndex + 1} to {Math.min(startIndex + plansPerPage, filteredPlans.length)} of {filteredPlans.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? isDarkMode
                      ? "cursor-not-allowed bg-gray-800 text-gray-600"
                      : "cursor-not-allowed bg-gray-100 text-gray-400"
                    : isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-purple-600 text-white"
                      : isDarkMode
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? isDarkMode
                      ? "cursor-not-allowed bg-gray-800 text-gray-600"
                      : "cursor-not-allowed bg-gray-100 text-gray-400"
                    : isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
        </>
      )}
    </div>
  )
}