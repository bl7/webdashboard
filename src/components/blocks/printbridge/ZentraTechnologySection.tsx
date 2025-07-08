import React from "react"

export const ZentraTechnologySection = () => (
  <section className="relative w-full py-16 px-4 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-white via-purple-50 to-pink-50">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* Left: Text Content */}
      <div className="space-y-6 text-center md:text-left">
        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200 mb-1">
          The Technology Behind PrintBridge
        </div>
        <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-gray-900">
          Zentra: Powering Seamless Web-to-Printer
        </h2>
        <p className="text-lg text-gray-700 max-w-xl mx-auto md:mx-0">
          Zentra is the groundbreaking print bridge that enables InstaLabel’s PrintBridge to deliver silent, automated label printing from your web dashboard to any USB printer—on Mac or Windows. No popups, no dialogs, just instant, reliable printing.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base max-w-md mx-auto md:mx-0">
          <li>Silent, automated printing—no dialogs or popups</li>
          <li>Works with any USB label printer on Mac or Windows</li>
          <li>Secure, real-time WebSocket connection</li>
          <li>Supports all label sizes and formats</li>
          <li><span className="font-bold text-purple-700">Included free</span> with every InstaLabel subscription</li>
        </ul>
        <a
          href="https://zentra-mu-flax.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow hover:from-purple-700 hover:to-pink-700 transition-all duration-300 mt-2"
        >
          Learn more about Zentra
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 10.5m0 0l-3.75 3.75M21 10.5H3" /></svg>
        </a>
      </div>
      {/* Right: Zentra Screenshot in Browser Frame (no border radius, no white gap) */}
      <div className="flex justify-center md:justify-end items-center">
        <a href="https://zentra-mu-flax.vercel.app/" target="_blank" rel="noopener noreferrer" className="group block">
          <div className="bg-white shadow-2xl border border-gray-200 w-full max-w-[500px] aspect-[16/10] flex flex-col pb-0">
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
    </div>
  </section>
) 