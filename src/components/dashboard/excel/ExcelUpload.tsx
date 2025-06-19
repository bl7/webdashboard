import React, { useState, ChangeEvent } from "react"
import * as XLSX from "xlsx"
import { Upload, FileText, CheckCircle, AlertCircle, X, Download } from "lucide-react"
import DataTable from "./DataTable"
import {
  useImportProcessor,
  ParsedAllergen,
  ParsedIngredient,
  ParsedMenuItem,
} from "@/hooks/useImportProcessor"

// Add custom styles for smooth animations
const customStyles = `
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const ExcelUpload: React.FC = () => {
  const [data, setData] = useState<Array<Record<string, any>>>([])
  const [importResult, setImportResult] = useState<any>(null)
  const [uploadError, setUploadError] = useState<string>("")
  const [hasUploaded, setHasUploaded] = useState(false)
  const { processImport, processing } = useImportProcessor()

  const validateFileFormat = (jsonData: Array<Record<string, any>>): boolean => {
    if (!jsonData.length) return false

    const requiredColumns = ["menu_item_name", "ingredient_name", "shelf_life_hours", "allergens"]
    const firstRow = jsonData[0]
    const hasRequiredColumns = requiredColumns.some((col) =>
      Object.keys(firstRow).some((key) =>
        key.toLowerCase().includes(col.toLowerCase().replace("_", ""))
      )
    )

    return hasRequiredColumns
  }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError("")

    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result
        if (typeof bstr !== "string" && !(bstr instanceof ArrayBuffer)) {
          setUploadError("Unable to read file format")
          return
        }

        const workbook = XLSX.read(bstr, { type: "binary" })
        const wsname = workbook.SheetNames[0]
        const ws = workbook.Sheets[wsname]
        const jsonData = XLSX.utils.sheet_to_json(ws, { defval: "" })

        if (!validateFileFormat(jsonData as Array<Record<string, any>>)) {
          setUploadError(
            "File format not recognized. Please ensure your file contains columns for menu items, ingredients, shelf life, and allergens."
          )
          return
        }

        setData(jsonData as Array<Record<string, any>>)
        setHasUploaded(true)

        // Transform raw jsonData into structured parsed arrays
        const allergensSet = new Set<string>()
        const ingredientsMap = new Map<string, { expiryDays: number; allergenNames: string[] }>()
        const menuItemsMap = new Map<string, Set<string>>()

        ;(jsonData as Array<Record<string, any>>).forEach((row) => {
          const menuItemName = (row["menu_item_name"] || "").trim()
          const ingredientName = (row["ingredient_name"] || "").trim()
          const shelfLifeRaw = row["shelf_life_hours"]
          const shelfLife =
            typeof shelfLifeRaw === "number" ? shelfLifeRaw : parseInt(shelfLifeRaw as string) || 0
          const allergenStr = (row["allergens"] || "") as string
          const allergenNames = allergenStr
            .split(",")
            .map((a) => a.trim())
            .filter((a) => a.length > 0)

          allergenNames.forEach((a) => allergensSet.add(a))

          if (!ingredientsMap.has(ingredientName)) {
            ingredientsMap.set(ingredientName, {
              expiryDays: shelfLife,
              allergenNames,
            })
          }

          if (!menuItemsMap.has(menuItemName)) {
            menuItemsMap.set(menuItemName, new Set())
          }
          menuItemsMap.get(menuItemName)?.add(ingredientName)
        })

        const parsedAllergens: ParsedAllergen[] = Array.from(allergensSet).map((name) => ({ name }))
        const parsedIngredients: ParsedIngredient[] = Array.from(ingredientsMap.entries()).map(
          ([name, { expiryDays, allergenNames }]) => ({
            name,
            expiryDays,
            allergenNames,
          })
        )
        const parsedMenuItems: ParsedMenuItem[] = Array.from(menuItemsMap.entries()).map(
          ([name, ingredientSet]) => ({
            name,
            ingredientNames: Array.from(ingredientSet),
          })
        )

        // Call the import processor hook to compare and prepare data
        const result = await processImport(parsedAllergens, parsedIngredients, parsedMenuItems)
        setImportResult(result)
      } catch (error) {
        console.error("Import processing failed", error)
        setUploadError("Failed to process the file. Please check the format and try again.")
      }
    }
    reader.readAsBinaryString(file)
  }

  const resetUpload = () => {
    setHasUploaded(false)
    setData([])
    setImportResult(null)
    setUploadError("")
  }

  const downloadTemplate = () => {
    // Create sample data for the template
    const templateData = [
      {
        menu_item_name: "Caesar Salad",
        ingredient_name: "Romaine Lettuce",
        shelf_life_hours: 72,
        allergens: "None",
      },
      {
        menu_item_name: "Caesar Salad",
        ingredient_name: "Parmesan Cheese",
        shelf_life_hours: 168,
        allergens: "Dairy",
      },
      {
        menu_item_name: "Caesar Salad",
        ingredient_name: "Caesar Dressing",
        shelf_life_hours: 336,
        allergens: "Eggs, Fish",
      },
      {
        menu_item_name: "Margherita Pizza",
        ingredient_name: "Pizza Dough",
        shelf_life_hours: 48,
        allergens: "Gluten",
      },
      {
        menu_item_name: "Margherita Pizza",
        ingredient_name: "Mozzarella Cheese",
        shelf_life_hours: 240,
        allergens: "Dairy",
      },
      {
        menu_item_name: "Margherita Pizza",
        ingredient_name: "Tomato Sauce",
        shelf_life_hours: 120,
        allergens: "None",
      },
    ]

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(templateData)

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Menu Template")

    // Save the file
    XLSX.writeFile(wb, "menu_import_template.xlsx")
  }

  return (
    <>
      <style>{customStyles}</style>
      <div className="excel-upload-container min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-8">
        {!hasUploaded ? (
          /* Full Screen Upload Section */
          <div className="excel-upload-panel mx-auto">
            <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
              <div className="w-full max-w-2xl transform animate-[fadeIn_0.8s_ease-out] transition-all duration-700 ease-out">
                <div className="hover:shadow-3xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
                    <div className="mb-6 inline-flex h-20 w-20 transform items-center justify-center rounded-full bg-white/20 transition-transform duration-300 hover:scale-110">
                      <Upload className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-white">Menu Import</h1>
                    <p className="text-lg text-blue-100">
                      2 clicks and your entire menu is imported
                    </p>
                  </div>

                  <div className="p-8">
                    <div className="text-center">
                      <div className="border-3 group transform rounded-2xl border-dashed border-gray-300 transition-all duration-300 hover:scale-[1.02] hover:border-blue-400">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="transform rounded-full bg-blue-50 p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-100">
                            <FileText className="h-8 w-8 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-800">
                              Choose your menu file
                            </h3>
                            <p className="mb-6 text-gray-600">
                              Upload Excel or CSV files with your menu items, ingredients, and
                              allergens
                            </p>
                          </div>
                          <label className="inline-flex transform cursor-pointer items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl">
                            <Upload className="mr-2 h-5 w-5" />
                            Select File
                            <input
                              type="file"
                              accept=".xlsx,.xls,.csv"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>

                          <div className="mt-4 text-sm text-gray-500">
                            <span>Don't have a file ready? </span>
                            <button
                              onClick={downloadTemplate}
                              className="inline-flex items-center font-medium text-blue-600 underline decoration-2 underline-offset-2 transition-colors duration-200 hover:text-blue-700"
                            >
                              <Download className="mr-1 h-4 w-4" />
                              Download Template
                            </button>
                          </div>
                        </div>
                      </div>

                      {uploadError && (
                        <div className="mt-6 flex animate-[fadeIn_0.5s_ease-out] items-start space-x-3 rounded-xl border border-red-200 bg-red-50 p-4">
                          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                          <p className="text-sm text-red-700">{uploadError}</p>
                        </div>
                      )}
                    </div>

                    {processing && (
                      <div className="mt-6 animate-[fadeIn_0.5s_ease-out] rounded-xl border border-blue-200 bg-blue-50 p-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                          <p className="font-medium text-blue-700">
                            Processing import, please wait...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Grid Layout - Upload Controls + Data Preview */
          <div className="excel-upload-panel container mx-auto px-4">
            <div className="grid min-h-[calc(100vh-8rem)] grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Panel - Upload Controls (1/3) */}
              <div className="lg:col-span-1">
                <div className="flex h-full animate-[slideInLeft_0.8s_ease-out] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-700 ease-out hover:shadow-xl">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
                    <div className="mb-4 inline-flex h-12 w-12 transform items-center justify-center rounded-full bg-white/20 transition-transform duration-300 hover:scale-110">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="mb-1 text-xl font-bold text-white">Menu Import</h2>
                    <p className="text-sm text-blue-100">2 clicks and you can start printing</p>
                  </div>

                  <div className="flex flex-1 flex-col space-y-6 p-6">
                    <div>
                      <div className="mb-6 flex animate-[slideInLeft_0.6s_ease-out_0.2s_both] items-center space-x-3">
                        <div className="rounded-full bg-green-100 p-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">File uploaded successfully!</p>
                          <p className="text-sm text-gray-600">Ready to process</p>
                        </div>
                      </div>

                      <div className="animate-[slideInLeft_0.6s_ease-out_0.4s_both] space-y-4">
                        <label className="inline-flex w-full transform cursor-pointer items-center justify-center rounded-lg bg-blue-100 px-4 py-3 font-medium text-blue-700 transition-all duration-200 hover:scale-[1.02] hover:bg-blue-200">
                          <Upload className="mr-2 h-4 w-4" />
                          Change File
                          <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          onClick={resetUpload}
                          className="flex w-full transform items-center justify-center rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:scale-[1.02] hover:bg-gray-100 hover:text-gray-800"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Start Over
                        </button>

                        <button
                          onClick={downloadTemplate}
                          className="flex w-full transform items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 transition-all duration-200 hover:scale-[1.02] hover:border-gray-400 hover:bg-gray-50"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Template
                        </button>
                      </div>
                    </div>

                    {processing && (
                      <div className="animate-[fadeIn_0.5s_ease-out] rounded-xl border border-blue-200 bg-blue-50 p-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                          <p className="text-sm font-medium text-blue-700">Processing...</p>
                        </div>
                      </div>
                    )}

                    {importResult && (
                      <div className="min-h-0 flex-1 animate-[slideInLeft_0.6s_ease-out_0.6s_both] overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <h3 className="mb-3 font-semibold text-gray-800">Import Results</h3>
                        <pre className="h-full overflow-auto text-xs text-gray-600">
                          {JSON.stringify(importResult, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Panel - Data Preview (2/3) */}
              <div className="lg:col-span-2">
                <div className="flex h-full animate-[slideInRight_0.8s_ease-out] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-700 ease-out hover:shadow-xl">
                  <div className="animate-[slideInRight_0.6s_ease-out_0.2s_both] border-b border-gray-200 bg-gray-50 p-6">
                    <h2 className="text-2xl font-bold text-gray-800">Imported Data Preview</h2>
                    <p className="mt-1 text-gray-600">
                      Review your menu data before finalizing the import
                    </p>
                  </div>

                  <div className="min-h-0 flex-1 animate-[slideInRight_0.6s_ease-out_0.4s_both] overflow-auto bg-white p-6">
                    <DataTable data={data} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ExcelUpload
