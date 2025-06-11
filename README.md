// "use client"

// import React, { useState, useRef } from "react"
// import Script from "next/script"
// import PrinterManager, { PrinterManagerHandles } from "./PrinterManager"

// const ALLERGENS = ["milk", "eggs", "nuts", "soy", "wheat", "fish", "shellfish", "peanuts"]
// const MAX_INGREDIENTS_TO_FIT = 6

// type TabType = "ingredients" | "menu"

// type IngredientItem = {
// id: number
// name: string
// allergens: string[]
// printedOn: string
// expiryDate: string
// }

// type MenuItem = {
// id: number
// name: string
// printedOn: string
// expiryDate: string
// ingredients: string[]
// }

// type PrintQueueItem = {
// uid: string
// id: number
// type: TabType
// name: string
// quantity: number
// allergens?: string[]
// ingredients?: string[]
// printedOn?: string
// expiryDate?: string
// labelType?: "cook" | "prep" | "ppds"
// }

// // --- API Functions ---

// export async function getAllMenuItems(token: string | null) {
// const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
// method: "GET",
// headers: {
// "Content-Type": "application/json",
// Accept: "application/json",
// Authorization: `Bearer ${token}`,
// },
// })
// const contentType = response.headers.get("content-type")
// if (!response.ok) {
// if (contentType && contentType.includes("application/json")) {
// const errorData = await response.json()
// throw new Error(errorData.message || "Registration failed")
// } else {
// const errorText = await response.text()
// throw new Error("Unexpected server response. Check API URL.")
// }
// }
// const data = await response.json()
// return data
// }

// export async function getAllIngredients(token: string | null) {
// const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient`, {
// method: "GET",
// headers: {
// "Content-Type": "application/json",
// Accept: "application/json",
// Authorization: `Bearer ${token}`,
// },
// })
// const contentType = response.headers.get("content-type")
// if (!response.ok) {
// if (contentType && contentType.includes("application/json")) {
// const errorData = await response.json()
// throw new Error(errorData.message || "Registration failed")
// } else {
// const errorText = await response.text()
// throw new Error("Unexpected server response. Check API URL.")
// }
// }
// const data = await response.json()
// return data
// }

// function calculateExpiryDate(days: number): string {
// const today = new Date()
// const expiry = new Date(today.setDate(today.getDate() + days))
// return expiry.toISOString().split("T")[0]
// }

// function getDefaultExpiryDays(type: "cook" | "prep" | "ppds"): number {
// switch (type) {
// case "cook":
// return 1
// case "prep":
// return 3
// case "ppds":
// return 5
// default:
// return 3
// }
// }

// export default function LabelPrinter() {
// const [activeTab, setActiveTab] = useState<TabType>("ingredients")
// const [printQueue, setPrintQueue] = useState<PrintQueueItem[]>([])
// const [message, setMessage] = useState<string | null>(null)
// const [scriptLoaded, setScriptLoaded] = useState(false)
// const [ingredients, setIngredients] = useState<IngredientItem[]>([])
// const [menuItems, setMenuItems] = useState<MenuItem[]>([])
// const [isLoading, setIsLoading] = useState(false)
// const [error, setError] = useState<string | null>(null)

// // PrinterManager ref
// const printerRef = useRef<PrinterManagerHandles>(null)

// // Data fetching
// React.useEffect(() => {
// const fetchIngredients = async () => {
// const token = localStorage.getItem("token")
// if (!token) return
// setIsLoading(true)
// try {
// const data = await getAllIngredients(token)
// const ingredientsData = Array.isArray(data) ? data : data.data
// const ingredients: IngredientItem[] = ingredientsData
// .map((item: any, index: number) => ({
// id: item.ingredientID ?? `ingredient-${index}-${Date.now()}`,
// name: item.ingredientName || `Ingredient ${index + 1}`,
// allergens: item.allergens || [],
// printedOn: item.printedOn || new Date().toISOString().split("T")[0],
// expiryDate: calculateExpiryDate(item.expiryDays || 7),
// }))
// .filter((item: any) => item.name && item.name.trim() !== "")
// setIngredients(ingredients)
// setError(null)
// } catch (err: any) {
// setError(`Error fetching ingredients: ${err.message}`)
// console.error("Error fetching ingredients:", err)
// } finally {
// setIsLoading(false)
// }
// }
// fetchIngredients()
// }, [])

// React.useEffect(() => {
// const fetchMenuItems = async () => {
// setIsLoading(true)
// const token = localStorage.getItem("token")
// try {
// const res = await getAllMenuItems(token)
// if (!res?.data) {
// setError("No data found.")
// return
// }
// const menuItems: MenuItem[] = []
// let globalIndex = 0
// for (const category of res.data) {
// if (!category.items) continue
// for (const item of category.items) {
// const id = item.menuItemID ?? `menu-${globalIndex}-${Date.now()}`
// const name = item.menuItemName || `Menu Item ${globalIndex + 1}`
// if (name && name.trim() !== "") {
// menuItems.push({
// id,
// name,
// printedOn: new Date().toISOString().split("T")[0],
// expiryDate: calculateExpiryDate(getDefaultExpiryDays("cook")),
// ingredients: item.ingredients
// ? item.ingredients.map((ing: any) => ing.ingredientName || "Unknown Ingredient")
// : [],
// })
// }
// globalIndex++
// }
// }
// setMenuItems(menuItems)
// setError(null)
// } catch (err: any) {
// setError(`Failed to fetch menu items: ${err.message}`)
// console.error(err)
// } finally {
// setIsLoading(false)
// }
// }
// fetchMenuItems()
// }, [])

// // Print queue management
// const addToPrintQueue = (item: IngredientItem | MenuItem, type: TabType) => {
// setPrintQueue((prev) => {
// const uniqueId = `${type}-${item.id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`
// if (prev.some((q) => q.id === item.id && q.type === type)) return prev
// const baseItem = {
// uid: uniqueId,
// id: item.id,
// type,
// name: item.name,
// quantity: 1,
// printedOn: item.printedOn,
// expiryDate: item.expiryDate,
// }
// if (type === "ingredients") {
// const ingredientItem = item as IngredientItem
// return [
// ...prev,
// {
// ...baseItem,
// allergens: ingredientItem.allergens,
// },
// ]
// } else {
// const menuItem = item as MenuItem
// return [
// ...prev,
// {
// ...baseItem,
// ingredients: menuItem.ingredients,
// labelType: "cook" as const,
// },
// ]
// }
// })
// }

// const removeFromPrintQueue = (uid: string) => {
// setPrintQueue((prev) => prev.filter((q) => q.uid !== uid))
// }

// const updateQuantity = (uid: string, quantity: number) => {
// setPrintQueue((prev) =>
// prev.map((q) => (q.uid === uid ? { ...q, quantity: Math.max(1, quantity) } : q))
// )
// }

// const updateLabelType = (uid: string, labelType: "cook" | "prep" | "ppds") => {
// setPrintQueue((prev) =>
// prev.map((q) =>
// q.uid === uid
// ? { ...q, labelType, expiryDate: calculateExpiryDate(getDefaultExpiryDays(labelType)) }
// : q
// )
// )
// }

// // Print actions
// const handlePrintUSB = () => {
// printerRef.current?.handleEpsonPrint()
// }
// const handlePrintBluetooth = async () => {
// await printerRef.current?.handleBluetoothPrint()
// }
// const handleConnectBluetooth = async () => {
// await printerRef.current?.scanAndConnectBluetooth()
// }
// const handleInitEpson = () => {
// printerRef.current?.initializeEpsonPrinter()
// }

// return (
// <>
// <Script
// src="https://download.epson-biz.com/modules/pos/index.php?page=single_soft&cid=6766&ml_lang=en"
// onLoad={() => setScriptLoaded(true)}
// />
// <PrinterManager
// ref={printerRef}
// printQueue={printQueue}
// setMessage={setMessage}
// scriptLoaded={scriptLoaded}
// />
// <main className="overflow-scrollable h-full w-full p-6 font-sans">
// <div className="mt-4 flex flex-col items-center space-y-3 border-b-2 border-black p-5 text-sm md:mt-0 md:flex-row md:items-start md:space-x-6 md:space-y-0">
// <div className="flex min-w-[160px] flex-col items-start space-y-0.5">
// <span className="font-semibold">USB/Network Status:</span>
// <span className={printerConnected ? "text-green-600" : "text-red-600"}>
// {printerConnected ? "Connected" : "Not Connected"}
// </span>
// </div>

// <div className="flex min-w-[160px] flex-col items-start space-y-0.5">
// <span className="font-semibold">Bluetooth Status:</span>
// <span className={btDevice ? "text-green-600" : "text-red-600"}>
// {btDevice ? `Connected to ${btDevice.name ?? btDevice.id}` : "Not Connected"}
// </span>
// </div>

// <div className="flex-1 text-left text-gray-700 md:text-left">{message}</div>

// <button
// onClick={scanAndConnectBluetooth}
// disabled={isBtConnecting || btDevice !== null}
// className={`whitespace-nowrap rounded px-4 py-2 font-semibold text-white transition ${
//               !btDevice && !isBtConnecting
//                 ? "bg-blue-600 hover:bg-blue-700"
//                 : "cursor-not-allowed bg-gray-400"
//             }`}
// >
// {isBtConnecting ? "Connecting..." : btDevice ? "Connected" : "Connect Bluetooth"}
// </button>
// </div>

// <h1 className="mb-6 p-5 text-center text-3xl font-bold">Print Labels</h1>

// <div className="mb-6 flex border-b-2 border-black p-5">
// <div
// onClick={() => setActiveTab("ingredients")}
// className={`flex-1 cursor-pointer py-4 text-center text-lg font-semibold transition ${
//               activeTab === "ingredients"
//                 ? "border-b-4 border-gray-400 bg-gray-300 shadow-inner"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
// >
// Ingredients
// </div>
// <div
// onClick={() => setActiveTab("menu")}
// className={`flex-1 cursor-pointer py-4 text-center text-lg font-semibold transition ${
//               activeTab === "menu"
//                 ? "border-b-4 border-gray-400 bg-gray-300 shadow-inner"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
// >
// Menu Items
// </div>
// </div>

// <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
// <div>
// <h2 className="mb-4 text-xl font-semibold capitalize">{activeTab}</h2>
// <ul className="max-h-[350px] space-y-3 overflow-auto rounded border p-4">
// {(activeTab === "ingredients" ? ingredients : menuItems).map((item) => {
// const inQueue = printQueue.some((q) => q.id === item.id && q.type === activeTab)
// const isIngredientAllergenic =
// activeTab === "ingredients" && isAllergenic(item as IngredientItem)
// return (
// <li
// key={`${activeTab}-${item.id}`}
// className={`flex items-center justify-between rounded border p-3 shadow-sm transition hover:shadow-md ${
//                       isIngredientAllergenic ? "border-red-300 bg-red-50" : ""
//                     }`}
// >
// <div>
// <div className="flex items-center gap-2 font-medium">
// {item.name}
// {isIngredientAllergenic && (
// <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
// ⚠ ALLERGEN
// </span>
// )}
// </div>
// {activeTab === "ingredients" &&
// (item as IngredientItem).allergens?.length > 0 && (
// <div className="mt-1 text-xs text-red-600">
// Contains: {(item as IngredientItem).allergens.join(", ")}
// </div>
// )}
// </div>
// <button
// disabled={inQueue}
// onClick={() => addToPrintQueue(item, activeTab)}
// className={`rounded px-3 py-1 text-sm font-semibold transition ${
//                         inQueue
//                           ? "cursor-not-allowed bg-gray-300 text-gray-600"
//                           : "bg-indigo-600 text-white hover:bg-indigo-700"
//                       }`}
// >
// {inQueue ? "Added" : "Add"}
// </button>
// </li>
// )
// })}
// </ul>
// </div>

// <div>
// <h2 className="mb-4 text-xl font-semibold">Print Queue</h2>
// {printQueue.length === 0 ? (
// <p className="text-gray-500">No items selected for printing.</p>
// ) : (
// <ul className="max-h-[350px] space-y-3 overflow-auto rounded border p-4">
// {printQueue.map((item) => (
// <li
// key={item.uid}
// className="flex items-center justify-between rounded border p-3 shadow-sm"
// >
// <div className="flex flex-col">
// <span className="font-semibold">{item.name}</span>
// <span className="text-xs capitalize text-gray-500">{item.type}</span>
// {item.allergens && item.allergens.length > 0 && (
// <div className="mt-1 flex flex-wrap gap-1">
// {item.allergens.map((a, index) => (
// <span
// key={`${item.uid}-allergen-${index}`}
// className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700"
// >
// {a}
// </span>
// ))}
// </div>
// )}
// {item.type === "menu" && item.ingredients && (
// <div className="mt-1 flex flex-wrap gap-1">
// {item.ingredients.map((ing, index) => (
// <span
// key={`${item.uid}-ingredient-${index}`}
// className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
// >
// {highlightAllergens(ing)}
// </span>
// ))}
// </div>
// )}
// </div>
// <div className="flex flex-col items-end space-y-2">
// <div className="flex items-center space-x-2">
// <input
// type="number"
// min={1}
// value={item.quantity}
// onChange={(e) => updateQuantity(item.uid, parseInt(e.target.value) || 1)}
// className="w-16 rounded border px-2 py-1 text-center focus:outline-indigo-500"
// />
// <button
// onClick={() => removeFromPrintQueue(item.uid)}
// className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
// >
// Remove
// </button>
// </div>
// {item.type === "menu" && (
// <select
// value={item.labelType || "cook"}
// onChange={(e) =>
// updateLabelType(item.uid, e.target.value as "cook" | "prep" | "ppds")
// }
// className="rounded border px-2 py-1 text-xs"
// >
// <option value="cook">Cook (1 day)</option>
// <option value="prep">Prep (3 days)</option>
// <option value="ppds">PPDS (5 days)</option>
// </select>
// )}
// </div>
// </li>
// ))}
// </ul>
// )}
// </div>
// </div>

// <div className="mt-8">
// <h2 className="mb-4 text-xl font-semibold">Label Preview</h2>
// {printQueue.length === 0 ? (
// <p className="text-gray-500">Select items to preview labels.</p>
// ) : (
// <div
// className="flex flex-wrap gap-[1mm]"
// style={{ backgroundColor: "#f9fafb", padding: "4px" }}
// >
// {printQueue.map((item) => {
// const tooLong = (item.ingredients?.length ?? 0) > MAX_INGREDIENTS_TO_FIT
// const allergens =
// item.type === "menu" && item.ingredients
// ? item.ingredients
// .map((ing) => ing.toLowerCase())
// .filter((ing) => ALLERGENS.includes(ing))
// : (item.allergens ?? [])

// return (
// <div
// key={item.uid}
// style={{
//                       width: "5.5cm",
//                       height: "3.1cm",
//                       border: "1px solid #ccc",
//                       padding: "6px",
//                       fontSize: "10px",
//                       overflow: "hidden",
//                       whiteSpace: "normal",
//                       boxSizing: "border-box",
//                       backgroundColor: "white",
//                     }}
// >
// <div className="text-smfont-bold mb-1">{item.name}</div>
// {item.printedOn && item.expiryDate && (
// <div className="mb-1 text-xs">
// Printed On: {new Date(item.printedOn).toLocaleDateString()} | Expiry:{" "}
// {new Date(item.expiryDate).toLocaleDateString()}
// </div>
// )}
// <div className="text-xs">
// {item.type === "ingredients" && item.allergens?.length ? (
// <>
// <b>Allergens:</b>{" "}
// {item.allergens.map((a, i) => (
// <span key={a} className="font-semibold text-red-600">
// {a}
// {i < item.allergens!.length - 1 ? ", " : ""}
// </span>
// ))}
// </>
// ) : tooLong && allergens.length > 0 ? (
// <>
// <b>Allergens:</b>{" "}
// {allergens.map((a, i) => (
// <span key={a} className="font-semibold text-red-600">
// {a}
// {i < allergens.length - 1 ? ", " : ""}
// </span>
// ))}
// </>
// ) : (
// <>
// <b>Ingredients:</b>{" "}
// {(item.ingredients ?? []).map((ing, i) => (
// <span key={i}>
// {highlightAllergens(ing)}
// {i < (item.ingredients?.length ?? 0) - 1 ? ", " : ""}
// </span>
// ))}
// </>
// )}
// </div>
// </div>
// )
// })}
// </div>
// )}
// </div>

// {/_ Print Buttons & Status _/}
// <div className="mt-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
// <button
// disabled={!printerConnected || printQueue.length === 0}
// onClick={handleEpsonPrint}
// className={`rounded px-6 py-3 font-semibold text-white transition ${
//               printerConnected && printQueue.length > 0
//                 ? "bg-indigo-600 hover:bg-indigo-700"
//                 : "cursor-not-allowed bg-gray-400"
//             }`}
// >
// Print All via USB/Network ({printQueue.reduce((sum, item) => sum + item.quantity, 0)})
// </button>
// <div className="flex items-center space-x-2">
// <button
// onClick={handleBluetoothPrint}
// disabled={!btDevice || printQueue.length === 0 || isBtSending}
// className={`rounded px-6 py-3 font-semibold text-white transition ${
//                 btDevice && printQueue.length > 0 && !isBtSending
//                   ? "bg-green-600 hover:bg-green-700"
//                   : "cursor-not-allowed bg-gray-400"
//               }`}
// >
// {isBtSending
// ? "Printing..."
// : `Print All via Bluetooth (${printQueue.reduce(
//                     (sum, item) => sum + item.quantity,
//                     0
//                   )})`}
// </button>
// </div>
// </div>
// </main>
// </>
// )
// }
