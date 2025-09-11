import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DollarSign } from "lucide-react"
import { ThemeToggle } from "./components/theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <ThemeToggle />
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-6">
          <DollarSign className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold text-balance">Expense Tracker</h1>
        <p className="text-lg text-muted-foreground text-pretty max-w-md">
          Take control of your finances with our comprehensive expense tracking solution
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
