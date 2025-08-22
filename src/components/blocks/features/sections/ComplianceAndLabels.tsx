"use client"
import React, { useState } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import Image from "next/image"

const LabelRender = dynamic(() => import("@/app/dashboard/print/LabelRender"), { ssr: false })
const PPDSLabelRenderer = dynamic(
  () => import("@/app/dashboard/ppds/PPDSLabelRenderer").then((mod) => mod.PPDSLabelRenderer),
  { ssr: false }
)

const screenshots = [
  { src: "/webdashboard/dashboard.png", alt: "Dashboard", label: "Dashboard" },
  { src: "/webdashboard/analytics.png", alt: "Analytics", label: "Analytics" },
  { src: "/webdashboard/print.png", alt: "Print", label: "Print" },
  { src: "/webdashboard/upload.png", alt: "Upload", label: "Upload" },
  { src: "/webdashboard/sessions.png", alt: "Sessions", label: "Sessions" },
  { src: "/webdashboard/settings.png", alt: "Settings", label: "Settings" },
]

const samplePPDS = {
  uid: "demo-ppds-1",
  id: "1",
  type: "menu" as const,
  name: "Chicken Caesar Salad",
  quantity: 1,
  labelType: "ppds" as const,
  ingredients: [
    "Chicken Breast",
    "Romaine Lettuce",
    "Caesar Dressing",
    "Parmesan Cheese",
    "Croutons",
  ],
  printedOn: "2024-06-01",
  expiryDate: "2024-06-03",
}
const allIngredients = [
  { uuid: "a1", ingredientName: "Chicken Breast", allergens: [] },
  { uuid: "a2", ingredientName: "Romaine Lettuce", allergens: [] },
  {
    uuid: "a3",
    ingredientName: "Caesar Dressing",
    allergens: [{ allergenName: "Egg" }, { allergenName: "Fish" }],
  },
  { uuid: "a4", ingredientName: "Parmesan Cheese", allergens: [{ allergenName: "Milk" }] },
  { uuid: "a5", ingredientName: "Croutons", allergens: [{ allergenName: "Wheat" }] },
]
const storageInfo = "Keep refrigerated below 5°C. Consume within 2 days of opening."
const businessName = "InstaLabel Ltd"

const samplePrep = {
  uid: "2",
  id: "2",
  type: "menu" as const,
  name: "Mixed Vegetables",
  quantity: 1,
  ingredients: ["Carrots", "Broccoli", "Celery", "Peppers"],
  allergens: [
    {
      uuid: 3,
      allergenName: "Celery",
      category: "Vegetable",
      status: "Active" as const,
      addedAt: "",
      isCustom: false,
    },
  ],
  printedOn: "2024-07-01T09:00:00Z",
  expiryDate: "2024-07-01T18:00:00Z",
  labelType: "prep" as const,
}
const samplePrepAllIngredients = [
  { uuid: "6", ingredientName: "Carrots", allergens: [] },
  { uuid: "7", ingredientName: "Broccoli", allergens: [] },
  { uuid: "8", ingredientName: "Celery", allergens: [{ allergenName: "Celery" }] },
  { uuid: "9", ingredientName: "Peppers", allergens: [] },
]

export const ComplianceAndLabels = () => {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(0)

  const openModal = (idx: number) => {
    setCurrent(idx)
    setOpen(true)
  }
  const closeModal = () => setOpen(false)
  const prev = () => setCurrent((c) => (c === 0 ? screenshots.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === screenshots.length - 1 ? 0 : c + 1))

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50 to-pink-50 py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="container mx-auto max-w-5xl px-4">
        {/* Split/gradient header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="mb-1 inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200">
            Stay Compliant, Print with Confidence
          </div>
          <h3 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Stay Compliant, Print with Confidence
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg font-medium text-gray-700">
            InstaLabel makes it easy to stay compliant with Natasha’s Law and EHO requirements—no
            more guesswork or handwritten mistakes. See exactly what your labels will look like, and
            how we keep you inspection-ready.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Natasha’s Law (Sale Labels)
              </h3>
              <ul className="mb-6 list-disc pl-5 text-gray-700">
                <li>Allergen summary and inline highlighting</li>
                <li>Customisable storage instructions</li>
                <li>Business name and traceability info</li>
                <li>80mm label layout for maximum clarity</li>
              </ul>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                EHO Prep Labels (Back of House)
              </h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Clear, bold expiry date for easy identification</li>
                <li>Printed date, item location, allergens, staff initials</li>
                <li>Fast re-print barcode for bulk relabeling</li>
              </ul>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="flex w-full flex-col items-center">
                <h4 className="mb-2 text-lg font-semibold text-gray-800">Label Examples</h4>
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                  >
                    <span className="mb-1 text-sm text-gray-700">PPDS Label</span>
                    <div className="rounded-2xl border border-purple-100 bg-white p-2 shadow">
                      <PPDSLabelRenderer
                        item={samplePPDS}
                        storageInfo={storageInfo}
                        businessName={businessName}
                        allIngredients={allIngredients}
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                  >
                    <span className="mb-1 text-sm text-gray-700">Prep Label</span>
                    <div className="rounded-2xl border border-purple-100 bg-white p-2 shadow">
                      <LabelRender
                        item={samplePrep}
                        expiry={samplePrep.expiryDate}
                        useInitials={true}
                        selectedInitial="NG"
                        allergens={["Celery"]}
                        labelHeight={"40mm"}
                        allIngredients={samplePrepAllIngredients}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Web Interface Screenshots Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
        className="mx-auto mt-20 max-w-5xl px-4"
      >
        <h3 className="mb-4 text-center text-2xl font-bold text-gray-900">
          Web Interface Screenshots
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {screenshots.map((img, idx) => (
            <motion.button
              key={img.src}
              className="w-full focus:outline-none"
              onClick={() => openModal(idx)}
              aria-label={`Open screenshot: ${img.label}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              viewport={{ once: true }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={2880}
                height={1800}
                className="w-full rounded-lg shadow transition-transform hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="mt-2 text-center text-sm text-gray-600">{img.label}</div>
            </motion.button>
          ))}
        </div>
        {/* Modal Gallery */}
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <button
              className="absolute right-4 top-4 text-3xl text-white"
              onClick={closeModal}
              aria-label="Close gallery"
            >
              &times;
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl text-white"
              onClick={prev}
              aria-label="Previous screenshot"
            >
              &#8592;
            </button>
            <div className="flex flex-col items-center">
              <Image
                src={screenshots[current].src}
                alt={screenshots[current].alt}
                width={2880}
                height={1800}
                className="max-h-[80vh] w-auto rounded-lg shadow-lg"
                sizes="(max-width: 768px) 90vw, 80vw"
              />
              <div className="mt-4 text-lg text-white">{screenshots[current].label}</div>
            </div>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl text-white"
              onClick={next}
              aria-label="Next screenshot"
            >
              &#8594;
            </button>
          </div>
        )}
      </motion.div>
    </section>
  )
}

export default ComplianceAndLabels
