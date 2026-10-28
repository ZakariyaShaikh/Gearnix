import { apiRequest } from '@/api/client'

export async function listUsers({ page = 1, limit = 20, roleId, search = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (roleId) params.set('role_id', String(roleId))
  if (search.trim()) params.set('search', search.trim())

  const response = await apiRequest(`/users?${params}`)
  if (!response?.data || !Array.isArray(response.data.items)) {
    throw new Error('The server returned an invalid users response.')
  }
  return response.data
}

export async function changeUserRole(userId, roleId, reason = '') {
  const response = await apiRequest(`/users/${userId}/role`, {
    method: 'PATCH',
    body: { role_id: Number(roleId), reason: reason.trim() || null },
  })
  if (!response?.data) throw new Error('The server returned an invalid user response.')
  return response.data
}
