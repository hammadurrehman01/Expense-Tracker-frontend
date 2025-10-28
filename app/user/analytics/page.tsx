"use client"

import { AnalyticsCards } from "@/components/analytics-cards"
import { CategoryBreakdownChart } from "@/components/category-breakdown-chart"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MonthlyTrendChart } from "@/components/monthly-trend-chart"
import { useState } from "react"


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

export default function AnalyticsPage() {
  const [expenses] = useState<Expense[]>(mockExpenses)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Analytics Cards */}
        <AnalyticsCards expenses={expenses} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryBreakdownChart expenses={expenses} />
          <MonthlyTrendChart expenses={expenses} />
        </div>
      </div>
    </DashboardLayout>
  )
}
