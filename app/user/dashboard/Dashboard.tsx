"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AdvancedExpenseFilters } from "@/components/advanced-expense-filters"
import { ExpenseList } from "@/components/expense-list"
import api from "@/lib/axios"
import { useSelector } from "react-redux"

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: Date
  paymentMethod: string
}

export default function DashboardPage() {
  const user = useSelector((state: any) => state?.auth?.user)
  const userId = user?.user?.id || user?.user?._id || user?.id || user?._id
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [filters, setFilters] = useState({
    searchTerm: "",
    categories: [] as string[],
    paymentMethods: [] as string[],
    minAmount: 0,
    maxAmount: 1000,
    startDate: "",
    endDate: "",
  })

  const applyFilters = (newFilters: typeof filters, baseExpenses: Expense[]) => {
    let filtered = baseExpenses

    if (newFilters.searchTerm) {
      filtered = filtered.filter((exp) => exp.description.toLowerCase().includes(newFilters.searchTerm.toLowerCase()))
    }

    if (newFilters.categories.length > 0) {
      filtered = filtered.filter((exp) => newFilters.categories.includes(exp.category))
    }

    if (newFilters.paymentMethods.length > 0) {
      filtered = filtered.filter((exp) => newFilters.paymentMethods.includes(exp.paymentMethod))
    }

    filtered = filtered.filter((exp) => exp.amount >= newFilters.minAmount && exp.amount <= newFilters.maxAmount)

    if (newFilters.startDate) {
      const startDate = new Date(newFilters.startDate)
      filtered = filtered.filter((exp) => exp.date >= startDate)
    }

    if (newFilters.endDate) {
      const endDate = new Date(newFilters.endDate)
      endDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter((exp) => exp.date <= endDate)
    }

    return filtered
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    const filtered = applyFilters(newFilters, expenses)
    setFilteredExpenses(filtered)
  }

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!userId) return

      try {
        const response = await api.get("/expense", {
          params: { userId },
        })

        const payload = response?.data?.data || response?.data?.expenses || response?.data || []
        const expenseList = Array.isArray(payload) ? payload : []
        const mappedExpenses: Expense[] = expenseList.map((exp: any) => ({
          id: String(exp.id || exp._id || Date.now()),
          description: exp.description || "",
          amount: Number(exp.amount) || 0,
          category: exp.category || "Other",
          date: new Date(exp.date || exp.createdAt || new Date()),
          paymentMethod: exp.paymentMethod || "Unknown",
        }))

        setExpenses(mappedExpenses)
        setFilteredExpenses(applyFilters(filters, mappedExpenses))
      } catch (error) {
        console.error("Failed to fetch expenses:", error)
        setExpenses([])
        setFilteredExpenses([])
      }
    }

    fetchExpenses()
  }, [userId])

  useEffect(() => {
    setFilteredExpenses(applyFilters(filters, expenses))
  }, [expenses, filters])

  const handleAddExpense = (newExpense: Omit<Expense, "id">) => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString(),
    }
    const updatedExpenses = [expense, ...expenses]
    setExpenses(updatedExpenses)
    setFilteredExpenses(applyFilters(filters, updatedExpenses))
  }

  const handleUpdateExpense = (updatedExpense: Expense) => {
    const updatedExpenses = expenses.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
    setExpenses(updatedExpenses)
    setFilteredExpenses(applyFilters(filters, updatedExpenses))
  }

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter((exp) => exp.id !== id)
    setExpenses(updatedExpenses)
    setFilteredExpenses(applyFilters(filters, updatedExpenses))
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
            <div className="text-3xl font-bold text-primary">{user?.user?.currencySymbol}{'  '}{totalExpenses.toFixed(2)}</div>
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
