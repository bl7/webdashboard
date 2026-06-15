// context/UserContext.tsx
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { logoutToLogin } from "@/lib/client-auth"

interface UserContextType {
  userid: string | null
  token: string | null
  name: string | null
  isAdmin: boolean
  setUserid: (id: string | null) => void
  setToken: (token: string | null) => void
  setName: (name: string | null) => void
  setIsAdmin: (admin: boolean) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userid, setUserid] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // On mount, load from localStorage once
  useEffect(() => {
    setUserid(localStorage.getItem("userid"))
    setToken(localStorage.getItem("token"))
    setName(localStorage.getItem("name"))
    setIsAdmin(localStorage.getItem("adminAccess") === "true")
  }, [])

  // Logout helper clears storage and context, redirects to login
  const logout = () => {
    setUserid(null)
    setToken(null)
    setName(null)
    setIsAdmin(false)
    logoutToLogin()
  }

  return (
    <UserContext.Provider
      value={{ userid, token, name, isAdmin, setUserid, setToken, setName, setIsAdmin, logout }}
    >
      {children}
    </UserContext.Provider>
  )
}

// Custom hook for easier access
export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
