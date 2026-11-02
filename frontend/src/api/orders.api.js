import { apiRequest } from '@/api/client'

function getData(response, action) {
  if (!response || !Object.hasOwn(response, 'data')) {
    throw new Error(`The server returned an invalid ${action} response.`)
  }
  return response.data
}

export async function listAllOrders({ page = 1, limit = 10, status = '', search = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (status) params.set('status', status)
  if (search.trim()) params.set('search', search.trim())

  const response = await apiRequest(`/orders/admin?${params}`)
  return getData(response, 'orders')
}
