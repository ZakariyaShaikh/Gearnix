import { apiRequest } from '@/api/client'

export async function listRoles() {
  const response = await apiRequest('/roles')
  if (!Array.isArray(response?.data)) {
    throw new Error('The server returned an invalid roles response.')
  }
  return response.data
}

export async function updateRolePermissions(roleId, permissionKeys) {
  const response = await apiRequest(`/roles/${roleId}/permissions`, {
    method: 'PATCH',
    body: { permission_keys: permissionKeys },
  })
  if (!response?.data) throw new Error('The server returned an invalid role response.')
  return response.data
}
