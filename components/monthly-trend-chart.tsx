"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: Date
  paymentMethod: string
}

interface MonthlyTrendChartProps {
  expenses: Expense[]
}

export function MonthlyTrendChart({ expenses }: MonthlyTrendChartProps) {
  // Calculate monthly totals
  const monthlyTotals: Record<string, number> = {}
  expenses.forEach((exp) => {
    const monthKey = exp.date.toISOString().slice(0, 7)
    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + exp.amount
  })

  const data = Object.entries(monthlyTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      total: Number.parseFloat(total.toFixed(2)),
    }))

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trend</CardTitle>
          <CardDescription>Expenses over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Trend</CardTitle>
        <CardDescription>Expenses over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: any) => `$${value.toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#0ea5e9" name="Total Expenses" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
