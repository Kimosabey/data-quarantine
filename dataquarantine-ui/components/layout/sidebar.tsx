'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, AlertTriangle, Activity, Settings, Database } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Quarantine', href: '/quarantine', icon: AlertTriangle },
    { name: 'Live Monitor', href: '/monitor', icon: Activity },
    { name: 'Schemas', href: '/schemas', icon: Database },
    { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed left-0 top-0 h-screen w-64 glass-dark border-r border-white/10 p-6 hidden md:block z-50"
        >
            {/* Logo */}
            <div className="mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center gap-3"
                >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center glow-primary">
                        <span className="text-xl font-bold text-white">DQ</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">DataQuarantine</h1>
                        <p className="text-xs text-muted-foreground">Schema Enforcer</p>
                    </div>
                </motion.div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
                {navigation.map((item, index) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        >
                            <Link
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                    isActive
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white glow-primary'
                                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        </motion.div>
                    )
                })}
            </nav>

            {/* Status indicator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute bottom-6 left-6 right-6"
            >
                <div className="glass p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-green-500"
                        />
                        <span className="text-sm font-medium text-foreground">System Online</span>
                    </div>
                    <p className="text-xs text-muted-foreground">All services operational</p>
                </div>
            </motion.div>
        </motion.div>
    )
}
