'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Activity, CheckCircle, ShieldAlert, Zap, Server, Database, HardDrive, Cpu, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { StatCard } from '@/components/dashboard/stat-card'
import { ErrorBreakdown } from '@/components/dashboard/error-breakdown'
import { ValidationChart } from '@/components/dashboard/validation-chart'
import { formatNumber } from '@/lib/utils'
import { fetchMetrics, SystemMetrics } from '@/lib/api'

export default function DashboardPage() {
  const [chartData, setChartData] = useState<Array<{ time: string; valid: number; invalid: number }>>([])
  const lastMetricsRef = useRef<SystemMetrics | null>(null)

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
    refetchInterval: 2000,
  })

  // Calculate real-time traffic (deltas) for the chart
  useEffect(() => {
    if (!metrics) return

    const now = new Date()
    const timeLabel = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })

    let validDelta = 0
    let invalidDelta = 0

    if (lastMetricsRef.current) {
      // Calculate instantaneous rate (events per fetch interval, approx 2s)
      validDelta = Math.max(0, metrics.total_valid - lastMetricsRef.current.total_valid)
      invalidDelta = Math.max(0, metrics.total_invalid - lastMetricsRef.current.total_invalid)
    }

    setChartData(prev => {
      const newData = [...prev, { time: timeLabel, valid: validDelta, invalid: invalidDelta }]
      return newData.slice(-20) // Keep last 20 points for a moving window
    })

    lastMetricsRef.current = metrics
  }, [metrics])

  const data = metrics || {
    total_processed: 0,
    total_valid: 0,
    total_invalid: 0,
    validation_rate: 0,
    throughput: 0,
    error_breakdown: {}
  }

  const validPercentage = data.total_processed > 0
    ? ((data.total_valid / data.total_processed) * 100).toFixed(2)
    : "0.00"

  const invalidPercentage = data.total_processed > 0
    ? ((data.total_invalid / data.total_processed) * 100).toFixed(2)
    : "0.00"

  if (isLoading && !metrics) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-1">Overview</h1>
          <p className="text-muted-foreground font-medium">System performance and data validation metrics.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-5 py-2.5 rounded-2xl neu-flat flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-br from-green-400 to-emerald-600"></span>
            </span>
            <span className="text-sm font-bold text-foreground">System Live</span>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Processed"
          value={formatNumber(data.total_processed)}
          change={12.5}
          trend="up"
          icon={<Activity className="w-6 h-6" />}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
          delay={0}
        />

        <StatCard
          title="Valid Records"
          value={formatNumber(data.total_valid)}
          change={8.3}
          trend="up"
          icon={<CheckCircle className="w-6 h-6" />}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
          delay={0.1}
        />

        <StatCard
          title="Quarantined"
          value={formatNumber(data.total_invalid)}
          change={-2.1}
          trend="down"
          icon={<ShieldAlert className="w-6 h-6" />}
          colorClass="text-rose-600"
          bgClass="bg-rose-50"
          delay={0.2}
        />

        <StatCard
          title="Throughput"
          value={`${formatNumber(data.throughput)}/s`}
          change={15.7}
          trend="up"
          icon={<Zap className="w-6 h-6" />}
          colorClass="text-violet-600"
          bgClass="bg-violet-50"
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Validation Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-[2.5rem] neu-flat p-2"
          >
            <ValidationChart data={chartData} />
          </motion.div>

          {/* Progress Bars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-[2rem] neu-flat p-8"
          >
            <h3 className="text-lg font-bold text-foreground mb-6">Validation Health</h3>
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Valid Messages</span>
                  <span className="text-lg font-black text-emerald-600">{validPercentage}%</span>
                </div>
                <div className="h-5 neu-pressed rounded-full overflow-hidden p-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${validPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Quarantined Messages</span>
                  <span className="text-lg font-black text-rose-600">{invalidPercentage}%</span>
                </div>
                <div className="h-5 neu-pressed rounded-full overflow-hidden p-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${invalidPercentage}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full shadow-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {/* Pass clean data to breakdown */}
            <ErrorBreakdown data={data.error_breakdown || {}} />
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="rounded-[2rem] neu-flat p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">System Status</h3>
              <div className="px-3 py-1 rounded-xl neu-pressed text-[10px] font-bold text-primary uppercase">Real-time</div>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Kafka Consumer', status: 'healthy', icon: Server, color: "text-orange-500" },
                { name: 'Schema Registry', status: 'healthy', icon: Database, color: "text-blue-500" },
                { name: 'PostgreSQL', status: 'healthy', icon: HardDrive, color: "text-indigo-500" },
                { name: 'MinIO Storage', status: 'healthy', icon: Cpu, color: "text-red-500" },
              ].map((service, index) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-4 rounded-2xl neu-flat hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl neu-pressed ${service.color}`}>
                      <service.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-foreground">{service.name}</span>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-md shadow-green-400/50"></div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
