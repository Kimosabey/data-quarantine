import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export interface MetricsData {
    total_processed: number
    total_valid: number
    total_invalid: number
    error_breakdown: Record<string, number>
    validation_rate: number
    throughput: number
}

export interface QuarantineRecord {
    id: string
    topic: string
    partition: number
    offset: number
    timestamp: string
    schema_name: string
    schema_version: string
    error_type: string
    error_message: string
    field_path?: string
    storage_path: string
    status: string
    created_at: string
}

export const metricsApi = {
    getMetrics: async (): Promise<MetricsData> => {
        const response = await api.get('/api/metrics')
        return response.data
    },
}

export const quarantineApi = {
    getRecords: async (params?: {
        page?: number
        page_size?: number
        topic?: string
        error_type?: string
    }): Promise<{ items: QuarantineRecord[]; total: number }> => {
        const response = await api.get('/api/quarantine/records', { params })
        return response.data
    },

    getRecord: async (id: string): Promise<QuarantineRecord> => {
        const response = await api.get(`/api/quarantine/records/${id}`)
        return response.data
    },
}
