import { FaFileImport, FaCheckCircle } from "react-icons/fa"

export const BulkImportFeatureSection = () => {
  return (
    <section className="bg-purple-50 py-12 px-4 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto flex flex-col items-center text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <FaFileImport className="h-8 w-8 text-purple-600" />
          <h3 className="text-2xl font-bold text-gray-900">Bulk Import Gets You Started Fast</h3>
        </div>
        <p className="mb-4 max-w-xl text-base text-gray-700">
          Upload your menu, ingredients, and allergens in one go. Our import tool checks for duplicates and gives you a clear summary before you save—so you can get up and running in minutes.
        </p>
        <ul className="mb-4 space-y-2 text-base text-gray-800">
          <li className="flex items-center justify-center gap-2">
            <FaCheckCircle className="h-4 w-4 text-green-600" />
            Import from Excel or CSV
          </li>
          <li className="flex items-center justify-center gap-2">
            <FaCheckCircle className="h-4 w-4 text-green-600" />
            Instantly see new, existing, and skipped items
          </li>
        </ul>
      </div>
    </section>
  )
} 