'use client'

import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
    title: string
    value: string | number
    change?: number
    icon: React.ReactNode
    trend?: 'up' | 'down' | 'neutral'
    colorClass?: string  // e.g. text-blue-600
    bgClass?: string     // e.g. bg-blue-100
    delay?: number
}

export function StatCard({
    title,
    value,
    change,
    icon,
    trend,
    colorClass = "text-primary",
    bgClass = "bg-primary/10",
    delay = 0,
}: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="group relative overflow-hidden rounded-[2rem] neu-flat p-7 transition-all duration-300 hover:-translate-y-1"
        >
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">{title}</h3>
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: delay + 0.1 }}
                        className="text-4xl font-black text-foreground tracking-tight"
                    >
                        {typeof value === 'string' && value.endsWith('/s') ? (
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">{value}</span>
                        ) : (
                            <span className={`bg-clip-text text-transparent bg-gradient-to-br ${colorClass.replace('text-', 'from-').replace('600', '500')} to-foreground`}>
                                {value}
                            </span>
                        )}
                    </motion.div>
                </div>
                <div className={cn(
                    "p-3.5 rounded-2xl shadow-lg transition-transform group-hover:scale-110 duration-500 text-white",
                    // Convert basic bg colors to vibrant gradients matching the textual color intent
                    colorClass.includes('blue') ? 'bg-gradient-to-br from-blue-400 to-cyan-500 shadow-blue-400/40' :
                        colorClass.includes('emerald') ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-400/40' :
                            colorClass.includes('rose') ? 'bg-gradient-to-br from-rose-400 to-pink-500 shadow-rose-400/40' :
                                colorClass.includes('violet') ? 'bg-gradient-to-br from-violet-400 to-purple-500 shadow-violet-400/40' :
                                    'bg-slate-100'
                )}>
                    {icon}
                </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
                {change !== undefined && (
                    <div className={cn(
                        "flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl neu-pressed",
                        trend === 'up' ? "text-emerald-500" :
                            trend === 'down' ? "text-rose-500" : "text-slate-500"
                    )}>
                        {trend === 'up' ? <ArrowUp className="w-3.5 h-3.5" /> :
                            trend === 'down' ? <ArrowDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                        <span>{Math.abs(change)}%</span>
                    </div>
                )}
                <span className="text-xs font-medium text-muted-foreground/80">vs last hour</span>
            </div>
        </motion.div>
    )
}
