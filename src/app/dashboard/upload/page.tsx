"use client"
import React from "react"
import ExcelUpload from "@/components/dashboard/excel/ExcelUpload"
import { FileUp, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const Page: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Upload Dashboard</h2>
          <p className="text-muted-foreground">
            Import your menu data from Excel files to quickly populate your database
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileUp className="h-5 w-5" />
          <span className="text-sm">Bulk Import</span>
        </div>
      </div>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            How to Use the Upload Feature
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">1. Prepare Your File</h4>
              <p className="text-sm text-muted-foreground">
                Download the template or prepare an Excel file with columns: menu_item_name, ingredient_name, shelf_life_days, allergens
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">2. Upload & Review</h4>
              <p className="text-sm text-muted-foreground">
                Upload your file and review the data preview to ensure everything looks correct
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">3. Import Data</h4>
              <p className="text-sm text-muted-foreground">
                Click "Start Import" to process and add your menu items, ingredients, and allergens to the database
              </p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-2">Supported File Formats:</h4>
            <div className="flex gap-2">
              <Badge variant="outline">.xlsx</Badge>
              <Badge variant="outline">.xls</Badge>
              <Badge variant="outline">.csv</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <ExcelUpload />
    </div>
  )
}

export default Page
