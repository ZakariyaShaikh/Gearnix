import { apiRequest } from '@/api/client'

function getData(response, action) {
  if (!response || !Object.hasOwn(response, 'data')) {
    throw new Error(`The server returned an invalid ${action} response.`)
  }
  return response.data
}

export async function getProfile() {
  return getData(await apiRequest('/users/profile'), 'profile')
}

export async function updateProfile(values) {
  return getData(await apiRequest('/users/profile', { method: 'PATCH', body: values }), 'profile')
}

export async function changePassword(values) {
  return getData(await apiRequest('/users/change-password', { method: 'PATCH', body: values }), 'password change')
}

export async function uploadProfileImage(file) {
  const body = new FormData()
  body.append('profile_image', file)
  return getData(await apiRequest('/users/profile-image', { method: 'PATCH', body }), 'profile image')
}

export async function deleteAccount(values) {
  return getData(await apiRequest('/users/account', { method: 'DELETE', body: values }), 'account deletion')
}

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
