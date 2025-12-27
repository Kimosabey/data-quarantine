'use client'

import { motion } from 'framer-motion'
import { Search, Filter, Download, RefreshCw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

// Mock data
const mockQuarantineRecords = Array.from({ length: 10 }, (_, i) => ({
    id: `qr-${i + 1}`,
    topic: 'raw-events',
    partition: Math.floor(Math.random() * 3),
    offset: 12345 + i,
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    schema_name: 'user_event',
    schema_version: '1.0.0',
    error_type: ['schema_violation', 'missing_field', 'invalid_format'][Math.floor(Math.random() * 3)],
    error_message: 'Missing required field: user_id',
    created_at: new Date(Date.now() - Math.random() * 86400000).toISOString(),
}))

const errorTypeColors = {
    schema_violation: 'from-red-500 to-rose-600',
    missing_field: 'from-orange-500 to-amber-600',
    invalid_format: 'from-yellow-500 to-orange-500',
}

export default function QuarantinePage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Quarantine Browser</h1>
                    <p className="text-muted-foreground">Review and manage quarantined records</p>
                </div>

                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-foreground flex items-center gap-2 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05, rotate: 180 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center gap-2 glow-primary"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </motion.button>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-dark rounded-xl p-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option>All Topics</option>
                        <option>raw-events</option>
                        <option>user-events</option>
                    </select>

                    <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option>All Error Types</option>
                        <option>schema_violation</option>
                        <option>missing_field</option>
                        <option>invalid_format</option>
                    </select>

                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-foreground flex items-center justify-center gap-2 transition-colors">
                        <Filter className="w-4 h-4" />
                        More Filters
                    </button>
                </div>
            </motion.div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-dark rounded-xl overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Topic
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Schema
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Error Type
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Error Message
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Time
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {mockQuarantineRecords.map((record, index) => (
                                <motion.tr
                                    key={record.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                                    className="hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-foreground">
                                        {record.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                        {record.topic}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {record.schema_name} v{record.schema_version}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${errorTypeColors[record.error_type as keyof typeof errorTypeColors]} text-white`}>
                                            {record.error_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                                        {record.error_message}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(record.created_at), { addSuffix: true })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button className="text-primary hover:text-primary/80 font-medium transition-colors">
                                            View
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing 1 to 10 of 12,222 results
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-sm text-foreground transition-colors">
                            Previous
                        </button>
                        <button className="px-3 py-1 rounded bg-gradient-to-r from-blue-500 to-purple-600 text-sm text-white">
                            1
                        </button>
                        <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-sm text-foreground transition-colors">
                            2
                        </button>
                        <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-sm text-foreground transition-colors">
                            3
                        </button>
                        <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-sm text-foreground transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
