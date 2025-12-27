'use client'

import { motion } from 'framer-motion'
import { Activity, CheckCircle, XCircle, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { ErrorBreakdown } from '@/components/dashboard/error-breakdown'
import { ValidationChart } from '@/components/dashboard/validation-chart'
import { formatNumber } from '@/lib/utils'

// Mock data - will be replaced with real API calls
const mockMetrics = {
  total_processed: 1234567,
  total_valid: 1222345,
  total_invalid: 12222,
  throughput: 10234,
}

const mockErrorBreakdown = {
  'schema_violation': 5500,
  'missing_field': 3600,
  'invalid_format': 1800,
  'timeout': 1200,
  'type_mismatch': 122,
}

const mockChartData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  valid: Math.floor(Math.random() * 5000) + 3000,
  invalid: Math.floor(Math.random() * 500) + 100,
}))

export default function DashboardPage() {
  const validPercentage = ((mockMetrics.total_valid / mockMetrics.total_processed) * 100).toFixed(2)
  const invalidPercentage = ((mockMetrics.total_invalid / mockMetrics.total_processed) * 100).toFixed(2)

  return (
    <div className="space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Real-time validation metrics and system health</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Processed"
          value={formatNumber(mockMetrics.total_processed)}
          change={12.5}
          trend="up"
          icon={<Activity className="w-5 h-5 text-white" />}
          gradient="from-blue-500 to-cyan-500"
          delay={0}
        />

        <StatCard
          title="Valid Records"
          value={formatNumber(mockMetrics.total_valid)}
          change={8.3}
          trend="up"
          icon={<CheckCircle className="w-5 h-5 text-white" />}
          gradient="from-green-500 to-emerald-500"
          delay={0.1}
        />

        <StatCard
          title="Quarantined"
          value={formatNumber(mockMetrics.total_invalid)}
          change={-2.1}
          trend="down"
          icon={<XCircle className="w-5 h-5 text-white" />}
          gradient="from-red-500 to-rose-500"
          delay={0.2}
        />

        <StatCard
          title="Throughput"
          value={`${formatNumber(mockMetrics.throughput)}/s`}
          change={15.7}
          trend="up"
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          gradient="from-purple-500 to-pink-500"
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ValidationChart data={mockChartData} />
        </div>

        <div>
          <ErrorBreakdown data={mockErrorBreakdown} />
        </div>
      </div>

      {/* Additional info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="glass-dark rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Validation Success Rate</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Valid</span>
                <span className="text-sm font-semibold text-green-500">{validPercentage}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${validPercentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Invalid</span>
                <span className="text-sm font-semibold text-red-500">{invalidPercentage}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${invalidPercentage}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-gradient-to-r from-red-500 to-rose-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-dark rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">System Status</h3>
          <div className="space-y-3">
            {[
              { name: 'Kafka Consumer', status: 'healthy' },
              { name: 'Schema Registry', status: 'healthy' },
              { name: 'PostgreSQL', status: 'healthy' },
              { name: 'MinIO Storage', status: 'healthy' },
            ].map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5"
              >
                <span className="text-sm text-foreground">{service.name}</span>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    className="w-2 h-2 rounded-full bg-green-500"
                  />
                  <span className="text-xs text-green-500 font-medium">Healthy</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
