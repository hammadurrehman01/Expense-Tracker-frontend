"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AdvancedExpenseFilters } from "@/components/advanced-expense-filters"
import { ExpenseList } from "@/components/expense-list"

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: Date
  paymentMethod: string
}

// Mock expense data
const mockExpenses: Expense[] = [
  {
    id: "1",
    description: "Grocery Shopping",
    amount: 125.5,
    category: "Food",
    date: new Date("2025-10-25"),
    paymentMethod: "Credit Card",
  },
  {
    id: "2",
    description: "Gas",
    amount: 45.0,
    category: "Transportation",
    date: new Date("2025-10-24"),
    paymentMethod: "Debit Card",
  },
  {
    id: "3",
    description: "Netflix Subscription",
    amount: 15.99,
    category: "Entertainment",
    date: new Date("2025-10-20"),
    paymentMethod: "Credit Card",
  },
  {
    id: "4",
    description: "Restaurant Dinner",
    amount: 85.3,
    category: "Food",
    date: new Date("2025-10-18"),
    paymentMethod: "Credit Card",
  },
  {
    id: "5",
    description: "Gym Membership",
    amount: 50.0,
    category: "Health",
    date: new Date("2025-10-15"),
    paymentMethod: "Bank Transfer",
  },
  {
    id: "6",
    description: "Book Purchase",
    amount: 24.99,
    category: "Education",
    date: new Date("2025-10-12"),
    paymentMethod: "Credit Card",
  },
  {
    id: "7",
    description: "Electricity Bill",
    amount: 120.0,
    category: "Utilities",
    date: new Date("2025-09-28"),
    paymentMethod: "Bank Transfer",
  },
  {
    id: "8",
    description: "Movie Tickets",
    amount: 30.0,
    category: "Entertainment",
    date: new Date("2025-09-15"),
    paymentMethod: "Credit Card",
  },
]

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(mockExpenses)
  const [filters, setFilters] = useState({
    searchTerm: "",
    categories: [] as string[],
    paymentMethods: [] as string[],
    minAmount: 0,
    maxAmount: 1000,
    startDate: "",
    endDate: "",
  })

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)

    let filtered = expenses

    // Filter by search term
    if (newFilters.searchTerm) {
      filtered = filtered.filter((exp) => exp.description.toLowerCase().includes(newFilters.searchTerm.toLowerCase()))
    }

    // Filter by categories
    if (newFilters.categories.length > 0) {
      filtered = filtered.filter((exp) => newFilters.categories.includes(exp.category))
    }

    // Filter by payment methods
    if (newFilters.paymentMethods.length > 0) {
      filtered = filtered.filter((exp) => newFilters.paymentMethods.includes(exp.paymentMethod))
    }

    // Filter by amount range
    filtered = filtered.filter((exp) => exp.amount >= newFilters.minAmount && exp.amount <= newFilters.maxAmount)

    // Filter by date range
    if (newFilters.startDate) {
      const startDate = new Date(newFilters.startDate)
      filtered = filtered.filter((exp) => exp.date >= startDate)
    }

    if (newFilters.endDate) {
      const endDate = new Date(newFilters.endDate)
      endDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter((exp) => exp.date <= endDate)
    }

    setFilteredExpenses(filtered)
  }

  const handleAddExpense = (newExpense: Omit<Expense, "id">) => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString(),
    }
    const updatedExpenses = [expense, ...expenses]
    setExpenses(updatedExpenses)
    setFilteredExpenses(updatedExpenses)
  }

  const handleUpdateExpense = (updatedExpense: Expense) => {
    const updatedExpenses = expenses.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
    setExpenses(updatedExpenses)
    handleFilterChange(filters)
  }

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter((exp) => exp.id !== id)
    setExpenses(updatedExpenses)
    handleFilterChange(filters)
  }

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <DashboardLayout onAddExpense={handleAddExpense}>
      <div className="space-y-6">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>Based on current filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">${totalExpenses.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-2">{filteredExpenses.length} transactions</p>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        <AdvancedExpenseFilters onFilterChange={handleFilterChange} />

        {/* Expense List */}
        <ExpenseList
          expenses={filteredExpenses}
          onUpdateExpense={handleUpdateExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      </div>
    </DashboardLayout>
  )
}
