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
    id: "getting-started",
    title: "Getting Started with InstaLabel",
    description: "Learn the basics of setting up InstaLabel and creating your first labels",
    videoUrl: "https://www.youtube.com/embed/NPSIOvzwJ-s",
    duration: "5:30",
  },
  {
    id: "bulk-upload",
    title: "Bulk Upload Menu Items",
    description: "How to import your entire menu using our Excel template",
    videoUrl: "https://www.youtube.com/embed/NPSIOvzwJ-s",
    duration: "3:45",
  },
  {
    id: "allergen-management",
    title: "Managing Allergens & Compliance",
    description: "Setting up allergen tracking for Natasha's Law compliance",
    videoUrl: "https://www.youtube.com/embed/NPSIOvzwJ-s",
    duration: "4:20",
  },
  {
    id: "printing-labels",
    title: "Printing Different Label Types",
    description: "Learn about prep, cook, PPDS, and other label types",
    videoUrl: "https://www.youtube.com/embed/NPSIOvzwJ-s",
    duration: "6:15",
  },
  {
    id: "mobile-app",
    title: "Using the Mobile App",
    description: "Print labels directly from your Android or iOS device",
    videoUrl: "https://www.youtube.com/embed/NPSIOvzwJ-s",
    duration: "4:50",
  },
  {
    id: "square-integration",
    title: "Square POS Integration",
    description: "Sync your menu with Square and manage inventory",
    videoUrl: "https://www.youtube.com/embed/NPSIOvzwJ-s",
    duration: "7:30",
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
