"use client"

export function FinanceBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/10 to-background" />

            {/* Animated Finance Icons */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
                {/* Dollar Signs */}
                <div className="absolute top-20 left-10 text-6xl font-bold text-primary animate-pulse">$</div>
                <div className="absolute top-40 right-20 text-4xl font-bold text-primary/60 animate-pulse delay-1000">$</div>
                <div className="absolute bottom-32 left-20 text-5xl font-bold text-primary/40 animate-pulse delay-2000">$</div>

                {/* Chart Lines */}
                <svg className="absolute top-1/4 right-1/4 w-32 h-24 text-primary/20" viewBox="0 0 100 60">
                    <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        points="0,50 20,30 40,35 60,15 80,20 100,5"
                        className="animate-pulse delay-500"
                    />
                </svg>

                <svg className="absolute bottom-1/3 left-1/3 w-28 h-20 text-primary/15" viewBox="0 0 100 60">
                    <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        points="0,40 25,25 50,30 75,10 100,15"
                        className="animate-pulse delay-1500"
                    />
                </svg>

                {/* Pie Chart */}
                <svg className="absolute top-1/3 left-1/4 w-20 h-20 text-primary/10" viewBox="0 0 42 42">
                    <circle
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="60 40"
                        strokeDashoffset="25"
                        className="animate-pulse delay-700"
                    />
                </svg>

                {/* Coins */}
                <div className="absolute bottom-1/4 right-1/3 w-8 h-8 rounded-full bg-primary/10 animate-pulse delay-300" />
                <div className="absolute top-1/2 left-1/5 w-6 h-6 rounded-full bg-primary/15 animate-pulse delay-1200" />
                <div className="absolute bottom-1/2 right-1/5 w-10 h-10 rounded-full bg-primary/8 animate-pulse delay-800" />
            </div>

            {/* Subtle Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
        `,
                    backgroundSize: "50px 50px",
                }}
            />
        </div>
    )
}
