"use client"

import React, { useEffect, useState, useMemo, useRef } from "react"
import { PrintQueueItem } from "@/types/print"
import { getAllAllergens } from "@/lib/api"
import { getAllMenuItems, getAllIngredients } from "@/lib/api"
import { Allergen } from "@/types/allergen"
import LabelPreview from "./PreviewLabel"
import { formatLabelForPrintImage } from "./labelFormatter"
import LabelHeightChooser, { LabelHeight } from "./LabelHeightChooser"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { usePrinter } from "@/context/PrinterContext"
import { logAction } from "@/lib/logAction"
import { Button } from "@/components/ui/button"
import useBillingData from "../profile/hooks/useBillingData"

// Define Printer type locally to match PrinterContext
interface Printer {
  name: string
  systemName: string
  driverName: string
  state: string
  location: string
  isDefault: boolean
}

function getPrinterName(printer: any): string {
  if (!printer) return '';
  if (typeof printer === 'string') return printer;
  if (typeof printer.name === 'object' && typeof printer.name.name === 'string') return printer.name.name;
  if (typeof printer.name === 'string') return printer.name;
  return '';
}

const itemsPerPage = 5

function calculateExpiryDate(days: number): string {
  const today = new Date()
  today.setDate(today.getDate() + days)
  return today.toISOString().split("T")[0]
}

function getDefaultExpiryDays(type: "cooked" | "prep" | "ppds"): number {
  switch (type) {
    case "cooked":
      return 1
    case "prep":
      return 3
    case "ppds":
      return 5
    default:
      return 3
  }
}

type TabType = "ingredients" | "menu"

type IngredientItem = {
  id: number | string
  name: string
  allergens: Allergen[]
  printedOn: string
  expiryDate: string
}

type MenuItem = {
  id: number | string
  name: string
  printedOn: string
  expiryDate: string
  ingredients: string[]
}

// Enhanced getBestAvailablePrinter function for robust printer selection
function getBestAvailablePrinter(
  selectedPrinter: Printer | null,
  defaultPrinter: Printer | null,
  availablePrinters: Printer[]
): { printer: Printer | null; reason: string } {
  console.log("🖨️ Printer Selection Debug:", {
    selectedPrinter: selectedPrinter?.name,
    defaultPrinter: defaultPrinter?.name,
    availablePrinters: availablePrinters?.slice(0, 5).map(p => p.name), // Limit log spam
    availableCount: availablePrinters?.length || 0
  });

  // Ensure we have a valid array
  const validPrinters = (availablePrinters || []).filter(printer => {
    const name = getPrinterName(printer);
    return (
      name &&
      name.trim() !== "" &&
      name !== "Fallback_Printer" &&
      !name.toLowerCase().includes('fallback')
    );
  });

  console.log("🖨️ Valid printers after filtering:", validPrinters.map(p => p.name));

  // First priority: selected printer (if it exists in valid printers)
  if (selectedPrinter && 
      selectedPrinter.name !== "Fallback_Printer" && 
      validPrinters.some(p => p.name === selectedPrinter.name)) {
    console.log("🖨️ ✅ Using selected printer:", selectedPrinter.name);
    return { printer: selectedPrinter, reason: "Selected printer available" };
  }
  
  // Second priority: default printer (if it exists in valid printers)
  if (defaultPrinter && 
      defaultPrinter.name !== "Fallback_Printer" && 
      validPrinters.some(p => p.name === defaultPrinter.name)) {
    console.log("🖨️ ✅ Using default printer:", defaultPrinter.name);
    return { printer: defaultPrinter, reason: "Default printer available" };
  }
  
  // Third priority: first available valid printer
  if (validPrinters.length > 0) {
    console.log("🖨️ ✅ Using first available printer:", validPrinters[0].name);
    return { printer: validPrinters[0], reason: "First available printer" };
  }
  
  console.log("🖨️ ❌ No valid printers found");
  return { printer: null, reason: "No valid printers available" };
}

export default function LabelDemo() {
  const [selectedPrinterName, setSelectedPrinterName] = useState<string>('');
  const [printQueue, setPrintQueue] = useState<PrintQueueItem[]>([])
  const [allergens, setAllergens] = useState<Allergen[]>([])
  const [customExpiry, setCustomExpiry] = useState<Record<string, string>>({})
  const [ingredients, setIngredients] = useState<IngredientItem[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [activeTab, setActiveTab] = useState<TabType>("ingredients")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expiryDays, setExpiryDays] = useState<Record<string, string>>({})
  const [customInitials, setCustomInitials] = useState<string[]>([])
  const [useInitials, setUseInitials] = useState<boolean>(true)
  const [selectedInitial, setSelectedInitial] = useState<string>("")

  const [feedbackMsg, setFeedbackMsg] = useState<string>("")
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("")
  const feedbackTimeout = useRef<NodeJS.Timeout | null>(null)
  const {
    isConnected,
    printers: availablePrinters,
    defaultPrinter,
    selectedPrinter,
    selectPrinter,
    reconnect,
    loading: printerLoading,
    error: printerError,
    print,
  } = usePrinter()
  const [labelHeight, setLabelHeight] = useState<LabelHeight>("40mm")
  const [showDefrostModal, setShowDefrostModal] = useState(false)
  const [showUseFirstModal, setShowUseFirstModal] = useState(false)
  const [useFirstQuantity, setUseFirstQuantity] = useState(1)

  // Add state for defrost search
  const [defrostSearch, setDefrostSearch] = useState("")

  // OS detection
  const [osType, setOsType] = useState<'mac' | 'windows' | 'other'>('other');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const platform = window.navigator.platform.toLowerCase();
      if (platform.includes('mac')) setOsType('mac');
      else if (platform.includes('win')) setOsType('windows');
      else setOsType('other');
    }
  }, []);
  useEffect(() => {
    console.log('[Label Print] Detected OS:', osType);
  }, [osType]);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userid") || "test-user" : "test-user"
  // Subscription status logic
  const { subscription, loading: subLoading } = useBillingData(userId)
  const subBlocked = !subscription || (subscription.status !== "active" && subscription.status !== "trialing")
  // Optionally, keep subStatusMsg for warnings about expiring subscriptions
  const [subStatusMsg, setSubStatusMsg] = useState<string | null>(null)

  const showFeedback = (msg: string, type: "success" | "error" = "success") => {
    setFeedbackMsg(msg)
    setFeedbackType(type)
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current)
    feedbackTimeout.current = setTimeout(() => {
      setFeedbackMsg("")
      setFeedbackType("")
    }, 3000)
  }

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.error("No token found")
          return
        }

        const [settingsRes, initialsRes] = await Promise.all([
          fetch(`/api/label-settings`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }),
          fetch(`/api/label-initials`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }),
        ])

        const settingsData = await settingsRes.json()
        const initialsData = await initialsRes.json()

        const expiryMap = Object.fromEntries(
          (settingsData.settings || []).map((item: any) => [
            item.label_type,
            item.expiry_days.toString(),
          ])
        )
        setExpiryDays(expiryMap)
        setUseInitials(initialsData.use_initials)
        setCustomInitials(initialsData.initials || [])
      } catch (err) {
        console.error("Failed to load settings:", err)
        showFeedback("Failed to load settings", "error")
      }
    }

    fetchSettings()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [activeTab, searchTerm])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    getAllAllergens(token)
      .then((res) => res?.data && setAllergens(res.data))
      .catch((err) => console.error("Allergen error", err))
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    setIsLoading(true)
    getAllIngredients(token)
      .then((data) => {
        const items = (Array.isArray(data) ? data : data.data) || []
        const formatted = items
          .map((item: any, i: number) => ({
            id: item.ingredientID ?? `ingredient-${i}-${Date.now()}`,
            name: item.ingredientName || `Ingredient ${i + 1}`,
            allergens: item.allergens || [],
            printedOn: item.printedOn || new Date().toISOString().split("T")[0],
            expiryDate: calculateExpiryDate(item.expiryDays || 7),
          }))
          .filter((i: { name: string }) => i.name && i.name.trim() !== "")
        setIngredients(formatted)
      })
      .catch((err) => setError(`Ingredient error: ${err.message}`))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    setIsLoading(true)
    getAllMenuItems(token)
      .then((res) => {
        const categories = res?.data || []
        const formatted: MenuItem[] = []
        let i = 0
        for (const category of categories) {
          for (const item of category.items || []) {
            const id = item.menuItemID ?? `menu-${i}-${Date.now()}`
            const name = item.menuItemName || `Menu Item ${i + 1}`
            if (name && name.trim()) {
              formatted.push({
                id,
                name,
                printedOn: new Date().toISOString().split("T")[0],
                expiryDate: calculateExpiryDate(
                  parseInt(expiryDays["cooked"] || "") || getDefaultExpiryDays("cooked")
                ),
                ingredients:
                  item.ingredients?.map((ing: any) => ing.ingredientName || "Unknown") || [],
              })
            }
            i++
          }
        }
        setMenuItems(formatted)
      })
      .catch((err) => setError(`Menu fetch error: ${err.message}`))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (!subscription) return
    let msg = null
    const now = new Date()
    if (subscription.current_period_end) {
      const end = new Date(subscription.current_period_end)
      const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      if (daysLeft < 0) {
        msg = "Your subscription has expired. Printing is disabled."
      } else if (daysLeft <= 3) {
        msg = `Your subscription will expire in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Please renew soon.`
      }
    }
    setSubStatusMsg(msg)
  }, [subscription])

  const filteredIngredients = useMemo(
    () =>
      !searchTerm
        ? ingredients
        : ingredients.filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [ingredients, searchTerm]
  )
  const filteredMenuItems = useMemo(
    () =>
      !searchTerm
        ? menuItems
        : menuItems.filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [menuItems, searchTerm]
  )
  const paginatedIngredients = useMemo(
    () => filteredIngredients.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [filteredIngredients, page]
  )
  const paginatedMenuItems = useMemo(
    () => filteredMenuItems.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [filteredMenuItems, page]
  )

  // Filter defrost ingredients based on search
  const filteredDefrostIngredients = ingredients.filter((ing) =>
    ing.name.toLowerCase().includes(defrostSearch.toLowerCase())
  )

  // Filter defrost menu items based on search
  const filteredDefrostMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(defrostSearch.toLowerCase())
  )

  // Get the current filtered items based on selected tab
  const currentDefrostItems = filteredDefrostIngredients

  const handleExpiryChange = (uid: string, value: string) =>
    setCustomExpiry((prev) => ({ ...prev, [uid]: value }))

  const addToPrintQueue = (item: IngredientItem | MenuItem, type: TabType) => {
    const uniqueId = `${type}-${item.id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    if (printQueue.some((q) => q.id === item.id && q.type === type)) return

    const base: Omit<PrintQueueItem, "allergens" | "ingredients" | "labelType"> = {
      uid: uniqueId,
      id: item.id,
      type,
      name: item.name && item.name.trim() !== "" ? item.name : "Unnamed Item",
      quantity: 1,
      printedOn: item.printedOn,
      expiryDate: item.expiryDate,
    }

    const newItem: PrintQueueItem =
      type === "ingredients"
        ? { ...base, allergens: (item as IngredientItem).allergens }
        : {
            ...base,
            ingredients: (item as MenuItem).ingredients,
            allergens: (item as any).allergens, // Fix: set allergens for menu items
            labelType: "cooked" as "cooked",
          }

    setPrintQueue((prev) => [...prev, newItem])
  }

  const updateQuantity = (uid: string, quantity: number) =>
    setPrintQueue((prev) =>
      prev.map((q) => (q.uid === uid ? { ...q, quantity: Math.max(1, quantity) } : q))
    )

  const updateLabelType = (uid: string, labelType: "cooked" | "prep" | "ppds") =>
    setPrintQueue((prev) =>
      prev.map((q) =>
        q.uid === uid
          ? {
              ...q,
              labelType,
              expiryDate: calculateExpiryDate(
                parseInt(expiryDays[labelType] || "") || getDefaultExpiryDays(labelType)
              ),
            }
          : q
      )
    )

  const removeFromQueue = (uid: string) =>
    setPrintQueue((prev) => prev.filter((q) => q.uid !== uid))

  const clearPrintQueue = () => setPrintQueue([])

  const printLabels = async (): Promise<void> => {
    if (subBlocked) {
      showFeedback("Printing is disabled due to your subscription status.", "error")
      return
    }
    if (printQueue.length === 0) {
      showFeedback("No items in print queue", "error")
      return
    }

    if (printerLoading) {
      showFeedback("Checking printer status, please wait...", "error")
      return
    }

    console.log("🖨️ Starting print process for", printQueue.length, "items")
    
    // Get the best available printer using our helper function
    const printerSelection = getBestAvailablePrinter(selectedPrinter, defaultPrinter, availablePrinters)
    
    if (!isConnected) {
      console.warn("⚠️ Printer not connected, but allowing print for debug purposes")
      showFeedback("Printer not connected - printing for debug", "error")
      // Don't return, continue with printing for debug
    }

    if (!printerSelection.printer) {
      console.warn("⚠️ No printer available, but allowing print for debug purposes")
      // Don't return, continue with printing for debug
    }

    setIsLoading(true)
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    let successCount = 0
    let failCount = 0
    const failItems: string[] = []

    try {
      for (const item of printQueue) {
        for (let i = 0; i < item.quantity; i++) {
          try {
            console.log(`🖨️ Processing item ${i + 1}/${item.quantity}: ${item.name}`)
            
            // Generate label image
            const imageDataUrl = await formatLabelForPrintImage(
              item,
              allergens.map((a) => a.allergenName.toLowerCase()),
              customExpiry,
              5,
              useInitials,
              selectedInitial,
              labelHeight,
              ingredients.map(ing => ({ uuid: String(ing.id), ingredientName: ing.name, allergens: ing.allergens || [] }))
            );

            console.log(`🖨️ Image generated for ${item.name}, length: ${imageDataUrl.length}`)

            // Revert to sending the same print request for all OSes
            if (isConnected) {
              await print(imageDataUrl, undefined, { labelHeight });
            } else {
              console.log('🖨️ DEBUG: Would print image data:', imageDataUrl.substring(0, 100) + '...');
            }

            // Log the print action
            await logAction("print_label", {
              labelType: item.labelType || item.type,
              itemId: item.uid || item.id,
              itemName: item.name,
              quantity: item.quantity || 1,
              printedAt: new Date().toISOString(),
              expiryDate: item.expiryDate || calculateExpiryDate(
                parseInt(expiryDays[item.labelType || "cooked"] || "") || 
                getDefaultExpiryDays(item.labelType as "cooked" | "prep" | "ppds")
              ),
              initial: selectedInitial,
              labelHeight: labelHeight,
              printerUsed: printerSelection.printer || 'Debug Mode',
              sessionId,
            });

            successCount++;
          } catch (itemErr) {
            failCount++;
            failItems.push(item.name);
            console.error("❌ Print error for item", item.name, itemErr);
          }
        }
      }

      if (failCount === 0) {
        const message = isConnected 
          ? `Successfully printed ${successCount} labels using ${printerSelection.printer?.name}`
          : `DEBUG: Would print ${successCount} labels (printer not connected)`;
        showFeedback(message, "success");
        
        // Clear print queue and reset form after successful print
        setPrintQueue([]);
        setCustomExpiry({});
      } else {
        showFeedback(`Printed ${successCount} labels, failed ${failCount}: ${failItems.join(", ")}`, "error");
      }
    } catch (err) {
      console.error("❌ Print process error:", err);
      showFeedback(`Print failed: ${err instanceof Error ? err.message : String(err)}`, "error");
    } finally {
      setIsLoading(false);
    }
  }

  // Handler for "Use First"
  const handleUseFirstPrint = async (quantity: number = 1) => {
    if (subBlocked) {
      showFeedback("Printing is disabled due to your subscription status.", "error")
      return
    }
    if (printerLoading) {
      showFeedback("Checking printer status, please wait...", "error")
      return
    }
    
    if (!isConnected) {
      console.warn("⚠️ Printer not connected, but allowing print for debug purposes")
      showFeedback("Printer not connected - printing for debug", "error")
      // Don't return, continue with printing for debug
    }

    // Get the best available printer using our helper function
    const printerToUse = getBestAvailablePrinter(selectedPrinter, defaultPrinter, availablePrinters)
    
    if (!printerToUse.printer) {
      console.warn("⚠️ No printer available, but allowing print for debug purposes")
      // Don't return, continue with printing for debug
    }

    try {
      // Create a "USE FIRST" item for LabelRender
      const now = new Date()
      const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      
      const useFirstItem: PrintQueueItem = {
        uid: `use-first-${Date.now()}`,
        id: "use-first",
        type: "ingredients",
        name: "USE FIRST",
        quantity: 1,
        printedOn: now.toISOString().split("T")[0],
        expiryDate: expiry.toISOString().split("T")[0],
        allergens: [],
        labelType: "prep" as const,
      }

      // Print multiple labels based on quantity
      for (let i = 0; i < quantity; i++) {
        // Generate "USE FIRST" label image using LabelRender
        const imageDataUrl = await formatLabelForPrintImage(
          useFirstItem,
          allergens.map((a) => a.allergenName.toLowerCase()),
          {},
          5,
          useInitials,
          selectedInitial,
          labelHeight
        )
        
        // Print using WebSocket (if connected) or just log for debug
        if (isConnected) {
          await print(imageDataUrl, undefined, { labelHeight });
          console.log(`✅ Printed USE FIRST label ${i + 1}/${quantity}`)
        } else {
          console.log(`🖨️ DEBUG: Would print USE FIRST label ${i + 1}/${quantity}:`, imageDataUrl.substring(0, 100) + "...")
        }
      }

      const message = isConnected 
        ? `Successfully printed ${quantity} USE FIRST label(s) using ${printerToUse.printer?.name}`
        : `DEBUG: Would print ${quantity} USE FIRST label(s) (printer not connected)`;
      showFeedback(message, "success")

      await logAction("print_label", {
        labelType: "use_first",
        itemName: "USE FIRST",
        quantity: quantity,
        printedAt: new Date().toISOString(),
        expiryDate: expiry.toISOString().split("T")[0],
        initial: selectedInitial,
        labelHeight: labelHeight,
        printerUsed: printerToUse.printer || 'Debug Mode',
      })
    } catch (err) {
      console.error("USE FIRST print error:", err)
      showFeedback(`Print failed: ${err instanceof Error ? err.message : String(err)}`, "error")
    }
  }

  // Handler for "Defrost"
  const handleDefrostPrint = async (ingredient: IngredientItem) => {
    if (subBlocked) {
      showFeedback("Printing is disabled due to your subscription status.", "error")
      return
    }
    setShowDefrostModal(false)
    
    if (printerLoading) {
      showFeedback("Checking printer status, please wait...", "error")
      return
    }
    
    if (!isConnected) {
      console.warn("⚠️ Printer not connected, but allowing print for debug purposes")
      showFeedback("Printer not connected - printing for debug", "error")
      // Don't return, continue with printing for debug
    }

    // Get the best available printer using our helper function
    const printerToUse = getBestAvailablePrinter(selectedPrinter, defaultPrinter, availablePrinters)
    
    if (!printerToUse.printer) {
      console.warn("⚠️ No printer available, but allowing print for debug purposes")
      // Don't return, continue with printing for debug
    }

    try {
      // Create a defrost item for LabelRender
      const now = new Date()
      const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      
      const defrostItem: PrintQueueItem = {
        uid: `defrost-${ingredient.id}-${Date.now()}`,
        id: ingredient.id,
        type: "ingredients",
        name: `${ingredient.name} (defrosted)`,
        quantity: 1,
        printedOn: now.toISOString().split("T")[0],
        expiryDate: expiry.toISOString().split("T")[0],
        allergens: ingredient.allergens,
        labelType: "prep" as const,
      }

      // Generate defrost label image using LabelRender
      const imageDataUrl = await formatLabelForPrintImage(
        defrostItem,
        allergens.map((a) => a.allergenName.toLowerCase()),
        {},
        5,
        useInitials,
        selectedInitial,
        labelHeight
      )
      
      // Print using WebSocket (if connected) or just log for debug
      if (isConnected) {
        await print(imageDataUrl, undefined, { labelHeight });
      } else {
        console.log("🖨️ DEBUG: Would print defrost label:", imageDataUrl.substring(0, 100) + "...")
        showFeedback("DEBUG: Would print defrosted label (printer not connected)", "success")
      }

      await logAction("print_label", {
        labelType: "defrost",
        itemName: ingredient.name,
        printedAt: new Date().toISOString(),
        expiryDate: expiry.toISOString().split("T")[0],
        initial: selectedInitial,
        labelHeight: labelHeight,
        printerUsed: printerToUse.printer || 'Debug Mode',
      })
    } catch (err) {
      console.error("Defrost print error:", err)
      showFeedback(`Print failed: ${err instanceof Error ? err.message : String(err)}`, "error")
    }
  }

  const totalItems =
    activeTab === "ingredients" ? filteredIngredients.length : filteredMenuItems.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Show skeleton if loading and no data loaded yet
  const initialDataLoading = isLoading && ingredients.length === 0 && menuItems.length === 0

  if (initialDataLoading) {
    return <PrintPageSkeleton />
  }

  return (
    <div className="space-y-10 py-8 px-2 md:px-8 bg-gray-50 min-h-screen">
      {subStatusMsg && (
        <div className={`rounded-xl p-4 mb-6 border-2 ${subBlocked ? 'bg-red-100 text-red-800 border-red-300' : 'bg-yellow-50 text-yellow-900 border-yellow-200'}`}> {subStatusMsg} </div>
      )}
      
      {/* Server Download Notice - Show when printer is not connected */}
      {!isConnected && (
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-purple-600 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-purple-800 mb-1">Need the printer server?</h4>
              <p className="text-sm text-purple-700 mb-2">
                If you don't have the printer server installed, you can download it from the Settings page.
              </p>
              <a 
                href="/dashboard/settings" 
                className="inline-flex items-center px-3 py-1 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition-colors"
              >
                Go to Settings →
              </a>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Section: Label Printer & List */}
        <div className="flex-1 min-w-[340px]">
          <div className="bg-white rounded-xl shadow-lg border p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold tracking-tight">Label Printer</h1>
              {isConnected ? (
                <>
                  {console.log('Available printers:', availablePrinters)}
                  <div className="mb-4 p-4 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-sm">
                    <div className="font-semibold text-purple-900 mb-2">Available Printers</div>
                    {availablePrinters.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        <select
                          value={selectedPrinterName}
                          onChange={e => {
                            setSelectedPrinterName(e.target.value);
                            const printer = availablePrinters.find((p: any) => getPrinterName(p) === e.target.value);
                            selectPrinter(printer || null);
                          }}
                          className="rounded border border-purple-300 bg-white px-2 py-1 text-sm text-black"
                        >
                          <option value="">Select Printer</option>
                          {availablePrinters.map((printer: any) => {
                            const printerName = getPrinterName(printer);
                            return (
                              <option key={printerName} value={printerName}>
                                {printerName} {printer.isDefault ? '(Default)' : ''}
                              </option>
                            );
                          })}
                        </select>
                        <div className="text-xs text-gray-700 mt-1">
                          {availablePrinters.length} printer(s) detected
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">No printers detected</div>
                    )}
                  </div>
                </>
              ) : (
                <div className="mb-4 p-4 rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white shadow-sm text-red-700">
                  No printers detected
                </div>
              )}
            </div>
            <LabelHeightChooser
              selectedHeight={labelHeight}
              onHeightChange={setLabelHeight}
              className="mb-4"
            />
          </div>
          <div className="bg-white rounded-xl shadow-lg border p-6">
            {/* Tab Switcher */}
            <div className="mb-6 flex w-fit items-center space-x-2 rounded-full bg-gray-100 p-1">
              <button
                className={`rounded-full px-5 py-2 text-base font-medium transition-all ${activeTab === "ingredients" ? "bg-purple-600 text-white shadow" : "text-gray-500 hover:text-purple-700"}`}
                onClick={() => setActiveTab("ingredients")}
              >Ingredients</button>
              <button
                className={`rounded-full px-5 py-2 text-base font-medium transition-all ${activeTab === "menu" ? "bg-purple-600 text-white shadow" : "text-gray-500 hover:text-purple-700"}`}
                onClick={() => setActiveTab("menu")}
              >Menu Items</button>
            </div>
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ingredients or menu items..."
                className="w-full rounded-lg border-2 border-purple-200 px-5 py-3 text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {/* Ingredient/Menu List */}
            <div className="mb-8">
              {(activeTab === "ingredients"
                ? (paginatedIngredients as IngredientItem[])
                : (paginatedMenuItems as MenuItem[])
              ).map((item, idx) => {
                return (
                  <div key={item.id} className="mb-3 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 hover:shadow-md transition">
                    {activeTab === "ingredients" ? (
                      <>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 whitespace-normal break-words">{item.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => addToPrintQueue(item, activeTab)}
                            disabled={printQueue.some((q) => q.id === item.id && q.type === activeTab)}
                            variant="purple"
                          >{printQueue.some((q) => q.id === item.id && q.type === activeTab) ? "Added" : "Add"}</Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Menu item rendering (keep as is, or add icons/badges if needed) */}
                          <p className="font-semibold truncate text-gray-900">{item.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => addToPrintQueue(item, activeTab)}
                            disabled={printQueue.some((q) => q.id === item.id && q.type === activeTab)}
                            variant="purple"
                          >{printQueue.some((q) => q.id === item.id && q.type === activeTab) ? "Added" : "Add"}</Button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} variant="outline" className="flex items-center gap-1"><ChevronLeftIcon className="h-4 w-4" /></Button>
                <span className="min-w-[80px] text-center text-sm text-gray-700">{page} of {totalPages}</span>
                <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} variant="outline" className="flex items-center gap-1"><ChevronRightIcon className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        </div>
        {/* Right Section: Print Queue */}
        <div className="flex-1 min-w-[340px]">
          {/* Print Queue and Label Preview */}
          {/* At the top of the right section, show either the initials chooser or a message if useInitials is off */}
          {(useInitials && customInitials.length > 0) ? (
            <div className="mb-6 border rounded-xl bg-white px-6 py-4 flex items-center gap-4 shadow-sm">
              <label htmlFor="initials-select" className="text-base font-semibold text-gray-800">Initials:</label>
              <select
                id="initials-select"
                value={selectedInitial}
                onChange={e => setSelectedInitial(e.target.value)}
                className="rounded border px-3 py-2 text-base"
              >
                <option value="">--</option>
                {customInitials.map((init, idx) => (
                  <option key={init + idx} value={init}>{init}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-6 border rounded-xl bg-white px-6 py-4 flex items-center gap-4 shadow-sm">
              <span className="text-base text-gray-700">To use initials, enable them in <b>Settings</b>.</span>
            </div>
          )}
          <div className="mb-8 max-h-[700px] w-full overflow-y-auto rounded-2xl border-2 border-purple-300 bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b-2 border-purple-200 bg-white px-8 pb-4 pt-8 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-purple-800 tracking-tight">Print Queue</h2>
              <div className="flex gap-2">
                <Button onClick={printLabels} disabled={printQueue.length === 0 || subBlocked || availablePrinters.length === 0} variant="purple" title={subBlocked ? "Printing is disabled due to your subscription status." : printQueue.length === 0 ? "No items in print queue" : availablePrinters.length === 0 ? "No printers available" : "Print all labels in queue"}>Print Labels</Button>
                <Button onClick={clearPrintQueue} disabled={printQueue.length === 0} variant="outline" aria-label="Clear print queue">Clear Queue</Button>
              </div>
            </div>
            <div className="px-8 pb-8 pt-4">
              {printQueue.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <svg className="mb-4 h-12 w-12 text-purple-200" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01" /></svg>
                  <p className="italic text-lg text-gray-400">Your print queue is empty.<br />Add items to get started!</p>
                </div>
              ) : (
                printQueue.filter(item => item.name && item.name.trim() !== "").map((item) => (
                  <div key={item.uid} className="mb-4 flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 transition-shadow hover:shadow-lg">
                    <div className="font-semibold text-gray-900 break-words whitespace-normal">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500">Expires: {item.expiryDate}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <input type="number" min={1} value={item.quantity} onChange={(e) => updateQuantity(item.uid, Number(e.target.value))} className="w-16 rounded-md border border-gray-300 bg-white px-3 py-1 text-center text-sm text-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
                      {"labelType" in item && (
                        <select value={item.labelType || "cooked"} onChange={(e) => updateLabelType(item.uid, e.target.value as "cooked" | "prep" | "ppds")} className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                          <option value="cooked">Cook</option>
                          <option value="prep">Prep</option>
                          <option value="ppds">PPDS</option>
                        </select>
                      )}
                      <Button onClick={() => removeFromQueue(item.uid)} variant="outline" className="bg-red-600 text-white hover:bg-red-700 focus:bg-red-700 border-none shadow-none" aria-label={`Remove ${item.name} from queue`}>Remove</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Label Preview below the print queue */}
          <LabelPreview
            printQueue={printQueue}
            ALLERGENS={allergens.map((a) => a.allergenName.toLowerCase())}
            customExpiry={customExpiry}
            onExpiryChange={handleExpiryChange}
            useInitials={useInitials}
            selectedInitial={selectedInitial}
            labelHeight={labelHeight}
            allIngredients={ingredients.map(ing => ({ uuid: String(ing.id), ingredientName: ing.name, allergens: ing.allergens || [] }))}
          />
        </div>
      </div>
      {/* Floating Action Buttons: Use First & Defrost */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
        <Button onClick={() => setShowUseFirstModal(true)} className="rounded-full px-8 py-4 text-lg font-bold shadow-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white" aria-label="Print USE FIRST label" tabIndex={0} disabled={subBlocked} title={subBlocked ? "Printing is disabled due to your subscription status." : undefined}>
          USE FIRST
        </Button>
        <Button onClick={() => setShowDefrostModal(true)} className="rounded-full px-8 py-4 text-lg font-bold shadow-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white" aria-label="Print Defrosted label" tabIndex={0} disabled={subBlocked} title={subBlocked ? "Printing is disabled due to your subscription status." : undefined}>
          DEFROST
        </Button>
      </div>
      {/* Use First and Defrost modals remain unchanged */}
      {showUseFirstModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">How many USE FIRST labels?</h2>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={useFirstQuantity}
                onChange={(e) => setUseFirstQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded border px-3 py-2"
                placeholder="Enter quantity..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                variant="purple"
                onClick={() => {
                  handleUseFirstPrint(useFirstQuantity)
                  setShowUseFirstModal(false)
                }}
              >
                Print {useFirstQuantity} Label{useFirstQuantity !== 1 ? 's' : ''}
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => setShowUseFirstModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {showDefrostModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Select Item to Defrost</h2>
            
            <input
              type="text"
              value={defrostSearch}
              onChange={(e) => setDefrostSearch(e.target.value)}
              placeholder="Search ingredients..."
              className="mb-3 w-full rounded border px-3 py-2"
            />
            <ul className="mb-4 max-h-60 overflow-y-auto">
              {currentDefrostItems.map((item) => (
                <li key={item.id} className="mb-2">
                  <Button
                    className="w-full text-left"
                    variant="ghost"
                    onClick={() => handleDefrostPrint(item as IngredientItem)}
                  >
                    {item.name}
                  </Button>
                </li>
              ))}
              {currentDefrostItems.length === 0 && (
                <li className="px-4 py-2 text-gray-400">
                  No ingredients found.
                </li>
              )}
            </ul>
            <Button
              className="mt-2 w-full"
              variant="outline"
              onClick={() => setShowDefrostModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function PrintPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-8">
        <div className="w-1/2">
          <div className="mb-4 h-8 w-1/2 animate-pulse rounded bg-muted-foreground/20" />
          <div className="mb-4 h-10 w-full animate-pulse rounded bg-muted-foreground/10" />
        </div>
        <div className="w-1/2">
          <div className="mb-4 h-8 w-1/2 animate-pulse rounded bg-muted-foreground/20" />
          <div className="mb-4 h-10 w-full animate-pulse rounded bg-muted-foreground/10" />
        </div>
      </div>
      <div className="flex gap-8">
        <div className="w-1/2">
          <div className="mb-6 h-10 w-1/2 animate-pulse rounded bg-muted-foreground/20" />
          <div className="mb-4 h-10 w-full animate-pulse rounded bg-muted-foreground/10" />
          <div className="h-64 w-full animate-pulse rounded bg-muted-foreground/10" />
        </div>
        <div className="w-1/2">
          <div className="mb-4 h-8 w-1/2 animate-pulse rounded bg-muted-foreground/20" />
          <div className="h-96 w-full animate-pulse rounded bg-muted-foreground/10" />
        </div>
      </div>
    </div>
  )
}

async function printSimpleLabel(html: string, labelHeight: LabelHeight = "40mm") {
  console.log("🧪 Testing simple label generation...")
  
  // Convert label height to cm, reducing by 0.5mm to prevent bottom cutoff
  const heightCm = labelHeight === "31mm" ? "3.05cm" : labelHeight === "40mm" ? "3.95cm" : "7.95cm"
  
  const container = document.createElement("div")
  container.style.position = "absolute"
  container.style.top = "0"
  container.style.left = "0"
  container.style.width = "5.6cm"
  container.style.height = heightCm
  container.style.background = "white"
  container.style.display = "flex"
  container.style.flexDirection = "column"
  container.style.justifyContent = "center"
  container.style.alignItems = "center"
  container.style.fontFamily = "monospace"
  container.style.border = "2px solid black"
  container.style.borderRadius = "6px"
  container.style.padding = "6px" // Reduced padding to remove top gap
  container.style.boxSizing = "border-box"
  container.style.zIndex = "-1"
  container.style.visibility = "hidden"
  container.innerHTML = html
  document.body.appendChild(container)
  
  console.log("🧪 Simple container created, dimensions:", container.offsetWidth, "x", container.offsetHeight)
  
  // Make sure container is visible for rendering
  container.style.visibility = "visible"
  
  const imageDataUrl = await (await import("html-to-image")).toPng(container, {
    cacheBust: true,
    width: container.offsetWidth,
    height: container.offsetHeight,
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left'
    }
  })
  
  console.log("🧪 Simple PNG generated, length:", imageDataUrl.length)
  console.log("🧪 Simple PNG starts with:", imageDataUrl.substring(0, 50))
  
  container.remove()
  return imageDataUrl
}
