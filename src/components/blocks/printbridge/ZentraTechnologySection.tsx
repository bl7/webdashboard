import React from "react"

export const ZentraTechnologySection = () => (
  <section className="relative w-full px-4 sm:px-6 md:px-12 lg:px-16 mb-12">
    <div className="max-w-6xl mx-auto flex justify-center items-center">
      <a href="https://zentra-mu-flax.vercel.app/" target="_blank" rel="noopener noreferrer" className="group block w-[50vw] max-w-4xl">
        <div className="bg-white shadow-2xl border border-gray-200 w-full aspect-[16/10] flex flex-col pb-0">
          {/* Browser top bar */}
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50">
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-300 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
          </div>
          {/* Zentra screenshot fills browser */}
          <div className="flex-grow min-h-0 w-full flex items-stretch">
            <img
              src="/zentra.png"
              alt="Zentra Screenshot"
              className="w-full h-full object-cover"
              style={{ display: 'block', maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
        </div>
      </a>
    </div>
  </section>
) 