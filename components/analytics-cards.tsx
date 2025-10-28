"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Zap } from "lucide-react"

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: Date
  paymentMethod: string
}

interface AnalyticsCardsProps {
  expenses: Expense[]
}

export function AnalyticsCards({ expenses }: AnalyticsCardsProps) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  // Calculate category-wise totals
  const categoryTotals: Record<string, number> = {}
  expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount
  })

  const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0]

  // Calculate monthly average
  const monthlyTotals: Record<string, number> = {}
  expenses.forEach((exp) => {
    const monthKey = exp.date.toISOString().slice(0, 7)
    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + exp.amount
  })

  const monthlyAverage =
    Object.values(monthlyTotals).length > 0 ? totalExpenses / Object.values(monthlyTotals).length : 0

  // Calculate trend (compare last month to previous month)
  const sortedMonths = Object.entries(monthlyTotals).sort(([a], [b]) => b.localeCompare(a))
  const lastMonthTotal = sortedMonths[0]?.[1] || 0
  const previousMonthTotal = sortedMonths[1]?.[1] || 0
  const trend = previousMonthTotal > 0 ? ((lastMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Expenses Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">{expenses.length} transactions</p>
        </CardContent>
      </Card>

      {/* Top Category Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topCategory?.[0] || "N/A"}</div>
          <p className="text-xs text-muted-foreground">${topCategory?.[1]?.toFixed(2) || "0.00"}</p>
        </CardContent>
      </Card>

      {/* Monthly Average Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${monthlyAverage.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Per month</p>
        </CardContent>
      </Card>

      {/* Trend Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Month Trend</CardTitle>
          {trend >= 0 ? (
            <TrendingUp className="h-4 w-4 text-destructive" />
          ) : (
            <TrendingDown className="h-4 w-4 text-green-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${trend >= 0 ? "text-destructive" : "text-green-600"}`}>
            {trend >= 0 ? "+" : ""}
            {trend.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">vs previous month</p>
        </CardContent>
      </Card>
    </div>
  )
}
