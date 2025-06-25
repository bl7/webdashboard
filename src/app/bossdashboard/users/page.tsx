"use client"
import React, { useState, useEffect } from "react"
import { Search, Plus, Users, X, Eye } from "lucide-react"
import { useDarkMode } from "../context/DarkModeContext"
interface User {
  id: number
  user_id: string
  company_name: string
  address: string
  created_at: string
  profile_picture: string | null
  name: string | null
  city: string | null
  state: string | null
  country: string | null
  zip: string | null
}

interface UsersPageProps {
  darkMode?: boolean
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const { darkMode } = useDarkMode()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    company_name: "",
    address: "",
  })

  const usersPerPage = 10

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/users")
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      (user.company_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.address || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage)

  // Add User Handler (implement your API call here)
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    // Implement your registerUser API call here
    // Example:
    // await registerUser({
    //   email: newUser.email,
    //   password: newUser.password,
    //   c_password: newUser.confirmPassword,
    //   company_name: newUser.company_name,
    //   address: newUser.address,
    // })
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

  // Render
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
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold">Users Management</h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Manage your users and their details
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Search and Stats */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search company or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full rounded-lg border py-2 pl-10 pr-4 transition-colors ${
              darkMode
                ? "border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-purple-500"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-purple-500"
            } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20`}
          />
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div
            className={`flex items-center space-x-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            <Users className="h-4 w-4" />
            <span>Total: {users.length}</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div
        className={`overflow-hidden rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${darkMode ? "divide-gray-700 bg-gray-900" : "divide-gray-200 bg-white"}`}
            >
              {paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">{user.company_name}</td>
                  <td className="px-6 py-4">{user.address}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openViewModal(user)}
                      className={`inline-flex items-center space-x-1 rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                        darkMode
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Showing {startIndex + 1} to {Math.min(startIndex + usersPerPage, filteredUsers.length)}{" "}
            of {filteredUsers.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                currentPage === 1
                  ? darkMode
                    ? "cursor-not-allowed bg-gray-800 text-gray-600"
                    : "cursor-not-allowed bg-gray-100 text-gray-400"
                  : darkMode
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
                    : darkMode
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
                  ? darkMode
                    ? "cursor-not-allowed bg-gray-800 text-gray-600"
                    : "cursor-not-allowed bg-gray-100 text-gray-400"
                  : darkMode
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
          <div
            className={`relative w-full max-w-md rounded-lg p-6 shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                Add New User
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className={`rounded-md p-1 transition-colors ${darkMode ? "text-gray-400 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className={`w-full rounded-md border px-3 py-2 transition-colors ${darkMode ? "border-gray-600 bg-gray-700 text-white focus:border-purple-500" : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20`}
                  required
                />
              </div>
              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className={`w-full rounded-md border px-3 py-2 transition-colors ${darkMode ? "border-gray-600 bg-gray-700 text-white focus:border-purple-500" : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20`}
                  required
                />
              </div>
              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                  className={`w-full rounded-md border px-3 py-2 transition-colors ${darkMode ? "border-gray-600 bg-gray-700 text-white focus:border-purple-500" : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20`}
                  required
                />
              </div>
              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}
                >
                  Company Name
                </label>
                <input
                  type="text"
                  value={newUser.company_name}
                  onChange={(e) => setNewUser({ ...newUser, company_name: e.target.value })}
                  className={`w-full rounded-md border px-3 py-2 transition-colors ${darkMode ? "border-gray-600 bg-gray-700 text-white focus:border-purple-500" : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20`}
                  required
                />
              </div>
              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}
                >
                  Address
                </label>
                <input
                  type="text"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                  className={`w-full rounded-md border px-3 py-2 transition-colors ${darkMode ? "border-gray-600 bg-gray-700 text-white focus:border-purple-500" : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20`}
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
          <div
            className={`relative w-full max-w-md rounded-lg p-6 shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                User Details
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className={`rounded-md p-1 transition-colors ${darkMode ? "text-gray-400 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Company:</span> {selectedUser.company_name}
              </div>
              <div>
                <span className="font-semibold">Address:</span> {selectedUser.address}
              </div>
              <div>
                <span className="font-semibold">User ID:</span> {selectedUser.user_id}
              </div>
              <div>
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(selectedUser.created_at).toLocaleString()}
              </div>
              {selectedUser.profile_picture && (
                <div>
                  <span className="font-semibold">Profile Picture:</span>
                  <img
                    src={selectedUser.profile_picture}
                    alt="Profile"
                    className="mt-1 h-16 w-16 rounded-full object-cover"
                  />
                </div>
              )}
              {selectedUser.city && (
                <div>
                  <span className="font-semibold">City:</span> {selectedUser.city}
                </div>
              )}
              {selectedUser.state && (
                <div>
                  <span className="font-semibold">State:</span> {selectedUser.state}
                </div>
              )}
              {selectedUser.country && (
                <div>
                  <span className="font-semibold">Country:</span> {selectedUser.country}
                </div>
              )}
              {selectedUser.zip && (
                <div>
                  <span className="font-semibold">Zip:</span> {selectedUser.zip}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
