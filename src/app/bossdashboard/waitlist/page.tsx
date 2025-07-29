"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  Download
} from "lucide-react"

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
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingEntry, setEditingEntry] = useState<WaitlistEntry | null>(null)
  const [editForm, setEditForm] = useState({
    status: "",
    notes: "",
    contacted_at: "",
    contacted_by: ""
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
        headers: { "Authorization": `Bearer ${bossToken}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setWaitlist(data.waitlist || [])
      } else if (response.status === 401) {
        toast.error("Authentication failed. Please login again.")
        // Redirect to login
        localStorage.removeItem("bossToken")
        window.location.href = "/boss/login"
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
      contacted_at: entry.contacted_at ? new Date(entry.contacted_at).toISOString().split('T')[0] : "",
      contacted_by: entry.contacted_by || ""
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
          "Authorization": `Bearer ${bossToken}`
        },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        toast.success("Entry updated successfully")
        fetchWaitlist()
        setEditingEntry(null)
      } else if (response.status === 401) {
        toast.error("Authentication failed. Please login again.")
        localStorage.removeItem("bossToken")
        window.location.href = "/boss/login"
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
        headers: { "Authorization": `Bearer ${bossToken}` }
      })

      if (response.ok) {
        toast.success("Entry deleted successfully")
        fetchWaitlist()
      } else if (response.status === 401) {
        toast.error("Authentication failed. Please login again.")
        localStorage.removeItem("bossToken")
        window.location.href = "/boss/login"
      } else {
        toast.error("Failed to delete entry")
      }
    } catch (error) {
      console.error("Error deleting entry:", error)
      toast.error("Failed to delete entry")
    }
  }

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Company", "Phone", "Status", "Notes", "Joined Date", "Contacted Date", "Contacted By"]
    const csvContent = [
      headers.join(","),
      ...filteredWaitlist.map(entry => [
        `"${entry.full_name}"`,
        `"${entry.email}"`,
        `"${entry.company_name || ""}"`,
        `"${entry.phone || ""}"`,
        `"${entry.status}"`,
        `"${entry.notes || ""}"`,
        `"${new Date(entry.created_at).toLocaleDateString()}"`,
        `"${entry.contacted_at ? new Date(entry.contacted_at).toLocaleDateString() : ""}"`,
        `"${entry.contacted_by || ""}"`
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "contacted": return "bg-blue-100 text-blue-800"
      case "converted": return "bg-green-100 text-green-800"
      case "rejected": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filteredWaitlist = waitlist.filter(entry => {
    const matchesSearch = 
      entry.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.company_name && entry.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading waitlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Waitlist Management</h1>
        <p className="text-gray-600">Manage and track waitlist entries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold">{waitlist.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{waitlist.filter(w => w.status === "pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Contacted</p>
                <p className="text-2xl font-bold">{waitlist.filter(w => w.status === "contacted").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Converted</p>
                <p className="text-2xl font-bold">{waitlist.filter(w => w.status === "converted").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
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
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Waitlist Table */}
      <Card>
        <CardHeader>
          <CardTitle>Waitlist Entries ({filteredWaitlist.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Company</th>
                  <th className="text-left p-3">Phone</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Joined</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWaitlist.map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium">{entry.full_name}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        {entry.email}
                      </div>
                    </td>
                    <td className="p-3">
                      {entry.company_name ? (
                        <div className="flex items-center">
                          <Building className="h-4 w-4 text-gray-400 mr-2" />
                          {entry.company_name}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      {entry.phone ? (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          {entry.phone}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(entry.status)}>
                        {entry.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(entry)}
                            >
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
                                <Select value={editForm.status} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}>
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
                                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                                  placeholder="Add notes about this entry..."
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Contacted Date</label>
                                <Input
                                  type="date"
                                  value={editForm.contacted_at}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, contacted_at: e.target.value }))}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Contacted By</label>
                                <Input
                                  value={editForm.contacted_by}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, contacted_by: e.target.value }))}
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                        >
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