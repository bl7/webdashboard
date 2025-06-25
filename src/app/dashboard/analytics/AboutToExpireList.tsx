"use client"
import { useIngredients, Ingredient } from "@/hooks/useIngredients"
import { useMenuItems, MenuItem } from "@/hooks/useMenuItem"
import React, { useEffect, useState } from "react"
import AppLoader from "@/components/AppLoader"

type ExpiringItem = { name: string; type: string; expiresAt: string }

type PrintLog = {
  details: {
    itemId: string
    labelType: string
    printedAt: string
    // ...other fields
  }
  action: string
}

function AboutToExpireSkeleton() {
  return (
    <div className="mt-8">
      <div className="mb-4 h-6 w-1/3 animate-pulse rounded bg-muted-foreground/20" />
      <ul className="space-y-2">
        {[1, 2, 3].map((i) => (
          <li key={i} className="h-6 w-2/3 animate-pulse rounded bg-muted-foreground/10" />
        ))}
      </ul>
    </div>
  )
}

export default function AboutToExpireList() {
  const { ingredients } = useIngredients()
  const { menuItems } = useMenuItems()
  const [aboutToExpire, setAboutToExpire] = useState<ExpiringItem[]>([])
  const [loading, setLoading] = useState(true) // <-- Add loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true) // Start loading
      const userId = typeof window !== "undefined" ? localStorage.getItem("userid") : null
      if (!userId) {
        setLoading(false)
        return
      }
      const res = await fetch(`/api/logs?user_id=${userId}`)
      const data = await res.json()
      const printLogs: PrintLog[] = (data.logs || []).filter(
        (log: PrintLog) => log.action === "print_label"
      )

      const result: ExpiringItem[] = []

      // Ingredients
      for (const ing of ingredients as Ingredient[]) {
        if ((ing as any).type === "ppds") continue
        const latestLog = printLogs
          .filter(
            (log: PrintLog) =>
              log.details.itemId === ing.uuid && log.details.labelType === "ingredient"
          )
          .sort(
            (a: PrintLog, b: PrintLog) =>
              new Date(b.details.printedAt).getTime() - new Date(a.details.printedAt).getTime()
          )[0]
        if (!latestLog) continue
        const printedAt = latestLog.details.printedAt
        const expiryDate = new Date(
          new Date(printedAt).getTime() + ing.expiryDays * 24 * 60 * 60 * 1000
        )
        const now = new Date()
        const hoursLeft = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60)
        if (hoursLeft > 0 && hoursLeft <= 24) {
          result.push({
            name: ing.ingredientName,
            type: "Ingredient",
            expiresAt: expiryDate.toLocaleString(),
          })
        }
      }

      // Menu Items
      for (const menu of menuItems as MenuItem[]) {
        if ((menu as any).type === "ppds") continue
        const latestLog = printLogs
          .filter(
            (log: PrintLog) => log.details.itemId === menu.id && log.details.labelType === "menu"
          )
          .sort(
            (a: PrintLog, b: PrintLog) =>
              new Date(b.details.printedAt).getTime() - new Date(a.details.printedAt).getTime()
          )[0]
        if (!latestLog) continue
        const printedAt = latestLog.details.printedAt
        // MenuItem does not have expiryDays, so use 1 as default
        const expiryDays = (menu as any).expiryDays || 1
        const expiryDate = new Date(
          new Date(printedAt).getTime() + expiryDays * 24 * 60 * 60 * 1000
        )
        const now = new Date()
        const hoursLeft = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60)
        if (hoursLeft > 0 && hoursLeft <= 24) {
          result.push({
            name: menu.name,
            type: "Menu Item",
            expiresAt: expiryDate.toLocaleString(),
          })
        }
      }

      setAboutToExpire(result)
      setLoading(false) // Done loading
    }
    fetchData()
  }, [ingredients, menuItems])

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-bold">About to Expire (Next 24h)</h2>
      {loading ? (
        <AboutToExpireSkeleton />
      ) : aboutToExpire.length === 0 ? (
        <div className="text-gray-500">No ingredients or menu items are about to expire.</div>
      ) : (
        <ul className="space-y-2">
          {aboutToExpire.map((item, idx) => (
            <li key={idx} className="border-b pb-2">
              <span className="font-semibold">{item.name}</span> ({item.type}) —{" "}
              <span className="text-red-600">Expires at: {item.expiresAt}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
