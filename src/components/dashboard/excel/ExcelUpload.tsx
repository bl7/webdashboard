import React, { useState, ChangeEvent } from "react"
import * as XLSX from "xlsx"
import { Upload, FileText, CheckCircle, AlertCircle, X, Download, Play, RefreshCw, ExternalLink } from "lucide-react"
import DataTable from "./DataTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
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
  const [isImporting, setIsImporting] = useState(false)
  const [importCompleted, setImportCompleted] = useState(false)
  const { processImport, processing } = useImportProcessor()

  const validateFileFormat = (jsonData: Array<Record<string, any>>): boolean => {
    if (!jsonData.length) return false

    const requiredColumns = ["menu_item_name", "ingredient_name", "shelf_life_days", "allergens"]
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

        // Log the raw imported data for debugging
        console.log('Imported Excel Data:', jsonData)

        if (!validateFileFormat(jsonData as Array<Record<string, any>>)) {
          setUploadError(
            "File format not recognized. Please ensure your file contains columns: menu_item_name, ingredient_name, shelf_life_days, allergens"
          )
          return
        }

        setData(jsonData as Array<Record<string, any>>)
        setHasUploaded(true)
      } catch (error) {
        console.error("Import processing failed", error)
        setUploadError("Failed to process the file. Please check the format and try again.")
      }
    }
    reader.readAsBinaryString(file)
  }

  const handleImport = async () => {
    if (!data.length) return

    setIsImporting(true)
    setImportCompleted(false)

    try {
      // Transform raw jsonData into structured parsed arrays
      const allergensSet = new Set<string>()
      const ingredientsMap = new Map<string, { expiryDays: number; allergenNames: string[] }>()
      const menuItemsMap = new Map<string, Set<string>>()

      data.forEach((row) => {
        const menuItemName = (row["menu_item_name"] || "").trim()
        const ingredientName = (row["ingredient_name"] || "").trim()
        const shelfLifeRaw = row["shelf_life_days"]
        const shelfLife =
          typeof shelfLifeRaw === "number" ? shelfLifeRaw : parseInt(shelfLifeRaw as string) || 0
        const allergenStr = (row["allergens"] || "") as string
        const allergenNames = allergenStr
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a.length > 0 && a.toLowerCase() !== 'none')

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
      console.log('Parsed Ingredients:', parsedIngredients)
      console.log('Parsed Menu Items:', parsedMenuItems)
      const result = await processImport(parsedAllergens, parsedIngredients, parsedMenuItems)
      setImportResult(result)
      setImportCompleted(true)
    } catch (error) {
      console.error("Import processing failed", error)
      setUploadError("Failed to process the import. Please check the data and try again.")
    } finally {
      setIsImporting(false)
    }
  }

  const resetUpload = () => {
    setHasUploaded(false)
    setData([])
    setImportResult(null)
    setUploadError("")
    setImportCompleted(false)
    setIsImporting(false)
  }

  const downloadTemplate = () => {
    // Create sample data for the template
    const templateData = [
      {
        menu_item_name: "Caesar Salad",
        ingredient_name: "Romaine Lettuce",
        shelf_life_days: 3,
        allergens: "None",
      },
      {
        menu_item_name: "Caesar Salad",
        ingredient_name: "Parmesan Cheese",
        shelf_life_days: 7,
        allergens: "Dairy",
      },
      {
        menu_item_name: "Caesar Salad",
        ingredient_name: "Caesar Dressing",
        shelf_life_days: 14,
        allergens: "Eggs, Fish",
      },
      {
        menu_item_name: "Caesar Salad",
        ingredient_name: "Croutons",
        shelf_life_days: 30,
        allergens: "Gluten, Wheat",
      },
      {
        menu_item_name: "Margherita Pizza",
        ingredient_name: "Pizza Dough",
        shelf_life_days: 2,
        allergens: "Gluten, Wheat",
      },
      {
        menu_item_name: "Margherita Pizza",
        ingredient_name: "Mozzarella Cheese",
        shelf_life_days: 10,
        allergens: "Dairy",
      },
      {
        menu_item_name: "Margherita Pizza",
        ingredient_name: "Tomato Sauce",
        shelf_life_days: 5,
        allergens: "None",
      },
      {
        menu_item_name: "Margherita Pizza",
        ingredient_name: "Fresh Basil",
        shelf_life_days: 1,
        allergens: "None",
      },
      {
        menu_item_name: "Chicken Burger",
        ingredient_name: "Chicken Patty",
        shelf_life_days: 2,
        allergens: "None",
      },
      {
        menu_item_name: "Chicken Burger",
        ingredient_name: "Burger Bun",
        shelf_life_days: 3,
        allergens: "Gluten, Wheat",
      },
      {
        menu_item_name: "Chicken Burger",
        ingredient_name: "Lettuce",
        shelf_life_days: 4,
        allergens: "None",
      },
      {
        menu_item_name: "Chicken Burger",
        ingredient_name: "Tomato",
        shelf_life_days: 3,
        allergens: "None",
      },
      {
        menu_item_name: "Chicken Burger",
        ingredient_name: "Mayonnaise",
        shelf_life_days: 7,
        allergens: "Eggs",
      },
      {
        menu_item_name: "Pasta Carbonara",
        ingredient_name: "Spaghetti",
        shelf_life_days: 365,
        allergens: "Gluten, Wheat",
      },
      {
        menu_item_name: "Pasta Carbonara",
        ingredient_name: "Bacon",
        shelf_life_days: 7,
        allergens: "None",
      },
      {
        menu_item_name: "Pasta Carbonara",
        ingredient_name: "Eggs",
        shelf_life_days: 7,
        allergens: "Eggs",
      },
      {
        menu_item_name: "Pasta Carbonara",
        ingredient_name: "Parmesan Cheese",
        shelf_life_days: 7,
        allergens: "Dairy",
      },
      {
        menu_item_name: "Chocolate Cake",
        ingredient_name: "Flour",
        shelf_life_days: 365,
        allergens: "Gluten, Wheat",
      },
      {
        menu_item_name: "Chocolate Cake",
        ingredient_name: "Sugar",
        shelf_life_days: 730,
        allergens: "None",
      },
      {
        menu_item_name: "Chocolate Cake",
        ingredient_name: "Eggs",
        shelf_life_days: 7,
        allergens: "Eggs",
      },
      {
        menu_item_name: "Chocolate Cake",
        ingredient_name: "Chocolate",
        shelf_life_days: 365,
        allergens: "None",
      },
      {
        menu_item_name: "Chocolate Cake",
        ingredient_name: "Butter",
        shelf_life_days: 7,
        allergens: "Dairy",
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
                    <p className="text-lg text-purple-100">
                      2 clicks and your entire menu is imported
                    </p>
                  </div>

                  <div className="p-8">
                    <div className="text-center">
                      <div className="border-3 group transform rounded-2xl border-dashed border-gray-300 transition-all duration-300 hover:scale-[1.02] hover:border-purple-400">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="transform rounded-full bg-purple-50 p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-100">
                            <FileText className="h-8 w-8 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-800">
                              Choose your menu file
                            </h3>
                            <p className="mb-6 text-gray-600">
                              Upload Excel or CSV files with your menu items, ingredients, shelf life (days), and
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
                              className="inline-flex items-center font-medium text-purple-600 underline decoration-2 underline-offset-2 transition-colors duration-200 hover:text-purple-700"
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
                      <div className="animate-[fadeIn_0.5s_ease-out] rounded-xl border border-purple-200 bg-purple-50 p-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
                          <p className="text-sm font-medium text-purple-700">
                            {isImporting ? "Importing data to database..." : "Processing import, please wait..."}
                          </p>
                        </div>
                        {isImporting && (
                          <div className="mt-2 text-xs text-purple-600">
                            Creating allergens, ingredients, and menu items...
                          </div>
                        )}
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
                    <p className="text-sm text-purple-100">2 clicks and you can start printing</p>
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
                        {!importCompleted && (
                          <Button
                            onClick={handleImport}
                            disabled={isImporting || processing}
                            className="w-full"
                            size="lg"
                          >
                            {isImporting ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Importing...
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Start Import
                              </>
                            )}
                          </Button>
                        )}

                        <label className="inline-flex w-full transform cursor-pointer items-center justify-center rounded-lg bg-purple-100 px-4 py-3 font-medium text-purple-700 transition-all duration-200 hover:scale-[1.02] hover:bg-purple-200">
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
                      <div className="animate-[fadeIn_0.5s_ease-out] rounded-xl border border-purple-200 bg-purple-50 p-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
                          <p className="text-sm font-medium text-purple-700">Processing...</p>
                        </div>
                      </div>
                    )}

                    {importCompleted && (
                      <></>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Panel - Data Preview (2/3) */}
              <div className="lg:col-span-2">
                <div className="flex h-full animate-[slideInRight_0.8s_ease-out] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-700 ease-out hover:shadow-xl">
                  {!isImporting && !importCompleted ? (
                    <>
                      <div className="animate-[slideInRight_0.6s_ease-out_0.2s_both] border-b border-gray-200 bg-gray-50 p-6">
                        <h2 className="text-2xl font-bold text-gray-800">Imported Data Preview</h2>
                        <p className="mt-1 text-gray-600">
                          Review your menu data before finalizing the import
                        </p>
                      </div>

                      <div className="min-h-0 flex-1 animate-[slideInRight_0.6s_ease-out_0.4s_both] overflow-auto bg-white p-6">
                        <DataTable data={data} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="animate-[slideInRight_0.6s_ease-out_0.2s_both] border-b border-gray-200 bg-gray-50 p-6">
                        <h2 className="text-2xl font-bold text-gray-800">Import Summary</h2>
                        <p className="mt-1 text-gray-600">
                          {isImporting ? "Processing your import..." : "Import completed successfully!"}
                        </p>
                      </div>

                      <div className="min-h-0 flex-1 animate-[slideInRight_0.6s_ease-out_0.4s_both] overflow-auto bg-white p-6">
                        {isImporting ? (
                          <div className="flex h-full items-center justify-center">
                            <div className="text-center">
                              <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto"></div>
                              <h3 className="text-lg font-semibold text-gray-800 mb-2">Importing Data</h3>
                              <p className="text-gray-600">
                                Creating allergens, ingredients, and menu items...
                              </p>
                              <div className="mt-4 text-sm text-gray-500">
                                This may take a few moments depending on the amount of data
                              </div>
                            </div>
                          </div>
                        ) : importCompleted ? (
                          <div className="space-y-4">
                            {/* Calculate summary statistics */}
                            {(() => {
                              const { stats, warnings, createdMenuItems, existingItems, newItems } = importResult
                              const totalProcessed = stats.allergens.existing + stats.allergens.created + 
                                                    stats.ingredients.existing + stats.ingredients.created + 
                                                    stats.menuItems.existing + stats.menuItems.created + stats.menuItems.skipped
                              const totalReused = stats.allergens.existing + stats.ingredients.existing + stats.menuItems.existing
                              const totalCreated = stats.allergens.created + stats.ingredients.created + stats.menuItems.created
                              const efficiencyPercentage = totalProcessed > 0 ? Math.round((totalReused / totalProcessed) * 100) : 0

                              return (
                                <>
                                  {/* Summary Card */}
                                  <Card className="border-green-200 bg-green-50">
                                    <CardContent className="pt-6">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <h3 className="text-lg font-semibold text-green-800">Import Completed Successfully!</h3>
                                          <p className="text-sm text-green-600">
                                            Processed {totalProcessed} items with {efficiencyPercentage}% efficiency
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-2xl font-bold text-green-800">{totalCreated}</div>
                                          <div className="text-xs text-green-600">New Items</div>
                                        </div>
                                      </div>
                                      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                        <div>
                                          <div className="text-lg font-semibold text-green-700">{totalReused}</div>
                                          <div className="text-xs text-green-600">Reused</div>
                                        </div>
                                        <div>
                                          <div className="text-lg font-semibold text-green-700">{totalCreated}</div>
                                          <div className="text-xs text-green-600">Created</div>
                                        </div>
                                        <div>
                                          <div className="text-lg font-semibold text-green-700">{efficiencyPercentage}%</div>
                                          <div className="text-xs text-green-600">Efficiency</div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Detailed Results */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        Import Details
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <h4 className="font-semibold text-sm">Allergens</h4>
                                          <div className="flex gap-2">
                                            <Badge variant="outline">{stats.allergens.existing} existing</Badge>
                                            <Badge variant="default">{stats.allergens.created} created</Badge>
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <h4 className="font-semibold text-sm">Ingredients</h4>
                                          <div className="flex gap-2">
                                            <Badge variant="outline">{stats.ingredients.existing} existing</Badge>
                                            <Badge variant="default">{stats.ingredients.created} created</Badge>
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <h4 className="font-semibold text-sm">Menu Items</h4>
                                          <div className="flex gap-2">
                                            <Badge variant="outline">{stats.menuItems.existing} existing</Badge>
                                            <Badge variant="default">{stats.menuItems.created} created</Badge>
                                            <Badge variant="destructive">{stats.menuItems.skipped} skipped</Badge>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Existing Items Section */}
                                      {(existingItems.allergens.length > 0 || existingItems.ingredients.length > 0 || existingItems.menuItems.length > 0) && (
                                        <div className="space-y-3">
                                          <h4 className="font-semibold text-sm text-purple-600 flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4" />
                                            Existing Items Found & Reused
                                          </h4>
                                          
                                          {existingItems.allergens.length > 0 && (
                                            <div className="space-y-2">
                                              <h5 className="text-xs font-medium text-gray-600">Allergens ({existingItems.allergens.length})</h5>
                                              <div className="grid grid-cols-2 gap-1">
                                                {existingItems.allergens.map((allergen: { name: string; id: string }, index: number) => (
                                                  <div key={index} className="text-xs bg-purple-50 text-purple-700 p-2 rounded">
                                                    ✓ {allergen.name}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {existingItems.ingredients.length > 0 && (
                                            <div className="space-y-2">
                                              <h5 className="text-xs font-medium text-gray-600">Ingredients ({existingItems.ingredients.length})</h5>
                                              <div className="grid grid-cols-2 gap-1">
                                                {existingItems.ingredients.map((ingredient: { name: string; id: string }, index: number) => (
                                                  <div key={index} className="text-xs bg-purple-50 text-purple-700 p-2 rounded">
                                                    ✓ {ingredient.name}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {existingItems.menuItems.length > 0 && (
                                            <div className="space-y-2">
                                              <h5 className="text-xs font-medium text-gray-600">Menu Items ({existingItems.menuItems.length})</h5>
                                              <div className="grid grid-cols-1 gap-1">
                                                {existingItems.menuItems.map((menuItem: { name: string; id: string }, index: number) => (
                                                  <div key={index} className="text-xs bg-purple-50 text-purple-700 p-2 rounded">
                                                    ✓ {menuItem.name} (skipped - already exists)
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* New Items Section */}
                                      {(newItems.allergens.length > 0 || newItems.ingredients.length > 0 || newItems.menuItems.length > 0) && (
                                        <div className="space-y-3">
                                          <h4 className="font-semibold text-sm text-green-600 flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4" />
                                            New Items Created
                                          </h4>
                                          
                                          {newItems.allergens.length > 0 && (
                                            <div className="space-y-2">
                                              <h5 className="text-xs font-medium text-gray-600">Allergens ({newItems.allergens.length})</h5>
                                              <div className="grid grid-cols-2 gap-1">
                                                {newItems.allergens.map((allergen: { name: string; id: string }, index: number) => (
                                                  <div key={index} className="text-xs bg-green-50 text-green-700 p-2 rounded">
                                                    ➕ {allergen.name}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {newItems.ingredients.length > 0 && (
                                            <div className="space-y-2">
                                              <h5 className="text-xs font-medium text-gray-600">Ingredients ({newItems.ingredients.length})</h5>
                                              <div className="grid grid-cols-2 gap-1">
                                                {newItems.ingredients.map((ingredient: { name: string; id: string }, index: number) => (
                                                  <div key={index} className="text-xs bg-green-50 text-green-700 p-2 rounded">
                                                    ➕ {ingredient.name}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {newItems.menuItems.length > 0 && (
                                            <div className="space-y-2">
                                              <h5 className="text-xs font-medium text-gray-600">Menu Items ({newItems.menuItems.length})</h5>
                                              <div className="grid grid-cols-1 gap-1">
                                                {newItems.menuItems.map((menuItem: { name: string; id: string; ingredientIds: string[] }, index: number) => (
                                                  <div key={index} className="text-xs bg-green-50 text-green-700 p-2 rounded">
                                                    ➕ {menuItem.name} ({menuItem.ingredientIds.length} ingredients)
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {warnings.length > 0 && (
                                        <div className="space-y-2">
                                          <h4 className="font-semibold text-sm text-amber-600">Warnings</h4>
                                          <div className="space-y-1">
                                            {warnings.map((warning: string, index: number) => (
                                              <p key={index} className="text-sm text-amber-700 bg-amber-50 p-2 rounded">
                                                ⚠️ {warning}
                                              </p>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Navigation Buttons */}
                                      <div className="border-t pt-4">
                                        <h4 className="font-semibold text-sm mb-3">View Your Data</h4>
                                        <div className="flex flex-wrap gap-2">
                                          <Link href="/dashboard/allergens">
                                            <Button variant="outline" size="sm" className="text-xs">
                                              <ExternalLink className="h-3 w-3 mr-1" />
                                              View Allergens
                                            </Button>
                                          </Link>
                                          <Link href="/dashboard/ingredients">
                                            <Button variant="outline" size="sm" className="text-xs">
                                              <ExternalLink className="h-3 w-3 mr-1" />
                                              View Ingredients
                                            </Button>
                                          </Link>
                                          <Link href="/dashboard/menuitem">
                                            <Button variant="outline" size="sm" className="text-xs">
                                              <ExternalLink className="h-3 w-3 mr-1" />
                                              View Menu Items
                                            </Button>
                                          </Link>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </>
                              )
                            })()}
                          </div>
                        ) : null}
                      </div>
                    </>
                  )}
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
