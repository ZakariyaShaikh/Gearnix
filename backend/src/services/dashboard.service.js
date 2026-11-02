import { getDashboardTotals } from '../models/dashboard.model.js'

export async function getDashboardAnalytics() {
  const { orderCount, userCount, ordersByMonth, usersByMonth } = await getDashboardTotals()
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date()
    date.setDate(1)
    date.setMonth(date.getMonth() - 11 + index)
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    return {
      month,
      label: date.toLocaleString('en-IN', { month: 'short' }),
      orders: 0,
      users: 0,
    }
  })

  const monthByKey = new Map(months.map((month) => [month.month, month]))
  for (const row of ordersByMonth) {
    const month = monthByKey.get(row.month)
    if (month) month.orders = Number(row.total)
  }
  for (const row of usersByMonth) {
    const month = monthByKey.get(row.month)
    if (month) month.users = Number(row.total)
  }

  return {
    totals: { orders: orderCount, users: userCount },
    months,
  }
}
