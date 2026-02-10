import { cn } from "@/lib/utils"
import type React from "react"

type MetricVariant = "blue" | "teal" | "amber"

interface MetricCardProps {
    title: string
    valueText: number
    icon: React.ComponentType<{ size: number | string }> | string | null
    variant?: MetricVariant
    loading?: boolean
}

const variantStyles: Record<MetricVariant, { bg: string; icon: string; ring: string }> = {
    blue: {
        bg: "bg-metric-blue-bg",
        icon: "text-metric-blue",
        ring: "ring-metric-blue/20",
    },
    teal: {
        bg: "bg-metric-teal-bg",
        icon: "text-metric-teal",
        ring: "ring-metric-teal/20",
    },
    amber: {
        bg: "bg-metric-amber-bg",
        icon: "text-metric-amber",
        ring: "ring-metric-amber/20",
    },
}

export const MetricCard = ({
    title,
    valueText,
    icon: Icon,
    variant = "blue",
    loading
}: MetricCardProps) => {

    const styles = variantStyles[variant]
    
    return (
        <div
            className={cn(
                "relative flex min-w-[200px] flex-1 flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
                "ring-1",
                styles.ring
            )}
        >
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", styles.bg)}>
                    {Icon && <Icon size={"100%"} />}
                </div>
            </div>
            <div className="flex items-end gap-1">
                {loading ? (
                    <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
                ) : (
                    <span className="text-3xl font-bold tracking-tight text-card-foreground">
                        {valueText}
                    </span>
                )}
            </div>
        </div>
    )
}