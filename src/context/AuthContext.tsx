// context/auth-context.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Profile {
  company_name: string | null
  address: string | null
  profile_picture?: string
}

interface Subscription {
  status: string
}

interface AuthContextType {
  token: string | null
  userId: string | null
  name: string | null
  avatar: number | null
  isAdmin: boolean
  profile: Profile | null
  subscription: Subscription | null
  loading: boolean
  error: string | null
  logout: () => void
  setIsAdmin: (admin: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [avatar, setAvatar] = useState<number | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userid")
    const name = localStorage.getItem("name")
    const admin = localStorage.getItem("adminAccess") === "true"
    const avatar = localStorage.getItem("avatar")

    if (!token || !userId) {
      setLoading(false)
      return
    }

    setToken(token)
    setUserId(userId)
    setName(name)
    setIsAdmin(admin)
    if (avatar) setAvatar(parseInt(avatar, 10))

    const fetchData = async () => {
      try {
        const [profileRes, subscriptionRes, adminRes] = await Promise.all([
          fetch(`/api/profile?user_id=${userId}`),
          fetch(`/api/subscription_better/status?user_id=${userId}`),
          fetch(`/api/admin-access?user_id=${userId}`),
        ])
        if (!profileRes.ok) throw new Error("Failed to fetch profile")
        if (!subscriptionRes.ok) throw new Error("Failed to fetch subscription")
        if (!adminRes.ok) throw new Error("Failed to fetch admin access")

        const profileData = await profileRes.json()
        const subscriptionData = await subscriptionRes.json()
        const adminData = await adminRes.json()

        setProfile(profileData.profile)
        setSubscription(subscriptionData.subscription)

        const pic = profileData.profile?.profile_picture
        if (pic && pic.startsWith("/avatar")) {
          const match = pic.match(/\/avatar(\d+)\.png/)
          if (match) {
            const avatarNum = parseInt(match[1], 10)
            if (!isNaN(avatarNum)) {
              setAvatar(avatarNum)
              localStorage.setItem("avatar", avatarNum.toString())
            }
          }
        }

        if (adminData.hasPin && admin) {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
          localStorage.removeItem("adminAccess")
        }

        setLoading(false)
      } catch (err) {
        setError("Failed to load user data.")
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const logout = () => {
    localStorage.clear()
    setToken(null)
    setUserId(null)
    setName(null)
    setIsAdmin(false)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        name,
        avatar,
        isAdmin,
        profile,
        subscription,
        loading,
        error,
        logout,
        setIsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
