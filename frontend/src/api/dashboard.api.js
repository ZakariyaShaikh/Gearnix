import { apiRequest } from '@/api/client'

export async function getDashboardAnalytics() {
  const response = await apiRequest('/dashboard/analytics')
  const data = response?.data
  if (
    !data ||
    !Number.isFinite(data.totals?.orders) ||
    !Number.isFinite(data.totals?.users) ||
    !Array.isArray(data.months) ||
    data.months.length !== 12
  ) {
    throw new Error('The server returned invalid dashboard analytics.')
  }
  return data
}
