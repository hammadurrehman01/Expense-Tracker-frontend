"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface ExpenseFiltersProps {
  filters: {
    category: string
    dateRange: string
    searchTerm: string
  }
  onFilterChange: (filters: { category: string; dateRange: string; searchTerm: string }) => void
}

const categories = ["All", "Food", "Transportation", "Entertainment", "Health", "Education", "Utilities"]
const dateRanges = [
  { value: "all", label: "All Time" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
]

export function ExpenseFilters({ filters, onFilterChange }: ExpenseFiltersProps) {
  const handleCategoryChange = (value: string) => {
    onFilterChange({
      ...filters,
      category: value.toLowerCase(),
    })
  }

  const handleDateRangeChange = (value: string) => {
    onFilterChange({
      ...filters,
      dateRange: value,
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      searchTerm: e.target.value,
    })
  }

  const handleReset = () => {
    onFilterChange({
      category: "all",
      dateRange: "all",
      searchTerm: "",
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={filters.searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={filters.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Range Filter */}
            <Select value={filters.dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Reset Button */}
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
