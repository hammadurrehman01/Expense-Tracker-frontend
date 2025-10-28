"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Search, X } from "lucide-react"

interface AdvancedFiltersProps {
  onFilterChange: (filters: {
    searchTerm: string
    categories: string[]
    paymentMethods: string[]
    minAmount: number
    maxAmount: number
    startDate: string
    endDate: string
  }) => void
}

const categories = ["Food", "Transportation", "Entertainment", "Health", "Education", "Utilities", "Other"]
const paymentMethods = ["Credit Card", "Debit Card", "Bank Transfer", "Cash"]

export function AdvancedExpenseFilters({ onFilterChange }: AdvancedFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])
  const [amountRange, setAmountRange] = useState([0, 1000])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleCategoryToggle = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(updated)
    applyFilters(searchTerm, updated, selectedPaymentMethods, amountRange, startDate, endDate)
  }

  const handlePaymentMethodToggle = (method: string) => {
    const updated = selectedPaymentMethods.includes(method)
      ? selectedPaymentMethods.filter((m) => m !== method)
      : [...selectedPaymentMethods, method]
    setSelectedPaymentMethods(updated)
    applyFilters(searchTerm, selectedCategories, updated, amountRange, startDate, endDate)
  }

  const handleAmountChange = (value: number[]) => {
    setAmountRange(value)
    applyFilters(searchTerm, selectedCategories, selectedPaymentMethods, value, startDate, endDate)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    applyFilters(value, selectedCategories, selectedPaymentMethods, amountRange, startDate, endDate)
  }

  const handleDateChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      setStartDate(value)
      applyFilters(searchTerm, selectedCategories, selectedPaymentMethods, amountRange, value, endDate)
    } else {
      setEndDate(value)
      applyFilters(searchTerm, selectedCategories, selectedPaymentMethods, amountRange, startDate, value)
    }
  }

  const applyFilters = (
    search: string,
    cats: string[],
    methods: string[],
    amount: number[],
    start: string,
    end: string,
  ) => {
    onFilterChange({
      searchTerm: search,
      categories: cats,
      paymentMethods: methods,
      minAmount: amount[0],
      maxAmount: amount[1],
      startDate: start,
      endDate: end,
    })
  }

  const handleReset = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setSelectedPaymentMethods([])
    setAmountRange([0, 1000])
    setStartDate("")
    setEndDate("")
    applyFilters("", [], [], [0, 1000], "", "")
  }

  const activeFiltersCount =
    (searchTerm ? 1 : 0) +
    selectedCategories.length +
    selectedPaymentMethods.length +
    (amountRange[0] > 0 || amountRange[1] < 1000 ? 1 : 0) +
    (startDate ? 1 : 0) +
    (endDate ? 1 : 0)

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>

          {/* Toggle Advanced Filters */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)} className="w-full justify-between">
              <span>Advanced Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              <span>{showAdvanced ? "−" : "+"}</span>
            </Button>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="space-y-4 pt-4 border-t border-border">
              {/* Categories */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Categories</Label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <div key={cat} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${cat}`}
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={() => handleCategoryToggle(cat)}
                      />
                      <Label htmlFor={`cat-${cat}`} className="font-normal cursor-pointer">
                        {cat}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Payment Methods</Label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <Checkbox
                        id={`method-${method}`}
                        checked={selectedPaymentMethods.includes(method)}
                        onCheckedChange={() => handlePaymentMethodToggle(method)}
                      />
                      <Label htmlFor={`method-${method}`} className="font-normal cursor-pointer">
                        {method}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amount Range */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Amount Range</Label>
                <div className="space-y-2">
                  <Slider
                    min={0}
                    max={1000}
                    step={10}
                    value={amountRange}
                    onValueChange={handleAmountChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${amountRange[0]}</span>
                    <span>${amountRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => handleDateChange("start", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => handleDateChange("end", e.target.value)}
                  />
                </div>
              </div>

              {/* Reset Button */}
              <Button variant="outline" onClick={handleReset} className="w-full gap-2 bg-transparent">
                <X className="w-4 h-4" />
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
