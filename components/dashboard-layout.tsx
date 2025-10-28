"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, LayoutDashboard, BarChart3, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateExpenseDialog } from "@/components/create-expense-dialog"
import { ThemeToggle } from "@/app/components/theme-toggle"

interface DashboardLayoutProps {
  children: React.ReactNode
  onAddExpense?: (expense: {
    description: string
    amount: number
    category: string
    date: Date
    paymentMethod: string
  }) => void
}

export function DashboardLayout({ children, onAddExpense }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && <h1 className="font-bold text-lg text-primary">ExpenseTrack</h1>}
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto">
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className="w-full justify-start" title={item.label}>
                <item.icon className="w-4 h-4" />
                {sidebarOpen && <span className="ml-2">{item.label}</span>}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
              <p className="text-muted-foreground mt-1">Manage your expenses</p>
            </div>
            <CreateExpenseDialog onAddExpense={onAddExpense || (() => {})} />
          </div>

          {/* Content */}
          {children}
        </div>
      </main>
    </div>
  )
}
