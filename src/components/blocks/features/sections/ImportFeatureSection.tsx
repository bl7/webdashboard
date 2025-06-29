import { FaFileImport, FaCheckCircle, FaSearch, FaListAlt } from "react-icons/fa"
import Image from "next/image"

export const ImportFeatureSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-purple-50 to-white py-20 px-4 sm:px-6 lg:px-16">
      <div className="container mx-auto flex flex-col-reverse items-center gap-12 md:flex-row md:gap-20">
        {/* Text Content */}
        <div className="flex-1 max-w-xl">
          <div className="mb-4 flex items-center gap-3">
            <FaFileImport className="h-10 w-10 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Bulk Import with Instant Summary</h2>
          </div>
          <p className="mb-6 text-lg text-gray-700">
            Upload your entire menu, ingredients, and allergens in seconds. Our import tool instantly analyzes your Excel or CSV file, checks for duplicates, and gives you a clear summary before anything is saved.
          </p>
          <ul className="mb-8 space-y-4 text-base text-gray-800">
            <li className="flex items-start gap-3">
              <FaCheckCircle className="mt-1 h-5 w-5 text-green-600" />
              <span>See exactly which items are new, which are reused, and which are skipped</span>
            </li>
            <li className="flex items-start gap-3">
              <FaSearch className="mt-1 h-5 w-5 text-blue-500" />
              <span>Automatic duplicate detection and data validation</span>
            </li>
            <li className="flex items-start gap-3">
              <FaListAlt className="mt-1 h-5 w-5 text-purple-500" />
              <span>Review a detailed import summary before confirming</span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="mt-1 h-5 w-5 text-green-600" />
              <span>Import with confidence—no more manual entry or errors</span>
            </li>
          </ul>
        </div>
        {/* Visual Illustration */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-[16/10]">
            <Image
              src="/dashboard.png"
              alt="Import summary screenshot"
              fill
              className="rounded-xl object-cover border-2 border-purple-200 shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
      {/* Decorative background blobs */}
      <div className="absolute left-0 top-0 -z-10 h-80 w-80 scale-125 rounded-full bg-purple-300 opacity-10 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 -z-10 h-96 w-96 rounded-full bg-purple-400 opacity-10 blur-3xl" />
    </section>
  )
} 