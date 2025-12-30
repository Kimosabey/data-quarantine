'use client'

import { motion } from 'framer-motion'
import { Bell, Search, Command, HelpCircle } from 'lucide-react'

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm pt-4 px-6 md:px-8 pb-2">
            <div className="flex h-16 items-center gap-4">

                {/* Search Bar - Neumorphic Pressed/Inset */}
                <div className="flex-1 flex justify-center md:justify-start">
                    <div className="relative group w-full max-w-md">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search events, schemas, logs..."
                            className="w-full h-12 pl-12 pr-14 neu-pressed rounded-2xl text-sm focus:outline-none transition-all font-bold text-foreground placeholder:text-muted-foreground/60"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <kbd className="hidden md:inline-flex h-6 items-center gap-1 rounded-lg border border-transparent bg-transparent font-mono text-xs font-bold text-muted-foreground/50">
                                ⌘K
                            </kbd>
                        </div>
                    </div>
                </div>

                {/* Right Actions - Neumorphic Flat Buttons */}
                <div className="flex items-center gap-4">
                    <button className="neu-icon-btn w-11 h-11 text-muted-foreground">
                        <HelpCircle className="w-5 h-5" />
                    </button>

                    <button className="neu-icon-btn w-11 h-11 text-muted-foreground relative group">
                        <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border border-background shadow-sm"></span>
                    </button>

                    <div className="pl-2">
                        <button className="h-11 px-4 neu-flat rounded-xl flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-all">
                            <Command className="w-4 h-4" />
                            <span>Actions</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
