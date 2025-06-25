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
import qz, { PrintData } from "qz-tray"
import { usePrinterStatus } from "@/context/PrinterContext"
import { logAction } from "@/lib/logAction"
import { Button } from "@/components/ui/button"


const itemsPerPage = 5

function calculateExpiryDate(days: number): string {
  const today = new Date()
  today.setDate(today.getDate() + days)
  return today.toISOString().split("T")[0]
}

function getDefaultExpiryDays(type: "cook" | "prep" | "ppds"): number {
  switch (type) {
    case "cook":
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

// Add QZ security setup helper
async function setupQZSecurity() {
  if (process.env.NODE_ENV === "production") {
    qz.security.setCertificatePromise(() =>
      fetch("/api/qz/certificate").then(res => res.text())
    )
    qz.security.setSignaturePromise((toSign: string) =>
      fetch("/api/qz/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: toSign })
      })
        .then(res => res.text())
    )
  } else {
    // In dev, allow unsigned
    qz.security.setCertificatePromise(() => Promise.resolve("DEBUG"))
    qz.security.setSignaturePromise(() => Promise.resolve("DEBUG"))
  }
}

// Enhanced getBestAvailablePrinter function for robust printer selection
function getBestAvailablePrinter(
  selectedPrinter: string | null,
  defaultPrinter: string | null,
  availablePrinters: string[]
): { printer: string | null; reason: string } {
  console.log("🖨️ Printer Selection Debug:", {
    selectedPrinter,
    defaultPrinter,
    availablePrinters: availablePrinters?.slice(0, 5), // Limit log spam
    availableCount: availablePrinters?.length || 0
  });

  // Ensure we have a valid array
  const validPrinters = (availablePrinters || []).filter(printer => 
    printer && 
    typeof printer === 'string' &&
    printer.trim() !== "" && 
    printer !== "Fallback_Printer" &&
    !printer.toLowerCase().includes('fallback')
  );

  console.log("🖨️ Valid printers after filtering:", validPrinters);

  // First priority: selected printer (if it exists in valid printers)
  if (selectedPrinter && 
      selectedPrinter !== "Fallback_Printer" && 
      validPrinters.includes(selectedPrinter)) {
    console.log("🖨️ ✅ Using selected printer:", selectedPrinter);
    return { printer: selectedPrinter, reason: "Selected printer available" };
  }
  
  // Second priority: default printer (if it exists in valid printers)
  if (defaultPrinter && 
      defaultPrinter !== "Fallback_Printer" && 
      validPrinters.includes(defaultPrinter)) {
    console.log("🖨️ ✅ Using default printer:", defaultPrinter);
    return { printer: defaultPrinter, reason: "Default printer available" };
  }
  
  // Third priority: first available valid printer
  if (validPrinters.length > 0) {
    console.log("🖨️ ✅ Using first available printer:", validPrinters[0]);
    return { printer: validPrinters[0], reason: "First available printer" };
  }
  
  console.log("🖨️ ❌ No valid printers found");
  return { printer: null, reason: "No valid printers available" };
}

export default function LabelDemo() {
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
    availablePrinters,
    selectedPrinter,
    defaultPrinter,
    reconnect,
    loading: printerLoading,
    error: printerError,
  } = usePrinterStatus()
  const [labelHeight, setLabelHeight] = useState<LabelHeight>("40mm")
  const [showDefrostModal, setShowDefrostModal] = useState(false)

  // Add state for defrost search
  const [defrostSearch, setDefrostSearch] = useState("")

  const showFeedback = (msg: string, type: "success" | "error" = "success") => {
    setFeedbackMsg(msg)
    setFeedbackType(type)
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current)
    feedbackTimeout.current = setTimeout(() => {
      setFeedbackMsg("")
      setFeedbackType("")
    }, 3000)
  }

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userid") || "test-user" : "test-user"

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [settingsRes, initialsRes] = await Promise.all([
          fetch(`/api/label-settings?user_id=${userId}`),
          fetch(`/api/label-initials?user_id=${userId}`),
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
  }, [userId])

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
                  parseInt(expiryDays["cook"] || "") || getDefaultExpiryDays("cook")
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

  const filteredDefrostIngredients = useMemo(
    () =>
      !defrostSearch
        ? ingredients
        : ingredients.filter((i) => i.name.toLowerCase().includes(defrostSearch.toLowerCase())),
    [ingredients, defrostSearch]
  )

  const handleExpiryChange = (uid: string, value: string) =>
    setCustomExpiry((prev) => ({ ...prev, [uid]: value }))

  const addToPrintQueue = (item: IngredientItem | MenuItem, type: TabType) => {
    const uniqueId = `${type}-${item.id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    if (printQueue.some((q) => q.id === item.id && q.type === type)) return

    const base: Omit<PrintQueueItem, "allergens" | "ingredients" | "labelType"> = {
      uid: uniqueId,
      id: item.id,
      type,
      name: item.name,
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
            labelType: "cook" as "cook",
          }

    setPrintQueue((prev) => [...prev, newItem])
  }

  const updateQuantity = (uid: string, quantity: number) =>
    setPrintQueue((prev) =>
      prev.map((q) => (q.uid === uid ? { ...q, quantity: Math.max(1, quantity) } : q))
    )

  const updateLabelType = (uid: string, labelType: "cook" | "prep" | "ppds") =>
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
    console.log("🖨️ Starting print process...");
    if (printerLoading) {
      showFeedback("Checking printer status, please wait...", "error");
      return;
    }
    if (!isConnected) {
      showFeedback("Printer not connected. Please start QZ Tray and reconnect.", "error");
      reconnect();
      return;
    }
    if (printQueue.length === 0) {
      showFeedback("No items in print queue", "error");
      return;
    }
    // Enhanced printer selection with detailed feedback
    const printerSelection = getBestAvailablePrinter(selectedPrinter, defaultPrinter, availablePrinters);
    if (!printerSelection.printer) {
      const errorMsg = `No printer available: ${printerSelection.reason}. Available printers: [${availablePrinters.join(', ')}]`;
      showFeedback(errorMsg, "error");
      console.error("❌ Printer selection failed:", {
        selectedPrinter,
        defaultPrinter,
        availablePrinters,
        isConnected,
        reason: printerSelection.reason
      });
      return;
    }
    console.log(`🖨️ Using printer: ${printerSelection.printer} (${printerSelection.reason})`);
    try {
      await setupQZSecurity();
      // Verify connection before printing
      if (!qz.websocket.isActive()) {
        await qz.websocket.connect();
      }
      // Double-check printer is still available
      const currentPrinters = await qz.printers.find();
      const currentPrintersArray = Array.isArray(currentPrinters) ? currentPrinters : [currentPrinters];
      if (!currentPrintersArray.includes(printerSelection.printer)) {
        showFeedback(`Printer \"${printerSelection.printer}\" is no longer available. Please refresh and try again.`, "error");
        return;
      }
      let successCount = 0;
      let failCount = 0;
      let failItems: string[] = [];
      for (const item of printQueue) {
        for (let i = 0; i < item.quantity; i++) {
          try {
            const imageDataUrl = await formatLabelForPrintImage(
              item,
              allergens.map((a) => a.allergenName.toLowerCase()),
              customExpiry,
              5,
              useInitials,
              selectedInitial,
              labelHeight
            );
            const config = qz.configs.create(printerSelection.printer, {
              density: 203,
              scaleContent: true,
              rasterize: true,
            });
            const data: PrintData[] = [
              {
                type: "pixel",
                format: "image",
                flavor: "base64",
                data: imageDataUrl.split(",")[1],
              },
            ];
            await qz.print(config, data);
            await logAction("print_label", {
              labelType: item.labelType || item.type,
              itemId: item.uid || item.id,
              itemName: item.name,
              quantity: item.quantity || 1,
              printedAt: new Date().toISOString(),
              initial: selectedInitial,
              printerUsed: printerSelection.printer,
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
        showFeedback(`Successfully printed ${successCount} labels using ${printerSelection.printer}`, "success");
      } else {
        showFeedback(`Printed ${successCount} labels, failed ${failCount}: ${failItems.join(", ")}`, "error");
      }
    } catch (err) {
      console.error("❌ Print process error:", err);
      showFeedback(`Print failed: ${err instanceof Error ? err.message : String(err)}`, "error");
    } finally {
      if (qz.websocket.isActive()) {
        await qz.websocket.disconnect().catch(console.error);
      }
    }
  }

  // Handler for "Use First"
  const handleUseFirstPrint = async () => {
    if (printerLoading) {
      showFeedback("Checking printer status, please wait...", "error")
      return
    }
    
    if (!isConnected) {
      showFeedback("Printer not connected. Please start QZ Tray and reconnect.", "error")
      reconnect()
      return
    }

    // Get the best available printer using our helper function
    const printerToUse = getBestAvailablePrinter(selectedPrinter, defaultPrinter, availablePrinters)
    
    if (!printerToUse) {
      showFeedback("No printer available. Please check your printer connection and try again.", "error")
      return
    }

    try {
      if (!qz.websocket.isActive()) {
        await qz.websocket.connect()
      }

      const html = `<span style="width:100%;font-size:2.2rem;font-weight:bold;letter-spacing:0.1em;text-align:center;">USE FIRST</span>`
      const imageDataUrl = await printSimpleLabel(html)
      
      if (!printerToUse.printer) {
        showFeedback("No valid printer selected.", "error");
        return;
      }
      const config = qz.configs.create(printerToUse.printer, {
        density: 203,
        scaleContent: true,
        rasterize: true,
      })

      const data: PrintData[] = [
        {
          type: "pixel",
          format: "image",
          flavor: "base64",
          data: imageDataUrl.split(",")[1],
        },
      ]

      await qz.print(config, data)
      showFeedback("Printed USE FIRST label", "success")

      await logAction("print_label", {
        labelType: "use_first",
        itemName: "USE FIRST",
        printedAt: new Date().toISOString(),
        initial: selectedInitial,
        printerUsed: printerToUse.printer,
      })
    } catch (err) {
      console.error("USE FIRST print error:", err)
      showFeedback(`Print failed: ${err instanceof Error ? err.message : String(err)}`, "error")
    } finally {
      if (qz.websocket.isActive()) await qz.websocket.disconnect()
    }
  }

  // Handler for "Defrost"
  const handleDefrostPrint = async (ingredient: IngredientItem) => {
    setShowDefrostModal(false)
    
    if (printerLoading) {
      showFeedback("Checking printer status, please wait...", "error")
      return
    }
    
    if (!isConnected) {
      showFeedback("Printer not connected. Please start QZ Tray and reconnect.", "error")
      reconnect()
      return
    }

    // Get the best available printer using our helper function
    const printerToUse = getBestAvailablePrinter(selectedPrinter, defaultPrinter, availablePrinters)
    
    if (!printerToUse) {
      showFeedback("No printer available. Please check your printer connection and try again.", "error")
      return
    }

    try {
      if (!qz.websocket.isActive()) {
        await qz.websocket.connect()
      }

      const now = new Date()
      const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      const html = `
        <div style="font-size:1.3rem;font-weight:bold;margin-bottom:8px;text-align:center;">${ingredient.name} (defrosted)</div>
        <div style="font-size:1rem;margin-bottom:4px;">Defrosted: ${now.toLocaleString("en-GB")}</div>
        <div style="font-size:1rem;margin-bottom:4px;">Expiry: ${expiry.toLocaleString("en-GB")}</div>
        <div style="font-size:1rem;margin-top:8px;">${selectedInitial ? `By: ${selectedInitial}` : ""}</div>
      `
      const imageDataUrl = await printSimpleLabel(html)
      
      if (!printerToUse.printer) {
        showFeedback("No valid printer selected.", "error");
        return;
      }
      const config = qz.configs.create(printerToUse.printer, {
        density: 203,
        scaleContent: true,
        rasterize: true,
      })

      const data: PrintData[] = [
        {
          type: "pixel",
          format: "image",
          flavor: "base64",
          data: imageDataUrl.split(",")[1],
        },
      ]

      await qz.print(config, data)
      showFeedback("Printed defrosted label", "success")

      await logAction("print_label", {
        labelType: "defrost",
        itemName: ingredient.name,
        printedAt: new Date().toISOString(),
        initial: selectedInitial,
        printerUsed: printerToUse.printer,
      })
    } catch (err) {
      console.error("Defrost print error:", err)
      showFeedback(`Print failed: ${err instanceof Error ? err.message : String(err)}`, "error")
    } finally {
      if (qz.websocket.isActive()) await qz.websocket.disconnect()
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
    <div className="space-y-6">
      <div className="mx-auto">
        {/* In-place loader for subsequent loads */}
        {isLoading && (ingredients.length > 0 || menuItems.length > 0) ? (
          <div className="flex h-32 items-center justify-center">
            <svg className="h-8 w-8 animate-spin text-purple-600" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="ml-4 text-lg text-gray-500">Loading Print Label...</span>
          </div>
        ) : (
          <>
            <div className="flex gap-8">
              {/* Left Section: Label Printer */}
              <div className="w-1/2">
                <h1 className="mb-4 text-2xl font-bold">Label Printer</h1>
                <LabelHeightChooser
                  selectedHeight={labelHeight}
                  onHeightChange={(val) => setLabelHeight(val)}
                  className="mb-4"
                />
                
                {/* Printer Status Display */}
                <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-2 font-semibold">Printer Status</h3>
                  <div className="text-sm">
                    <p className={`mb-1 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                      QZ Tray: {isConnected ? 'Connected' : 'Disconnected'}
                    </p>
                    {isConnected && (
                      <>
                        <p className="mb-1">
                          Available Printers: {availablePrinters.length}
                        </p>
                        <p className="mb-1">
                          Selected: {getBestAvailablePrinter(selectedPrinter, defaultPrinter, availablePrinters).printer || 'None'}
                          {" "}
                          <span className="text-xs text-gray-500">
                            ({getBestAvailablePrinter(selectedPrinter, defaultPrinter, availablePrinters).reason})
                          </span>
                        </p>
                      </>
                    )}
                    {printerError && (
                      <p className="text-red-600">Error: {printerError}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section: Initials and Settings */}
              <div className="w-1/2">
                {useInitials && customInitials.length > 0 && (
                  <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Select Initials
                    </label>
                    <select
                      className="w-full rounded border px-4 py-2"
                      value={selectedInitial}
                      onChange={(e) => setSelectedInitial(e.target.value)}
                    >
                      <option value="">Select initials...</option>
                      {customInitials.map((initial) => (
                        <option key={initial} value={initial}>
                          {initial}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Feedback Messages */}
            {feedbackMsg && (
              <div
                className={`mb-4 rounded-md p-4 ${
                  feedbackType === "success"
                    ? "border border-green-200 bg-green-50 text-green-800"
                    : "border border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {feedbackMsg}
              </div>
            )}

            <div className="flex gap-8">
              <div className="w-1/2">
                <div className="mb-6 flex w-fit items-center space-x-2 rounded-full bg-gray-100 p-1">
                  <button
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      activeTab === "ingredients"
                        ? "bg-white text-purple-700 shadow"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("ingredients")}
                  >
                    Ingredients
                  </button>
                  <button
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      activeTab === "menu"
                        ? "bg-white text-purple-700 shadow"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("menu")}
                  >
                    Menu Items
                  </button>
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full rounded border px-4 py-2"
                  />
                </div>

                {isLoading && <p>Loading...</p>}
                {error && <p className="text-red-600">{error}</p>}

                <div className="mb-6">
                  {(activeTab === "ingredients" ? paginatedIngredients : paginatedMenuItems).map(
                    (item) => (
                      <div
                        key={item.id}
                        className="mb-2 flex items-center justify-between rounded border p-4"
                      >
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-500">Expires: {item.expiryDate}</p>
                        </div>
                        {/* Add to print queue */}
                        <Button
                          onClick={() => addToPrintQueue(item, activeTab)}
                          disabled={printQueue.some(
                            (q) => q.id === item.id && q.type === activeTab
                          )}
                          variant="default"
                        >
                          {printQueue.some((q) => q.id === item.id && q.type === activeTab)
                            ? "Added"
                            : "Add"}
                        </Button>
                      </div>
                    )
                  )}
                </div>
                {/* Pagination */}
                <div className="flex items-center justify-center gap-2">
                  <Button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>

                  <span className="min-w-[80px] text-center text-sm text-gray-700">
                    {page} of {totalPages}
                  </span>

                  <Button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || totalPages === 0}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mb-8 max-h-[600px] w-1/2 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 pb-3 pt-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Print Queue</h2>
                  {/* Print Labels */}
                  <Button
                    onClick={printLabels}
                    disabled={printQueue.length === 0}
                    variant="default"
                    title={
                      printQueue.length === 0
                        ? "No items in print queue"
                        : "Print all labels in queue"
                    }
                  >
                    Print Labels
                  </Button>
                  {/* Clear Queue */}
                  <Button
                    onClick={clearPrintQueue}
                    disabled={printQueue.length === 0}
                    variant="secondary"
                    aria-label="Clear print queue"
                  >
                    Clear Queue
                  </Button>
                </div>

                <div className="px-6 pb-6 pt-2">
                  {printQueue.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                      <svg
                        className="mb-2 h-8 w-8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 17v-2a4 4 0 018 0v2M9 17a4 4 0 01-8 0v-2a4 4 0 018 0v2zM9 17v-2a4 4 0 018 0v2M9 17a4 4 0 01-8 0v-2a4 4 0 018 0v2z"
                        />
                      </svg>
                      <p className="italic">No items in print queue</p>
                    </div>
                  ) : (
                    printQueue.map((item) => (
                      <div
                        key={item.uid}
                        className="mb-3 flex items-center gap-4 rounded-md border border-gray-300 bg-gray-50 px-4 py-3 transition-shadow hover:shadow-md"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-gray-800">{item.name}</p>
                          <p className="mt-0.5 text-xs text-gray-500">Expires: {item.expiryDate}</p>
                        </div>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.uid, Number(e.target.value))}
                          className="w-16 rounded-md border border-gray-300 bg-white px-3 py-1 text-center text-sm text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        {"labelType" in item && (
                          <select
                            value={item.labelType || "cook"}
                            onChange={(e) =>
                              updateLabelType(item.uid, e.target.value as "cook" | "prep" | "ppds")
                            }
                            className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="cook">Cook</option>
                            <option value="prep">Prep</option>
                            <option value="ppds">PPDS</option>
                          </select>
                        )}
                        {/* Remove from queue */}
                        <Button
                          onClick={() => removeFromQueue(item.uid)}
                          variant="outline"
                          className="text-red-600 hover:bg-red-100"
                          aria-label={`Remove ${item.name} from queue`}
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            {/* Label Preview with selected height */}
            <LabelPreview
              printQueue={printQueue}
              ALLERGENS={allergens.map((a) => a.allergenName.toLowerCase())}
              customExpiry={customExpiry}
              onExpiryChange={handleExpiryChange}
              useInitials={useInitials}
              selectedInitial={selectedInitial}
              labelHeight={labelHeight}
            />

            {/* Floating Action Buttons */}
            <div
              style={{
                position: "fixed",
                bottom: 32,
                right: 32,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                zIndex: 50,
              }}
            >
              <Button
                onClick={handleUseFirstPrint}
                className="rounded-full px-6 py-3 text-lg font-bold shadow-lg"
                variant="default"
                aria-label="Print USE FIRST label"
                tabIndex={0}
              >
                Use First
              </Button>
              <Button
                onClick={() => setShowDefrostModal(true)}
                className="rounded-full px-6 py-3 text-lg font-bold shadow-lg"
                variant="default"
                aria-label="Print Defrosted label"
                tabIndex={0}
              >
                Defrost
              </Button>
            </div>

            {/* Defrost Modal */}
            {showDefrostModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
                role="dialog"
                aria-modal="true"
              >
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                  <h2 className="mb-4 text-xl font-bold">Select Ingredient to Defrost</h2>
                  <input
                    type="text"
                    value={defrostSearch}
                    onChange={(e) => setDefrostSearch(e.target.value)}
                    placeholder="Search ingredients..."
                    className="mb-3 w-full rounded border px-3 py-2"
                  />
                  <ul className="mb-4 max-h-60 overflow-y-auto">
                    {filteredDefrostIngredients.map((ing) => (
                      <li key={ing.id} className="mb-2">
                        {/* Defrost Modal List */}
                        <Button
                          className="w-full text-left"
                          variant="ghost"
                          onClick={() => handleDefrostPrint(ing)}
                        >
                          {ing.name}
                        </Button>
                      </li>
                    ))}
                    {filteredDefrostIngredients.length === 0 && (
                      <li className="px-4 py-2 text-gray-400">No ingredients found.</li>
                    )}
                  </ul>
                  {/* Defrost Modal Cancel */}
                  <Button
                    className="mt-2 w-full"
                    variant="secondary"
                    onClick={() => setShowDefrostModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

async function printSimpleLabel(html: string, width = "5.6cm", height = "4.0cm") {
  const container = document.createElement("div")
  container.style.width = width
  container.style.height = height
  container.style.background = "white"
  container.style.display = "flex"
  container.style.flexDirection = "column"
  container.style.justifyContent = "center"
  container.style.alignItems = "center"
  container.style.fontFamily = "monospace"
  container.style.border = "2px solid black"
  container.innerHTML = html
  document.body.appendChild(container)
  const imageDataUrl = await (await import("html-to-image")).toPng(container)
  container.remove()
  return imageDataUrl
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
