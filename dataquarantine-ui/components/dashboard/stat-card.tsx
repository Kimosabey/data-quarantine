'use client'

import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
    title: string
    value: string | number
    change?: number
    icon: React.ReactNode
    trend?: 'up' | 'down'
    gradient?: string
    delay?: number
}

export function StatCard({
    title,
    value,
    change,
    icon,
    trend,
    gradient = 'from-blue-500 to-purple-600',
    delay = 0,
}: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="relative overflow-hidden rounded-xl glass-dark p-6 hover:scale-105 transition-transform duration-300"
        >
            {/* Gradient background */}
            <div className={cn('absolute inset-0 bg-gradient-to-br opacity-10', gradient)} />

            {/* Content */}
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <div className={cn('p-2 rounded-lg bg-gradient-to-br', gradient)}>
                        {icon}
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <motion.h3
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: delay + 0.2 }}
                            className="text-3xl font-bold text-foreground"
                        >
                            {value}
                        </motion.h3>

                        {change !== undefined && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: delay + 0.4 }}
                                className={cn(
                                    'flex items-center gap-1 mt-2 text-sm font-medium',
                                    trend === 'up' ? 'text-green-500' : 'text-red-500'
                                )}
                            >
                                {trend === 'up' ? (
                                    <ArrowUp className="w-4 h-4" />
                                ) : (
                                    <ArrowDown className="w-4 h-4" />
                                )}
                                <span>{Math.abs(change)}%</span>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Glow effect */}
            <div className={cn('absolute -bottom-2 -right-2 w-24 h-24 rounded-full blur-2xl opacity-20 bg-gradient-to-br', gradient)} />
        </motion.div>
    )
}
