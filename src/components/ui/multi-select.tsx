"use client"

import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface MultiSelectOption {
  value: string
  label: string
  description?: string
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  selectedValues: string[]
  onSelectionChange: (selectedValues: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  label?: string
  disabled?: boolean
  loading?: boolean
  error?: string
  emptyMessage?: string
  className?: string
  maxHeight?: string
}

export function MultiSelect({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  label,
  disabled = false,
  loading = false,
  error,
  emptyMessage = "No items available",
  className = "",
  maxHeight = "max-h-60",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [options, searchTerm])

  const selectedOptions = React.useMemo(() => {
    return options.filter((option) => selectedValues.includes(option.value))
  }, [options, selectedValues])

  const handleToggleOption = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]
    onSelectionChange(newSelection)
  }

  const handleRemoveOption = (value: string) => {
    onSelectionChange(selectedValues.filter((v) => v !== value))
  }

  const handleSelectAll = () => {
    if (selectedValues.length === filteredOptions.length) {
      // Deselect all filtered options
      const filteredValues = filteredOptions.map((option) => option.value)
      onSelectionChange(selectedValues.filter((value) => !filteredValues.includes(value)))
    } else {
      // Select all filtered options
      const filteredValues = filteredOptions.map((option) => option.value)
      const newSelection = [...new Set([...selectedValues, ...filteredValues])]
      onSelectionChange(newSelection)
    }
  }

  const isAllFilteredSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((option) => selectedValues.includes(option.value))

  const displayText = React.useMemo(() => {
    if (loading) return "Loading..."
    if (error) return `Error: ${error}`
    if (selectedValues.length === 0) return placeholder
    if (selectedValues.length === 1) {
      const option = options.find((opt) => opt.value === selectedValues[0])
      return option?.label || "1 item selected"
    }
    return `${selectedValues.length} items selected`
  }, [loading, error, selectedValues, placeholder, options])

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label className="text-sm font-medium">{label}</Label>}

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-between text-left font-normal ${
              error ? "border-red-500" : ""
            }`}
            disabled={disabled || loading}
          >
            <span className="truncate">{displayText}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-[var(--radix-dropdown-menu-trigger-width)]"
          side="bottom"
          align="start"
          sideOffset={4}
          avoidCollisions={false}
        >
          <DropdownMenuLabel>Select Items</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div className="px-2 py-1">
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          {filteredOptions.length > 1 && (
            <div className="px-2 py-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="h-8 w-full justify-start text-xs"
              >
                <Checkbox checked={isAllFilteredSelected} className="mr-2" />
                {isAllFilteredSelected ? "Deselect All" : "Select All"}
              </Button>
            </div>
          )}

          <div className={`${maxHeight} overflow-y-auto`}>
            {error ? (
              <div className="px-2 py-1 text-sm text-red-500">{error}</div>
            ) : loading ? (
              <div className="px-2 py-1 text-sm text-muted-foreground">Loading...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-2 py-1 text-sm text-muted-foreground">
                {searchTerm ? "No items found" : emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex cursor-pointer items-center space-x-2 px-2 py-2 hover:bg-muted/50"
                  onClick={() => handleToggleOption(option.value)}
                >
                  <Checkbox
                    checked={selectedValues.includes(option.value)}
                    className="pointer-events-none"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{option.label}</div>
                    {option.description && (
                      <div className="truncate text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Display selected items as badges */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option) => (
            <Badge key={option.value} variant="outline" className="text-xs">
              {option.label}
              <button
                type="button"
                className="ml-1 hover:text-destructive"
                onClick={() => handleRemoveOption(option.value)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
