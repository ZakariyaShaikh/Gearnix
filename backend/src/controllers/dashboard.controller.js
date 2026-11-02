import { getDashboardAnalytics as getDashboardAnalyticsService } from '../services/dashboard.service.js'

export async function getDashboardAnalytics(req, res) {
  try {
    const data = await getDashboardAnalyticsService()
    return res.status(200).json({
      success: true,
      message: 'Dashboard analytics fetched successfully',
      data,
    })
  } catch (error) {
    console.error('Failed to fetch dashboard analytics.', error)
    return res.status(500).json({
      success: false,
      message: 'Unable to load dashboard analytics.',
    })
  }
}
