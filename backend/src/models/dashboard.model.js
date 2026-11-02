import pool from '../config/db.js'

export async function getDashboardTotals() {
  const monthStart = getMonthStart()
  const [[orders], [users], [ordersByMonth], [usersByMonth]] = await Promise.all([
    pool.query('SELECT COUNT(*) AS total FROM orders'),
    pool.query('SELECT COUNT(*) AS total FROM users WHERE deleted_at IS NULL'),
    pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS total
       FROM orders
       WHERE created_at >= ? AND created_at < DATE_ADD(?, INTERVAL 12 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')`,
      [monthStart, monthStart],
    ),
    pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS total
       FROM users
       WHERE deleted_at IS NULL
         AND created_at >= ? AND created_at < DATE_ADD(?, INTERVAL 12 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')`,
      [monthStart, monthStart],
    ),
  ])

  return {
    orderCount: Number(orders[0].total),
    userCount: Number(users[0].total),
    ordersByMonth,
    usersByMonth,
  }
}

function getMonthStart() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}
