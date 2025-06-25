"use client"

import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Plus } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

type GroupItem = {
  id: number
  name: string
}

type Group = {
  id: number
  name: string
  type: "Ingredient Group" | "Menu Item Group"
  items: GroupItem[]
  status: "Active" | "Inactive"
}

export default function GroupsTable() {
  const [search, setSearch] = useState("")
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 1,
      name: "Spicy Ingredients",
      type: "Ingredient Group",
      items: [
        { id: 1, name: "Chili Powder" },
        { id: 2, name: "Jalapeño" },
        { id: 3, name: "Cayenne Pepper" },
        { id: 4, name: "Red Pepper Flakes" },
        { id: 5, name: "Hot Sauce" },
      ],
      status: "Active",
    },
    {
      id: 2,
      name: "Lunch Combos",
      type: "Menu Item Group",
      items: [
        { id: 1, name: "Burger Combo" },
        { id: 2, name: "Sandwich Combo" },
        { id: 3, name: "Salad Combo" },
      ],
      status: "Inactive",
    },
  ])

  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const [currentGroup, setCurrentGroup] = useState<Group | null>(null)

  const [newGroup, setNewGroup] = useState<{
    name: string
    type: "Ingredient Group" | "Menu Item Group" | ""
    status: "Active" | "Inactive" | ""
  }>({
    name: "",
    type: "",
    status: "",
  })

  const [editGroupData, setEditGroupData] = useState<{
    name: string
    type: "Ingredient Group" | "Menu Item Group" | ""
    status: "Active" | "Inactive" | ""
  }>({
    name: "",
    type: "",
    status: "",
  })

  const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null)
  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(false)

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase())
  )

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage)
  const paginatedGroups = filteredGroups.slice(
    expandedGroupId ? 0 : (page - 1) * itemsPerPage,
    expandedGroupId ? filteredGroups.length : page * itemsPerPage
  )

  const handleAddGroup = () => {
    if (!newGroup.name || !newGroup.type || !newGroup.status) return

    const newId = groups.length ? Math.max(...groups.map((g) => g.id)) + 1 : 1
    setGroups([
      ...groups,
      {
        id: newId,
        name: newGroup.name,
        type: newGroup.type as "Ingredient Group" | "Menu Item Group",
        status: newGroup.status as "Active" | "Inactive",
        items: [],
      },
    ])

    setNewGroup({ name: "", type: "", status: "" })
    setOpenAdd(false)
  }

  const openEditDialog = (group: Group) => {
    setCurrentGroup(group)
    setEditGroupData({
      name: group.name,
      type: group.type,
      status: group.status,
    })
    setOpenEdit(true)
  }

  const handleSaveEdit = () => {
    if (!currentGroup || !editGroupData.name || !editGroupData.type || !editGroupData.status) return

    setGroups((prev) =>
      prev.map((g) =>
        g.id === currentGroup.id
          ? {
              ...g,
              name: editGroupData.name,
              type: editGroupData.type as "Ingredient Group" | "Menu Item Group",
              status: editGroupData.status as "Active" | "Inactive",
            }
          : g
      )
    )

    setOpenEdit(false)
    setCurrentGroup(null)
  }

  const openDeleteDialog = (group: Group) => {
    setCurrentGroup(group)
    setOpenDelete(true)
  }

  const handleDeleteGroup = () => {
    if (!currentGroup) return
    setGroups((prev) => prev.filter((g) => g.id !== currentGroup.id))
    setOpenDelete(false)
    setCurrentGroup(null)
  }

  // Loader and skeleton logic
  if (loading) {
    return <GroupsSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-card p-6 shadow-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">Groups</h2>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Input
              placeholder="Search groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white hover:bg-primary/90">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Group</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Group Name</Label>
                    <Input
                      id="name"
                      placeholder="E.g. Breakfast Specials"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="type">Group Type</Label>
                    <Select
                      value={newGroup.type}
                      onValueChange={(val) =>
                        setNewGroup({
                          ...newGroup,
                          type: val as "Ingredient Group" | "Menu Item Group",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select group type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ingredient Group">Ingredient Group</SelectItem>
                        <SelectItem value="Menu Item Group">Menu Item Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newGroup.status}
                      onValueChange={(val) =>
                        setNewGroup({
                          ...newGroup,
                          status: val as "Active" | "Inactive",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddGroup} className="bg-primary text-white">
                    Save Group
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Group Name</TableHead>
              <TableHead className="w-1/5">Type</TableHead>
              <TableHead className="w-1/4">Items (Inline)</TableHead>
              <TableHead className="w-1/6">Status</TableHead>
              <TableHead className="w-1/6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedGroups.map((group) => (
              <React.Fragment key={group.id}>
                <TableRow
                  onClick={() => setExpandedGroupId(expandedGroupId === group.id ? null : group.id)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.type}</TableCell>
                  <TableCell>
                    {group.items.length > 0 ? (
                      group.items.map((item) => item.name).join(", ")
                    ) : (
                      <span className="italic text-muted-foreground">No items</span>
                    )}
                  </TableCell>
                  <TableCell>{group.status}</TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditDialog(group)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        openDeleteDialog(group)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedGroupId === group.id && (
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={5}>
                      <div className="p-4">
                        <h3 className="mb-2 font-semibold">Items in "{group.name}"</h3>
                        {group.items.length === 0 ? (
                          <p className="italic text-muted-foreground">No items to display.</p>
                        ) : (
                          <ul className="list-inside list-disc space-y-1">
                            {group.items.map((item) => (
                              <li key={item.id}>{item.name}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>

        {/* Edit Group Dialog */}
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Group</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="edit-name">Group Name</Label>
                <Input
                  id="edit-name"
                  value={editGroupData.name}
                  onChange={(e) => setEditGroupData({ ...editGroupData, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-type">Group Type</Label>
                <Select
                  value={editGroupData.type}
                  onValueChange={(val) =>
                    setEditGroupData({
                      ...editGroupData,
                      type: val as "Ingredient Group" | "Menu Item Group",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select group type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ingredient Group">Ingredient Group</SelectItem>
                    <SelectItem value="Menu Item Group">Menu Item Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editGroupData.status}
                  onValueChange={(val) =>
                    setEditGroupData({
                      ...editGroupData,
                      status: val as "Active" | "Inactive",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveEdit} className="bg-primary text-white">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Group Dialog */}
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Group</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete the group <strong>{currentGroup?.name}</strong>? This
              action cannot be undone.
            </p>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setOpenDelete(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteGroup}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>

          {/* First page */}
          <Button
            variant={page === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setPage(1)}
            className="min-w-[36px] px-2 py-1"
          >
            1
          </Button>

          {/* Ellipsis before current range */}
          {page > 3 && totalPages > 5 && (
            <span className="px-2 py-1 text-muted-foreground">...</span>
          )}

          {/* Pages around current */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) => p !== 1 && p !== totalPages && Math.abs(p - page) <= 1 // show current, previous, next
            )
            .map((p) => (
              <Button
                key={p}
                variant={page === p ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(p)}
                className="min-w-[36px] px-2 py-1"
              >
                {p}
              </Button>
            ))}

          {/* Ellipsis after current range */}
          {page < totalPages - 2 && totalPages > 5 && (
            <span className="px-2 py-1 text-muted-foreground">...</span>
          )}

          {/* Last page */}
          {totalPages > 1 && (
            <Button
              variant={page === totalPages ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(totalPages)}
              className="min-w-[36px] px-2 py-1"
            >
              {totalPages}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

function GroupsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-muted-foreground/20" />
        <div className="h-10 w-32 animate-pulse rounded bg-muted-foreground/20" />
      </div>
      <div className="h-10 w-full animate-pulse rounded bg-muted-foreground/10" />
      <div className="h-96 animate-pulse rounded-2xl bg-muted-foreground/10" />
    </div>
  )
}
