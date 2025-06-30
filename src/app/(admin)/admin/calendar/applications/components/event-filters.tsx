"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"

interface EventFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  categoryFilter: string
  onCategoryFilterChange: (value: string) => void
  priorityFilter: string
  onPriorityFilterChange: (value: string) => void
  onClearFilters: () => void
}

export function EventFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onClearFilters,
}: EventFiltersProps) {
  const hasActiveFilters =
    statusFilter !== "all" || categoryFilter !== "all" || priorityFilter !== "all" || searchTerm !== ""

  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="ml-auto">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="tech">Tech</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="community">Community</SelectItem>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="holiday">Holiday</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
