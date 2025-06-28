// contexts/DarkModeContext.tsx
"use client"
import React, { createContext, useContext, useState, useEffect } from "react"

interface DarkModeContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
  setDarkMode: (value: boolean) => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkModeState] = useState(false)

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode !== null) {
      setDarkModeState(JSON.parse(savedDarkMode))
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setDarkModeState(prefersDark)
    }
  }, [])

  // Save to localStorage whenever darkMode changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
    // Update document class for global dark mode
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkModeState((prev) => !prev)
  }

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value)
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode: darkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export const useDarkMode = () => {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider")
  }
  return context
}
