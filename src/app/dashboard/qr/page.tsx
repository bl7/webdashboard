"use client"
import React, { useState, useRef, useEffect } from "react"
import {
  Download,
  Copy,
  Eye,
  QrCode,
  Globe,
  Settings,
  Edit3,
  Check,
  X,
  AlertCircle,
} from "lucide-react"

// Types
interface MenuItem {
  id: number
  name: string
  price: number
  description: string
  image: string
  ingredients: string[]
  allergens: string[]
}

interface Group {
  id: number
  name: string
  description: string
  slug: string
  isPublic: boolean
  menuItems: MenuItem[]
}

// Static data - will be replaced with API calls
const staticGroups: Group[] = [
  {
    id: 1,
    name: "Momo Corner",
    description: "Authentic Nepalese dumplings and traditional dishes",
    slug: "momo-corner",
    isPublic: false,
    menuItems: [
      {
        id: 1,
        name: "Chicken Momo",
        price: 12.99,
        description: "Traditional steamed dumplings filled with seasoned chicken",
        image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400",
        ingredients: ["Chicken", "Flour", "Onion", "Garlic", "Ginger", "Spices"],
        allergens: ["Gluten", "May contain traces of soy"],
      },
      {
        id: 2,
        name: "Veg Momo",
        price: 10.99,
        description: "Steamed dumplings with mixed vegetables and herbs",
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400",
        ingredients: ["Cabbage", "Carrot", "Onion", "Flour", "Garlic", "Ginger"],
        allergens: ["Gluten"],
      },
      {
        id: 3,
        name: "Jhol Momo",
        price: 14.99,
        description: "Momo served in spicy sesame and tomato soup",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        ingredients: ["Chicken", "Flour", "Tomato", "Sesame", "Spices"],
        allergens: ["Gluten", "Sesame"],
      },
    ],
  },
  {
    id: 2,
    name: "Cafe Delight",
    description: "Premium coffee and pastries",
    slug: "cafe-delight",
    isPublic: true,
    menuItems: [
      {
        id: 4,
        name: "Espresso",
        price: 3.5,
        description: "Rich, full-bodied espresso shot",
        image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400",
        ingredients: ["Arabica Coffee Beans"],
        allergens: ["Caffeine"],
      },
      {
        id: 5,
        name: "Croissant",
        price: 4.25,
        description: "Buttery, flaky French pastry",
        image: "https://images.unsplash.com/photo-1555507036-ab794f665976?w=400",
        ingredients: ["Flour", "Butter", "Eggs", "Milk", "Sugar"],
        allergens: ["Gluten", "Dairy", "Eggs"],
      },
    ],
  },
]

export default function QRDashboardPage() {
  const [selectedGroup, setSelectedGroup] = useState(staticGroups[0])
  const [groups, setGroups] = useState(staticGroups)
  const [showPreview, setShowPreview] = useState(false)
  const [editingSlug, setEditingSlug] = useState(false)
  const [tempSlug, setTempSlug] = useState("")
  const [slugError, setSlugError] = useState("")
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)
  const qrRef = useRef(null)
  const [publicUrl, setPublicUrl] = useState("")
  useEffect(() => {
    if (typeof window !== "undefined" && selectedGroup) {
      const url = `${window.location.origin}/p/${selectedGroup.slug}`
      setPublicUrl(url)

      if (selectedGroup.isPublic) {
        generateRealQRCode(url).then(setQrCodeDataUrl)
      } else {
        setQrCodeDataUrl("")
      }
    }
  }, [selectedGroup])

  // Generate real QR code using QR Server API
  const generateRealQRCode = async (url: string): Promise<string> => {
    try {
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&format=png&margin=10`
      return qrApiUrl
    } catch (error) {
      console.error("Error generating QR code:", error)
      return ""
    }
  }

  // Update QR code when selected group or public status changes
  useEffect(() => {
    if (selectedGroup.isPublic) {
      const [publicUrl, setPublicUrl] = useState("")

      useEffect(() => {
        if (typeof window !== "undefined" && selectedGroup) {
          setPublicUrl(`${window.location.origin}/p/${selectedGroup.slug}`)
        }
      }, [selectedGroup])

      generateRealQRCode(publicUrl).then(setQrCodeDataUrl)
    } else {
      setQrCodeDataUrl("")
    }
  }, [selectedGroup])

  // Utility functions for slug management
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
  }

  const validateSlug = (slug: string): string => {
    // Check if slug is empty
    if (!slug || slug.trim() === "") {
      return "Slug cannot be empty"
    }

    // Check for valid characters
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return "Slug can only contain lowercase letters, numbers, and hyphens"
    }

    // Check minimum length
    if (slug.length < 3) {
      return "Slug must be at least 3 characters long"
    }

    // Check maximum length
    if (slug.length > 50) {
      return "Slug must be less than 50 characters"
    }

    // Check if slug already exists (excluding current group)
    const existingSlug = groups.find(
      (group) => group.slug === slug && group.id !== selectedGroup.id
    )
    if (existingSlug) {
      return "This slug is already taken"
    }

    // Check for reserved slugs
    const reservedSlugs = ["admin", "api", "dashboard", "public", "static", "assets", "app", "www"]
    if (reservedSlugs.includes(slug)) {
      return "This slug is reserved and cannot be used"
    }

    return ""
  }

  const startEditingSlug = (): void => {
    setTempSlug(selectedGroup.slug)
    setEditingSlug(true)
    setSlugError("")
  }

  const saveSlug = (): void => {
    const error = validateSlug(tempSlug)
    if (error) {
      setSlugError(error)
      return
    }

    // Update the slug in groups
    const updatedGroups = groups.map((group) =>
      group.id === selectedGroup.id ? { ...group, slug: tempSlug } : group
    )
    setGroups(updatedGroups)

    // Update selected group
    const updatedSelectedGroup = { ...selectedGroup, slug: tempSlug }
    setSelectedGroup(updatedSelectedGroup)

    setEditingSlug(false)
    setSlugError("")
  }

  const cancelEditingSlug = (): void => {
    setEditingSlug(false)
    setTempSlug("")
    setSlugError("")
  }

  const autoGenerateSlug = (): void => {
    const newSlug = generateSlug(selectedGroup.name)
    let finalSlug = newSlug
    let counter = 1

    // Handle duplicates by adding numbers
    while (groups.some((group) => group.slug === finalSlug && group.id !== selectedGroup.id)) {
      finalSlug = `${newSlug}-${counter}`
      counter++
    }

    setTempSlug(finalSlug)
    setSlugError("")
  }

  const handlePublicToggle = (groupId: number): void => {
    const updatedGroups = groups.map((group) =>
      group.id === groupId ? { ...group, isPublic: !group.isPublic } : group
    )
    setGroups(updatedGroups)

    if (selectedGroup.id === groupId) {
      setSelectedGroup({ ...selectedGroup, isPublic: !selectedGroup.isPublic })
    }
  }
  useEffect(() => {
    if (selectedGroup.isPublic && typeof window !== "undefined") {
      generateRealQRCode(publicUrl).then(setQrCodeDataUrl)
    } else {
      setQrCodeDataUrl("")
    }
  }, [selectedGroup])

  const downloadQR = async (): Promise<void> => {
    if (!qrCodeDataUrl) return

    try {
      const response = await fetch(qrCodeDataUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.download = `${selectedGroup.slug}-qr-code.png`
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading QR code:", error)
    }
  }

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const handleSlugKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      saveSlug()
    } else if (e.key === "Escape") {
      cancelEditingSlug()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">QR Code Generator</h1>
          <p className="text-gray-600">Create and manage public menu QR codes</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Menu Selection & Settings */}
          <div className="space-y-6 lg:col-span-1">
            {/* Menu Selection */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Select Menu</h2>
              </div>
              <div className="space-y-3">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroup(group)}
                    className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                      selectedGroup.id === group.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{group.name}</h3>
                        <p className="text-sm text-gray-500">{group.description}</p>
                        <p className="mt-1 text-xs text-gray-400">/{group.slug}</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          group.isPublic
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {group.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Public Settings */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Public Settings</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Make Menu Public</label>
                    <p className="text-xs text-gray-500">Allow public access via QR code</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={selectedGroup.isPublic}
                      onChange={() => handlePublicToggle(selectedGroup.id)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                  </label>
                </div>

                {selectedGroup.isPublic && (
                  <div className="space-y-4">
                    {/* Slug Editor */}
                    <div>
                      <label className="text-sm font-medium">Menu Slug</label>
                      <p className="mb-2 text-xs text-gray-500">
                        This creates your public URL: /p/{selectedGroup.slug}
                      </p>

                      {editingSlug ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">/p/</span>
                            <input
                              type="text"
                              value={tempSlug}
                              onChange={(e) =>
                                setTempSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                              }
                              onKeyDown={handleSlugKeyPress}
                              placeholder="enter-slug-here"
                              className={`flex-1 rounded-md border px-3 py-2 ${
                                slugError ? "border-red-500" : "border-gray-300"
                              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              maxLength={50}
                            />
                            <button
                              onClick={saveSlug}
                              disabled={!tempSlug || !!slugError}
                              className="rounded-md bg-green-600 px-3 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEditingSlug}
                              className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          {slugError && (
                            <div className="flex items-center gap-2 text-xs text-red-600">
                              <AlertCircle className="h-3 w-3" />
                              {slugError}
                            </div>
                          )}

                          <button
                            onClick={autoGenerateSlug}
                            className="rounded-md border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50"
                          >
                            Auto-generate from name
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm">
                            <span className="text-gray-500">/p/</span>
                            <span className="font-medium">{selectedGroup.slug}</span>
                          </div>
                          <button
                            onClick={startEditingSlug}
                            className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Public URL */}
                    <div>
                      <label className="text-sm font-medium">Public URL</label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={publicUrl}
                          readOnly
                          className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
                        />
                        <button
                          onClick={() => copyToClipboard(publicUrl)}
                          className={`rounded-md border px-3 py-2 transition-colors ${
                            copySuccess
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {copySuccess ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4" />
                        {showPreview ? "Hide" : "Show"} Preview
                      </button>
                      <button
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            window.open(publicUrl, "_blank")
                          }
                        }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
                      >
                        <Globe className="h-4 w-4" />
                        Open
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle Column - QR Code */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                <h2 className="text-lg font-semibold">QR Code</h2>
              </div>
              <div className="space-y-4 text-center">
                {selectedGroup.isPublic ? (
                  <>
                    <div className="flex justify-center">
                      {qrCodeDataUrl ? (
                        <img
                          ref={qrRef}
                          src={qrCodeDataUrl}
                          alt="QR Code"
                          className="rounded-lg border shadow-md"
                          style={{ maxWidth: "300px", height: "auto" }}
                        />
                      ) : (
                        <div className="flex h-[300px] w-[300px] items-center justify-center rounded-lg border bg-gray-100">
                          <div className="text-gray-500">Generating QR Code...</div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Scan to view {selectedGroup.name}</p>
                    <div className="break-all px-4 text-xs text-gray-500">{publicUrl}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={downloadQR}
                        disabled={!qrCodeDataUrl}
                        className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Download className="h-4 w-4" />
                        Download PNG
                      </button>
                      <button
                        onClick={() => copyToClipboard(publicUrl)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-4 py-2 transition-colors ${
                          copySuccess
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        Copy Link
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-gray-500">
                    <QrCode className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p className="text-sm">Enable public access to generate QR code</p>
                    <p className="mt-2 text-xs">Toggle the switch above to make this menu public</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Menu Preview */}
          <div className="lg:col-span-1">
            {showPreview && selectedGroup.isPublic && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Menu Preview</h2>
                  <p className="text-sm text-gray-600">How your menu will appear to customers</p>
                </div>
                <div className="space-y-4">
                  <div className="border-b pb-4 text-center">
                    <h3 className="text-xl font-bold">{selectedGroup.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{selectedGroup.description}</p>
                  </div>

                  <div className="space-y-4">
                    {selectedGroup.menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 rounded-lg border p-3 hover:bg-gray-50"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between">
                            <h4 className="truncate text-sm font-medium">{item.name}</h4>
                            <span className="ml-2 text-sm font-bold text-green-600">
                              ${item.price}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                            {item.description}
                          </p>
                          {item.allergens.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {item.allergens.map((allergen: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800"
                                >
                                  {allergen}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
