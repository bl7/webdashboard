"use client"

import React, { useState } from "react"
import { FaPlay, FaChevronRight } from "react-icons/fa"

interface Tutorial {
  id: string
  title: string
  description: string
  videoUrl: string
  duration: string
}

const TUTORIALS: Tutorial[] = [
  {
    id: "excel-upload",
    title: "Excel Upload",
    description: "Learn how to upload menu items from an Excel file",
    videoUrl: "https://www.youtube.com/embed/NPSIOvzwJ-s",
    duration: "1:16",
  },
  {
    id: "square-sync",
    title: "Square Sync",
    description: "Learn how to sync your menu with Square POS and manage inventory seamlessly",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "6:45",
  },

  {
    id: "bulk-print",
    title: "Bulk Print - How to Use Effectively",
    description: "Master bulk printing techniques to save time and improve kitchen efficiency",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    duration: "5:20",
  },
  {
    id: "ppds-labels",
    title: "PPDS for Pre-Packaged Food",
    description: "Create compliant PPDS labels for pre-packaged direct sale food items",
    videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
    duration: "4:30",
  },
  {
    id: "mobile-app",
    title: "Mobile App Navigation and Features",
    description: "Navigate the mobile app and learn custom print features for on-the-go labeling",
    videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
    duration: "7:15",
  },
  {
    id: "printer-connection",
    title: "Bluetooth/USB Printer Connection",
    description: "Set up and connect your Bluetooth or USB thermal label printer",
    videoUrl: "https://www.youtube.com/embed/fJ9rUzIMcZQ",
    duration: "3:50",
  },
  {
    id: "printbridge-install",
    title: "Installing PrintBridge for Your OS",
    description: "Step-by-step guide to install PrintBridge on Windows, Mac, and Linux",
    videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    duration: "8:10",
  },
]

export default function TutorialsPage() {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial>(TUTORIALS[0])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tutorials</h1>
          <p className="mt-2 text-lg text-gray-600">
            Learn how to get the most out of InstaLabel with our step-by-step video guides
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Sidebar - Tutorial List */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900">Video Tutorials</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Click on any tutorial to watch the video
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {TUTORIALS.map((tutorial) => (
                  <button
                    key={tutorial.id}
                    onClick={() => setSelectedTutorial(tutorial)}
                    className={`w-full p-4 text-left transition-colors duration-200 hover:bg-gray-50 ${
                      selectedTutorial.id === tutorial.id
                        ? "border-r-4 border-purple-500 bg-purple-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <FaPlay
                            className={`h-4 w-4 ${
                              selectedTutorial.id === tutorial.id
                                ? "text-purple-600"
                                : "text-gray-400"
                            }`}
                          />
                          <h3
                            className={`text-sm font-medium ${
                              selectedTutorial.id === tutorial.id
                                ? "text-purple-900"
                                : "text-gray-900"
                            }`}
                          >
                            {tutorial.title}
                          </h3>
                        </div>
                        <p
                          className={`mt-1 text-xs ${
                            selectedTutorial.id === tutorial.id
                              ? "text-purple-700"
                              : "text-gray-600"
                          }`}
                        >
                          {tutorial.description}
                        </p>
                        <div className="mt-2 flex items-center space-x-2">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              selectedTutorial.id === tutorial.id
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {tutorial.duration}
                          </span>
                        </div>
                      </div>
                      <FaChevronRight
                        className={`h-4 w-4 ${
                          selectedTutorial.id === tutorial.id ? "text-purple-600" : "text-gray-400"
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Video Player */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900">{selectedTutorial.title}</h2>
                <p className="mt-1 text-gray-600">{selectedTutorial.description}</p>
              </div>

              <div className="p-6">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
                  <iframe
                    src={selectedTutorial.videoUrl}
                    title={selectedTutorial.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>

                {/* Video Info */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Duration: {selectedTutorial.duration}
                    </span>
                    <span className="text-sm text-gray-600">
                      Tutorial #{TUTORIALS.indexOf(selectedTutorial) + 1} of {TUTORIALS.length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Need help?</span>
                    <button className="text-sm font-medium text-purple-600 hover:text-purple-800">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
