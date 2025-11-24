"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import {
  Search,
  Mail,
  User,
  Building,
  Phone,
  Calendar,
  Edit,
  Trash2,
  Filter,
  Download,
} from "lucide-react"
import { useDarkMode } from "../context/DarkModeContext"

interface WaitlistEntry {
  id: number
  email: string
  full_name: string
  company_name: string | null
  phone: string | null
  status: string
  notes: string | null
  created_at: string
  contacted_at: string | null
  contacted_by: string | null
}

export default function WaitlistPage() {
  const { isDarkMode } = useDarkMode()
  const router = useRouter()
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingEntry, setEditingEntry] = useState<WaitlistEntry | null>(null)
  const [editForm, setEditForm] = useState({
    status: "",
    notes: "",
    contacted_at: "",
    contacted_by: "",
  })

  useEffect(() => {
    fetchWaitlist()
  }, [])

  const fetchWaitlist = async () => {
    try {
      const bossToken = localStorage.getItem("bossToken")
      if (!bossToken) {
        toast.error("Authentication required")
        return
      }

      const response = await fetch("/api/waitlist", {
        headers: { Authorization: `Bearer ${bossToken}` },
      })

      if (response.ok) {
        const data = await response.json()
        setWaitlist(data.waitlist || [])
      } else if (response.status === 401) {
        toast.error("Authentication failed. Please login again.")
        // Redirect to login
        redirectToLogin()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to fetch waitlist")
      }
    } catch (error) {
      console.error("Error fetching waitlist:", error)
      toast.error("Failed to fetch waitlist")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (entry: WaitlistEntry) => {
    setEditingEntry(entry)
    setEditForm({
      status: entry.status,
      notes: entry.notes || "",
      contacted_at: entry.contacted_at
        ? new Date(entry.contacted_at).toISOString().split("T")[0]
        : "",
      contacted_by: entry.contacted_by || "",
    })
  }

  const handleUpdate = async () => {
    if (!editingEntry) return

    try {
      const bossToken = localStorage.getItem("bossToken")
      if (!bossToken) {
        toast.error("Authentication required")
        return
      }

      const response = await fetch(`/api/waitlist/${editingEntry.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bossToken}`,
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        toast.success("Entry updated successfully")
        fetchWaitlist()
        setEditingEntry(null)
      } else if (response.status === 401) {
        toast.error("Authentication failed. Please login again.")
        redirectToLogin()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to update entry")
      }
    } catch (error) {
      console.error("Error updating entry:", error)
      toast.error("Failed to update entry")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this entry?")) return

    try {
      const bossToken = localStorage.getItem("bossToken")
      if (!bossToken) {
        toast.error("Authentication required")
        return
      }

      const response = await fetch(`/api/waitlist/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${bossToken}` },
      })

      if (response.ok) {
        toast.success("Entry deleted successfully")
        fetchWaitlist()
      } else if (response.status === 401) {
        toast.error("Authentication failed. Please login again.")
        redirectToLogin()
      } else {
        toast.error("Failed to delete entry")
      }
    } catch (error) {
      console.error("Error deleting entry:", error)
      toast.error("Failed to delete entry")
    }
  }

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Company",
      "Phone",
      "Status",
      "Notes",
      "Joined Date",
      "Contacted Date",
      "Contacted By",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredWaitlist.map((entry) =>
        [
          `"${entry.full_name}"`,
          `"${entry.email}"`,
          `"${entry.company_name || ""}"`,
          `"${entry.phone || ""}"`,
          `"${entry.status}"`,
          `"${entry.notes || ""}"`,
          `"${new Date(entry.created_at).toLocaleDateString()}"`,
          `"${entry.contacted_at ? new Date(entry.contacted_at).toLocaleDateString() : ""}"`,
          `"${entry.contacted_by || ""}"`,
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `waitlist-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    if (isDarkMode) {
      switch (status) {
        case "pending":
          return "bg-yellow-900 text-yellow-200"
        case "contacted":
          return "bg-blue-900 text-blue-200"
        case "converted":
          return "bg-green-900 text-green-200"
        case "rejected":
          return "bg-red-900 text-red-200"
        default:
          return "bg-gray-700 text-gray-200"
      }
    } else {
      switch (status) {
        case "pending":
          return "bg-yellow-100 text-yellow-800"
        case "contacted":
          return "bg-blue-100 text-blue-800"
        case "converted":
          return "bg-green-100 text-green-800"
        case "rejected":
          return "bg-red-100 text-red-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    }
  }

  const filteredWaitlist = waitlist.filter((entry) => {
    const matchesSearch =
      entry.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.company_name && entry.company_name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || entry.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const redirectToLogin = () => {
    localStorage.removeItem("bossToken")
    router.push("/boss/login")
  }

  if (loading) {
    return (
      <div className={`flex h-screen items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Loading waitlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="mb-6">
        <h1 className={`mb-2 text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Waitlist Management</h1>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Manage and track waitlist entries</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center">
              <User className="mr-3 h-8 w-8 text-purple-600" />
              <div>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Total Entries</p>
                <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{waitlist.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Mail className="mr-3 h-8 w-8 text-yellow-600" />
              <div>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Pending</p>
                <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {waitlist.filter((w) => w.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building className="mr-3 h-8 w-8 text-blue-600" />
              <div>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Contacted</p>
                <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {waitlist.filter((w) => w.status === "contacted").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="mr-3 h-8 w-8 text-green-600" />
              <div>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Converted</p>
                <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {waitlist.filter((w) => w.status === "converted").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Waitlist Table */}
      <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
        <CardHeader>
          <CardTitle className={isDarkMode ? "text-white" : ""}>Waitlist Entries ({filteredWaitlist.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={isDarkMode ? "border-b border-gray-700" : "border-b"}>
                  <th className={`p-3 text-left ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>Name</th>
                  <th className={`p-3 text-left ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>Email</th>
                  <th className={`p-3 text-left ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>Company</th>
                  <th className={`p-3 text-left ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>Phone</th>
                  <th className={`p-3 text-left ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>Status</th>
                  <th className={`p-3 text-left ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>Joined</th>
                  <th className={`p-3 text-left ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWaitlist.map((entry) => (
                  <tr key={entry.id} className={isDarkMode ? "border-b border-gray-700 hover:bg-gray-700" : "border-b hover:bg-gray-50"}>
                    <td className={`p-3 ${isDarkMode ? "text-gray-100" : ""}`}>
                      <div className="font-medium">{entry.full_name}</div>
                    </td>
                    <td className={`p-3 ${isDarkMode ? "text-gray-100" : ""}`}>
                      <div className="flex items-center">
                        <Mail className={`mr-2 h-4 w-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                        {entry.email}
                      </div>
                    </td>
                    <td className={`p-3 ${isDarkMode ? "text-gray-100" : ""}`}>
                      {entry.company_name ? (
                        <div className="flex items-center">
                          <Building className={`mr-2 h-4 w-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                          {entry.company_name}
                        </div>
                      ) : (
                        <span className={isDarkMode ? "text-gray-500" : "text-gray-400"}>-</span>
                      )}
                    </td>
                    <td className={`p-3 ${isDarkMode ? "text-gray-100" : ""}`}>
                      {entry.phone ? (
                        <div className="flex items-center">
                          <Phone className={`mr-2 h-4 w-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                          {entry.phone}
                        </div>
                      ) : (
                        <span className={isDarkMode ? "text-gray-500" : "text-gray-400"}>-</span>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(entry.status)}>{entry.status}</Badge>
                    </td>
                    <td className={`p-3 ${isDarkMode ? "text-gray-100" : ""}`}>{new Date(entry.created_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(entry)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Waitlist Entry</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Status</label>
                                <Select
                                  value={editForm.status}
                                  onValueChange={(value) =>
                                    setEditForm((prev) => ({ ...prev, status: value }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="contacted">Contacted</SelectItem>
                                    <SelectItem value="converted">Converted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Notes</label>
                                <Textarea
                                  value={editForm.notes}
                                  onChange={(e) =>
                                    setEditForm((prev) => ({ ...prev, notes: e.target.value }))
                                  }
                                  placeholder="Add notes about this entry..."
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Contacted Date</label>
                                <Input
                                  type="date"
                                  value={editForm.contacted_at}
                                  onChange={(e) =>
                                    setEditForm((prev) => ({
                                      ...prev,
                                      contacted_at: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Contacted By</label>
                                <Input
                                  value={editForm.contacted_by}
                                  onChange={(e) =>
                                    setEditForm((prev) => ({
                                      ...prev,
                                      contacted_by: e.target.value,
                                    }))
                                  }
                                  placeholder="Who contacted this person?"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={handleUpdate} className="flex-1">
                                  Update Entry
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingEntry(null)}
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(entry.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
