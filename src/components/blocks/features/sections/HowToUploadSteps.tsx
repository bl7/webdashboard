import { FaDownload, FaEdit, FaUpload, FaCheckCircle } from 'react-icons/fa';

export const HowToUploadSteps = () => (
  <section className="py-16 px-4 sm:px-6 lg:px-16 bg-white">
    <div className="max-w-3xl mx-auto text-center mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Get Up and Running in Minutes</h2>
      <p className="text-gray-600 text-lg">Follow these simple steps to import your menu, ingredients, and allergens in bulk.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
      <div className="flex flex-col items-center">
        <div className="bg-purple-100 p-4 rounded-full mb-4">
          <FaDownload className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="font-semibold text-lg mb-1">1. Download Template</h3>
        <p className="text-gray-600 text-sm">Get our ready-to-use Excel/CSV template to ensure your data is formatted perfectly.</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-blue-100 p-4 rounded-full mb-4">
          <FaEdit className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="font-semibold text-lg mb-1">2. Fill in Your Data</h3>
        <p className="text-gray-600 text-sm">Add your menu items, ingredients, and allergens to the template. Save your changes.</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <FaUpload className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="font-semibold text-lg mb-1">3. Upload File</h3>
        <p className="text-gray-600 text-sm">Go to the Upload page and drag & drop or select your completed file.</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-yellow-100 p-4 rounded-full mb-4">
          <FaCheckCircle className="h-8 w-8 text-yellow-500" />
        </div>
        <h3 className="font-semibold text-lg mb-1">4. Review & Confirm</h3>
        <p className="text-gray-600 text-sm">See a summary of what will be imported. Confirm to finish—done!</p>
      </div>
    </div>
    <div className="flex justify-center my-8">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="How to Use InstaLabel Bulk Upload"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-xl shadow-lg w-full max-w-2xl"
        ></iframe>
      </div>
  </section>
);

export default HowToUploadSteps; 