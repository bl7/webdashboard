import React from "react"
import { PrintQueueItem } from "@/types/print"
import LabelRender from "./LabelRender"
import { LabelHeight } from "./LabelHeightChooser"
import { PPDSLabelRenderer } from "../ppds/PPDSLabelRenderer"

interface LabelPreviewProps {
  printQueue: PrintQueueItem[]
  ALLERGENS: string[]
  customExpiry: Record<string, string>
  onExpiryChange: (uid: string, value: string) => void
  useInitials?: boolean
  selectedInitial?: string
  labelHeight?: LabelHeight
  maxIngredientsToFit?: number
  allIngredients: Array<{
    uuid: string
    ingredientName: string
    allergens: { allergenName: string }[]
  }>
  ppdsOptions?: {
    storageInfo?: string
    showNetWt?: boolean
    showPrice?: boolean
    netWt?: string
    price?: string
  }
  ppdsBusinessName?: string
}

const LabelPreview: React.FC<LabelPreviewProps> = ({
  printQueue,
  ALLERGENS,
  customExpiry,
  onExpiryChange,
  useInitials = false,
  selectedInitial = "",
  labelHeight = "40mm",
  maxIngredientsToFit = 5,
  allIngredients = [],
  ppdsOptions,
  ppdsBusinessName = "InstaLabel",
}) => {
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Label Preview</h2>
      {printQueue.length === 0 ? (
        <p className="text-gray-500">Select items to preview labels.</p>
      ) : (
        <div className="flex flex-wrap gap-3 bg-gray-100 p-4">
          {printQueue.map((item) => (
            <div key={item.uid} className="space-y-2">
              <label className="text-xs font-medium">Expiry Date:</label>
              <input
                type="date"
                value={customExpiry[item.uid] || ""}
                onChange={(e) => onExpiryChange(item.uid, e.target.value)}
                className="w-full rounded border px-2 py-1 text-xs"
              />
              {item.labelType === "ppds" && item.type === "menu" && labelHeight === "80mm" ? (
                <PPDSLabelRenderer
                  item={{
                    ...item,
                    expiryDate: customExpiry[item.uid] || item.expiryDate || "",
                  }}
                  storageInfo={ppdsOptions?.storageInfo || ""}
                  businessName={ppdsBusinessName}
                  allIngredients={allIngredients}
                  showNetWt={ppdsOptions?.showNetWt || false}
                  showPrice={ppdsOptions?.showPrice || false}
                  netWt={ppdsOptions?.netWt || ""}
                  price={ppdsOptions?.price || ""}
                />
              ) : (
                <LabelRender
                  item={item}
                  expiry={customExpiry[item.uid] || item.expiryDate || ""}
                  useInitials={useInitials}
                  selectedInitial={selectedInitial}
                  allergens={ALLERGENS}
                  maxIngredients={maxIngredientsToFit}
                  labelHeight={labelHeight}
                  allIngredients={allIngredients}
                  ppdsMeta={{
                    storageInfo: ppdsOptions?.storageInfo || "",
                    showNetWt: ppdsOptions?.showNetWt || false,
                    showPrice: ppdsOptions?.showPrice || false,
                    netWt: ppdsOptions?.netWt || "",
                    price: ppdsOptions?.price || "",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LabelPreview
