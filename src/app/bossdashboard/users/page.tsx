"use client"
import React, { useState, useEffect } from "react"
import { Search, Plus, Users, X, Eye } from "lucide-react"
import { useDarkMode } from "../context/DarkModeContext"

interface User {
  id: number
  user_id: string
  company_name: string
  plan_name: string
  status: string
  current_period_end: string | null
  trial_end: string | null
  pending_plan_change: string | null
  pending_plan_change_effective: string | null
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [planFilter, setPlanFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const { isDarkMode } = useDarkMode()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    company_name: "",
    address: "",
  })

  const usersPerPage = 10

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      const res = await fetch("/api/subscription_better/users")
      const data = await res.json()
      if (data.error) {
        setUsers([])
      } else {
        setUsers(Array.isArray(data) ? data : [])
      }
      setLoading(false)
    }
    fetchUsers()
  }, [])

  // Filtering logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.company_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.plan_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.status || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = planFilter ? user.plan_name === planFilter : true
    const matchesStatus = statusFilter ? user.status === statusFilter : true
    return matchesSearch && matchesPlan && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage)

  // Add User Handler (implement your API call here)
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowAddModal(false)
    setNewUser({
      email: "",
      password: "",
      confirmPassword: "",
      company_name: "",
      address: "",
    })
  }

  // View Modal
  const openViewModal = (user: User) => {
    setSelectedUser(user)
    setShowViewModal(true)
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-2 h-12 w-12 animate-spin rounded-full border-b-2 border-purple-500"></div>
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold">Users Management</h1>
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Manage your users and their subscriptions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className={`flex items-center rounded border ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"}`}>
          <Search className="ml-2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className={`ml-2 bg-transparent py-2 px-2 outline-none ${isDarkMode ? "text-white" : "text-gray-900"}`}
          />
        </div>
        <select
          className={`rounded border p-2 ${isDarkMode ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"}`}
          value={planFilter}
          onChange={e => { setPlanFilter(e.target.value); setCurrentPage(1) }}
        >
          <option value="">All Plans</option>
          {[...new Set(users.map(u => u.plan_name))].map(plan => (
            <option key={plan} value={plan}>{plan}</option>
          ))}
        </select>
        <select
          className={`rounded border p-2 ${isDarkMode ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"}`}
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1) }}
        >
          <option value="">All Statuses</option>
          {[...new Set(users.map(u => u.status))].map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className={`overflow-x-auto rounded-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={isDarkMode ? "bg-gray-800" : "bg-gray-100"}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Renewal</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Trial End</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Pending Change</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedUsers.map(user => (
              <tr key={user.user_id} className={isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}>
                <td className="px-6 py-4">{user.company_name}</td>
                <td className="px-6 py-4">{user.plan_name}</td>
                <td className="px-6 py-4">{user.status}</td>
                <td className="px-6 py-4">{user.current_period_end ? new Date(user.current_period_end).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4">{user.trial_end ? new Date(user.trial_end).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4">{user.pending_plan_change ? `${user.pending_plan_change} (${user.pending_plan_change_effective ? new Date(user.pending_plan_change_effective).toLocaleDateString() : ''})` : '-'}</td>
                <td className="px-6 py-4">
                  <button
                    className="rounded bg-purple-600 text-white px-3 py-1 hover:bg-purple-700 transition"
                    onClick={() => openViewModal(user)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Showing {startIndex + 1} to {Math.min(startIndex + usersPerPage, filteredUsers.length)} of {filteredUsers.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                currentPage === 1
                  ? isDarkMode
                    ? "cursor-not-allowed bg-gray-800 text-gray-600"
                    : "cursor-not-allowed bg-gray-100 text-gray-400"
                  : isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-purple-600 text-white"
                    : isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? isDarkMode
                    ? "cursor-not-allowed bg-gray-800 text-gray-600"
                    : "cursor-not-allowed bg-gray-100 text-gray-400"
                  : isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className={`relative w-full max-w-md rounded-lg p-6 shadow-xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Add New User</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className={`rounded-md p-1 transition-colors ${isDarkMode ? "text-gray-400 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className={`w-full rounded-md border px-3 py-2 transition-colors ${isDarkMode ? "border-gray-600 bg-gray-700 text-white focus:border-purple-500" : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20`}
                  required
                />
              </div>
              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className={`w-full rounded-md border px-3 py-2 transition-colors ${isDarkMode ? "border-gray-600 bg-gray-700 text-white focus:border-purple-500" : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20`}
                  required
                />
              </div>
              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                  className={`w-full rounded-md border px-3 py-2 transition-colors ${isDarkMode ? "border-gray-600 bg-gray-700 text-white focus:border-purple-500" : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20`}
                  required
                />
              </div>
              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}
                >
                  Company Name
                </label>
                <input
                  type="text"
                  value={newUser.company_name}
                  onChange={(e) => setNewUser({ ...newUser, company_name: e.target.value })}
                  className={`w-full rounded-md border px-3 py-2 transition-colors ${isDarkMode ? "border-gray-600 bg-gray-700 text-white focus:border-purple-500" : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20`}
                  required
                />
              </div>
              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}
                >
                  Address
                </label>
                <input
                  type="text"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                  className={`w-full rounded-md border px-3 py-2 transition-colors ${isDarkMode ? "border-gray-600 bg-gray-700 text-white focus:border-purple-500" : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20`}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-purple-600 py-2 text-white transition-colors hover:bg-purple-700"
              >
                Add User
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className={`relative w-full max-w-md rounded-lg p-6 shadow-xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>User Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className={`rounded-md p-1 transition-colors ${isDarkMode ? "text-gray-400 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Company:</span> {selectedUser.company_name}
              </div>
              <div>
                <span className="font-semibold">Plan:</span> {selectedUser.plan_name}
              </div>
              <div>
                <span className="font-semibold">Status:</span> {selectedUser.status}
              </div>
              <div>
                <span className="font-semibold">Renewal Date:</span>{" "}
                {selectedUser.current_period_end ? new Date(selectedUser.current_period_end).toLocaleDateString() : '-'}
              </div>
              <div>
                <span className="font-semibold">Trial End:</span>{" "}
                {selectedUser.trial_end ? new Date(selectedUser.trial_end).toLocaleDateString() : '-'}
              </div>
              <div>
                <span className="font-semibold">Pending Change:</span>{" "}
                {selectedUser.pending_plan_change ? `${selectedUser.pending_plan_change} (${selectedUser.pending_plan_change_effective ? new Date(selectedUser.pending_plan_change_effective).toLocaleDateString() : ''})` : '-'}
              </div>
              <div>
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(selectedUser.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
