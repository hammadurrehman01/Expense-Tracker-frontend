"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { EditExpenseDialog } from "@/components/edit-expense-dialog"
import { useSelector } from "react-redux"

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: Date
  paymentMethod: string
}

interface ExpenseListProps {
  expenses: Expense[]
  onUpdateExpense?: (expense: Expense) => void
  onDeleteExpense?: (id: string) => void
  currentPage?: number
  totalPages?: number
  totalExpenses?: number
  onPageChange?: (page: number) => void
}

const categoryColors: Record<string, string> = {
  Food: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Transportation: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Entertainment: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Health: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Education: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  Utilities: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
}

export function ExpenseList({
  expenses,
  onUpdateExpense,
  onDeleteExpense,
  currentPage = 1,
  totalPages = 1,
  totalExpenses = 0,
  onPageChange,
}: ExpenseListProps) {
  const user = useSelector((state: any) => state?.auth?.user)
  
  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No expenses found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-foreground">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">{expense.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge className={categoryColors[expense.category] || categoryColors.Other}>{expense.category}</Badge>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{user?.user?.currencySymbol}{'  '}{expense.amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{expense.date.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                {onUpdateExpense && <EditExpenseDialog expense={expense} onUpdateExpense={onUpdateExpense} />}
                {onDeleteExpense && (
                  <Button variant="ghost" size="icon" title="Delete" onClick={() => onDeleteExpense(expense.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && onPageChange && (
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
              {totalExpenses > 0 ? ` (${totalExpenses} total)` : ""}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
