"use client"

import { useEffect, useRef, useState } from "react"
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

interface ExpensePagination {
  page: number
  limit: number
  totalExpenses: number
  totalPages: number
}

export default function DashboardPage() {
  const user = useSelector((state: any) => state?.auth?.user)
  const userId = user?.user?.id || user?.user?._id || user?.id || user?._id
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [totalTransactions, setTotalTransactions] = useState<number>(0)
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<ExpensePagination>({
    page: 1,
    limit: 10,
    totalExpenses: 0,
    totalPages: 1,
  })
  const [isFiltering, setIsFiltering] = useState(false)
  const [totalExpenseAmount, setTotalExpenseAmount] = useState(0)
  const filterRequestIdRef = useRef(0)
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

  const mapApiExpenses = (expenseList: any[]) => {
    return expenseList.map((exp: any, index: number) => ({
      id: String(exp?.id || exp?._id || `${Date.now()}-${index}`),
      description: exp?.title || exp?.description || "",
      amount: Number(exp?.amount) || 0,
      category: exp?.category || "Other",
      date: new Date(exp?.date || exp?.createdAt || new Date()),
      paymentMethod: exp?.note || exp?.paymentMethod || "Unknown",
    })) as Expense[]
  }

  const hasActiveFilters = (f: typeof filters) => {
    return (
      !!f.searchTerm ||
      f.categories.length > 0 ||
      f.paymentMethods.length > 0 ||
      f.minAmount !== 0 ||
      f.maxAmount !== 1000 ||
      !!f.startDate ||
      !!f.endDate
    )
  }

  const fetchFilteredExpenses = async (newFilters: typeof filters, base?: Expense[]) => {
    if (!userId) return

    // If nothing is active, show whatever list we already have.
    if (!hasActiveFilters(newFilters)) {
      setFilteredExpenses(base ?? expenses)
      return
    }

    filterRequestIdRef.current += 1
    const requestId = filterRequestIdRef.current

    setIsFiltering(true)
    try {
      const params: Record<string, any> = { userId }

      if (newFilters.searchTerm) params.title = newFilters.searchTerm
      if (newFilters.categories.length > 0) params.category = newFilters.categories.join(",")

      if (newFilters.startDate || newFilters.endDate) {
        params.date =
          newFilters.startDate && newFilters.endDate
            ? `${newFilters.startDate},${newFilters.endDate}`
            : newFilters.startDate || newFilters.endDate
      }

      if (newFilters.paymentMethods.length > 0) params.note = newFilters.paymentMethods.join(",")
      // `id` isn't applicable for the list filter UI, so we omit it.

      const response = await api.get("/expense/filter", { params })
      const payload = response?.data?.data || response?.data?.expenses || response?.data || []
      const expenseList = Array.isArray(payload) ? payload : []
      const mappedExpenses = mapApiExpenses(expenseList)

      const next = applyFilters(newFilters, mappedExpenses)
      if (requestId === filterRequestIdRef.current) setFilteredExpenses(next)
    } catch (error) {
      console.error("Failed to filter expenses:", error)
      // Fallback: keep UI usable even if backend filter fails.
      const next = applyFilters(newFilters, base ?? expenses)
      if (requestId === filterRequestIdRef.current) setFilteredExpenses(next)
    } finally {
      if (requestId === filterRequestIdRef.current) setIsFiltering(false)
    }
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    fetchFilteredExpenses(newFilters)
  }

  const fetchTotalExpense = async () => {
    if (!userId) return

    try {
      const response = await api.get(`/expense/total/${userId}`, {
        params: { userId },
      })
      const totalPayload =
        response?.data?.expensesSummary?.[0]?.totalAmount ??
        0

      setTotalExpenseAmount(Number(totalPayload) || 0)
    } catch (error) {
      console.error("Failed to fetch total expenses:", error)
      setTotalExpenseAmount(0)
    }
  }

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!userId) return

      try {
        const response = await api.get("/expense", {
          params: { userId, page: currentPage },
        })

        const payload = response?.data?.data || response?.data?.expenses || response?.data || []
        const expenseList = Array.isArray(payload) ? payload : []
        const paginationPayload = response?.data?.pagination
        const mappedExpenses = mapApiExpenses(expenseList)

        setExpenses(mappedExpenses)
        if (paginationPayload) {
          setPagination({
            page: Number(paginationPayload.page) || currentPage,
            limit: Number(paginationPayload.limit) || 10,
            totalExpenses: Number(paginationPayload.totalExpenses) || 0,
            totalPages: Number(paginationPayload.totalPages) || 1,
          })
        } else {
          setPagination((prev) => ({
            ...prev,
            page: currentPage,
            totalExpenses: mappedExpenses.length,
            totalPages: 1,
          }))
        }
        fetchFilteredExpenses(filters, mappedExpenses)
      } catch (error) {
        console.error("Failed to fetch expenses:", error)
        setExpenses([])
        setFilteredExpenses([])
        setPagination((prev) => ({
          ...prev,
          page: currentPage,
          totalExpenses: 0,
          totalPages: 1,
        }))
      }
    }

    fetchExpenses()
  }, [userId, currentPage])

  useEffect(() => {
    fetchTotalExpense()
  }, [userId])

  const handleAddExpense = (newExpense: Omit<Expense, "id">) => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString(),
    }
    const updatedExpenses = [expense, ...expenses]
    setExpenses(updatedExpenses)
    fetchFilteredExpenses(filters, updatedExpenses)
    fetchTotalExpense()
  }

  const handleUpdateExpense = (updatedExpense: Expense) => {
    const updatedExpenses = expenses.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
    setExpenses(updatedExpenses)
    fetchFilteredExpenses(filters, updatedExpenses)
    fetchTotalExpense()
  }

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter((exp) => exp.id !== id)
    setExpenses(updatedExpenses)
    fetchFilteredExpenses(filters, updatedExpenses)
    fetchTotalExpense()
  }

  return (
    <DashboardLayout onAddExpense={handleAddExpense}>
      <div className="space-y-6">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>Calculated from all your saved expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{user?.user?.currencySymbol}{'  '}{totalExpenseAmount.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {isFiltering ? "Filtering..." : `${filteredExpenses.length} transactions`}
            </p>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        <AdvancedExpenseFilters onFilterChange={handleFilterChange} />

        {/* Expense List */}
        <ExpenseList
          expenses={filteredExpenses}
          onUpdateExpense={handleUpdateExpense}
          onDeleteExpense={handleDeleteExpense}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalExpenses={pagination.totalExpenses}
          onPageChange={setCurrentPage}
        />
      </div>
    </DashboardLayout>
  )
}
