import { FaDownload, FaEdit, FaUpload, FaCheckCircle } from "react-icons/fa"

export const HowToUploadSteps = () => (
  <section className="bg-white px-4 py-16 sm:px-6 lg:px-16">
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <h3 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
        Get Up and Running in Minutes
      </h3>
      <p className="text-lg text-gray-600">
        Follow these simple steps to import your menu, ingredients, and allergens in bulk.
      </p>
    </div>
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-4">
      <div className="flex flex-col items-center">
        <div className="mb-4 rounded-full bg-purple-100 p-4">
          <FaDownload className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">1. Download Template</h3>
        <p className="text-sm text-gray-600">
          Get our ready-to-use Excel/CSV template to ensure your data is formatted perfectly.
        </p>
      </div>
      <div className="flex flex-col items-center">
        <div className="mb-4 rounded-full bg-purple-100 p-4">
          <FaEdit className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">2. Fill in Your Data</h3>
        <p className="text-sm text-gray-600">
          Add your menu items, ingredients, and allergens to the template. Save your changes.
        </p>
      </div>
      <div className="flex flex-col items-center">
        <div className="mb-4 rounded-full bg-green-100 p-4">
          <FaUpload className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">3. Upload File</h3>
        <p className="text-sm text-gray-600">
          Go to the Upload page and drag & drop or select your completed file.
        </p>
      </div>
      <div className="flex flex-col items-center">
        <div className="mb-4 rounded-full bg-yellow-100 p-4">
          <FaCheckCircle className="h-8 w-8 text-yellow-500" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">4. Review & Confirm</h3>
        <p className="text-sm text-gray-600">
          See a summary of what will be imported. Confirm to finish—done!
        </p>
      </div>
    </div>
  </section>
)

export default HowToUploadSteps
