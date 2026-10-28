import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { listRoles } from '@/api/roles.api'
import { changeUserRole, listUsers } from '@/api/users.api'
import { PERMISSIONS } from '@/constants/permissions'
import { useAuth } from '@/auth/AuthContext'

const pageLimit = 20

export function UsersPage() {
  const { hasPermission } = useAuth()
  const canUpdateRoles = hasPermission(PERMISSIONS.USER_UPDATE_ROLE)
  const canReadRoles = hasPermission(PERMISSIONS.ROLE_READ)
  const [roles, setRoles] = useState([])
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState(null)
  const [search, setSearch] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [roleId, setRoleId] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [savingUserId, setSavingUserId] = useState(null)

  async function loadUsers() {
    setLoading(true)
    setError('')
    try {
      const result = await listUsers({
        page,
        limit: pageLimit,
        roleId,
        search: submittedSearch,
      })
      setUsers(result.items)
      setPagination(result.pagination)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!canReadRoles) return undefined
    listRoles()
      .then(setRoles)
      .catch((requestError) => setError(requestError.message))
  }, [canReadRoles])

  useEffect(() => {
    let active = true
    listUsers({ page, limit: pageLimit, roleId, search: submittedSearch })
      .then((result) => {
        if (!active) return
        setUsers(result.items)
        setPagination(result.pagination)
        setError('')
        setLoading(false)
      })
      .catch((requestError) => {
        if (!active) return
        setError(requestError.message)
        setLoading(false)
      })
    return () => { active = false }
  }, [page, roleId, submittedSearch])

  async function handleRoleChange(user, nextRoleId) {
    if (!canUpdateRoles || !nextRoleId || Number(nextRoleId) === Number(user.role_id)) return
    setSavingUserId(user.user_id)
    setError('')
    setNotice('')
    try {
      await changeUserRole(user.user_id, nextRoleId)
      setNotice(`Role updated for ${user.email}.`)
      await loadUsers()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSavingUserId(null)
    }
  }

  function submitSearch(event) {
    event.preventDefault()
    setLoading(true)
    setPage(1)
    setSubmittedSearch(search.trim())
  }

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-accent-pink">
          Super Admin
        </p>
        <h2 className="mt-2 font-primary text-3xl font-bold">Users</h2>
        <p className="mt-2 text-sm text-brand-text-muted">
          Search accounts, filter by role, and assign an active role.
        </p>
      </header>

      <form className="grid gap-4 rounded-xl border border-brand-border-subtle bg-brand-black p-4 sm:grid-cols-[minmax(12rem,1fr)_minmax(12rem,0.7fr)_auto]" onSubmit={submitSearch}>
        <div className="space-y-2">
          <Label htmlFor="user-search">Search email or username</Label>
          <Input id="user-search" value={search} maxLength={100} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="user-role-filter">Filter by role</Label>
          <select
            id="user-role-filter"
            value={roleId}
            onChange={(event) => {
              setLoading(true)
              setPage(1)
              setRoleId(event.target.value)
            }}
            className="h-10 w-full rounded-md border border-brand-border-subtle bg-brand-base px-3 text-brand-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink"
          >
            <option value="">All roles</option>
            {roles.map((role) => (
              <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
            ))}
          </select>
        </div>
        <Button type="submit" className="min-h-11 self-end bg-brand-accent-pink text-white hover:bg-brand-accent-magenta">
          Search
        </Button>
      </form>

      {error && <p role="alert" className="rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-300">{error}</p>}
      {notice && <p role="status" className="rounded-md border border-green-500/40 bg-green-950/30 p-3 text-sm text-green-200">{notice}</p>}

      <div className="overflow-x-auto rounded-xl border border-brand-border-subtle">
        <table className="w-full min-w-[48rem] text-left text-sm">
          <thead className="bg-brand-black text-brand-text-muted">
            <tr>
              <th className="p-3 font-medium">User</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Email verified</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium">Role history</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border-subtle">
            {loading ? (
              <tr><td className="p-5 text-brand-text-muted" colSpan="5">Loading users…</td></tr>
            ) : users.length === 0 ? (
              <tr><td className="p-5 text-brand-text-muted" colSpan="5">No users match these filters.</td></tr>
            ) : users.map((user) => (
              <tr key={user.user_id} className="bg-brand-base">
                <td className="p-3">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-brand-text-muted">{user.email}</p>
                </td>
                <td className="p-3">{user.status}</td>
                <td className="p-3">{user.is_email_verified ? 'Yes' : 'No'}</td>
                <td className="p-3">
                  <select
                    aria-label={`Role for ${user.email}`}
                    value={user.role_id}
                    disabled={!canUpdateRoles || !canReadRoles || savingUserId === user.user_id}
                    onChange={(event) => handleRoleChange(user, event.target.value)}
                    className="min-h-10 rounded-md border border-brand-border-subtle bg-brand-black px-2 text-brand-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink disabled:opacity-60"
                  >
                    {roles.some((role) => Number(role.role_id) === Number(user.role_id)) ? (
                      roles.filter((role) => role.is_active || Number(role.role_id) === Number(user.role_id)).map((role) => (
                        <option key={role.role_id} value={role.role_id} disabled={!role.is_active}>{role.role_name}</option>
                      ))
                    ) : (
                      <option value={user.role_id}>{user.role_name || `Role ${user.role_id}`}</option>
                    )}
                  </select>
                  {savingUserId === user.user_id && <span className="ml-2 text-xs text-brand-text-muted">Saving…</span>}
                </td>
                <td className="max-w-56 p-3 text-xs text-brand-text-muted">
                  History is recorded, but the backend does not expose a history-read endpoint yet.
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <nav className="flex items-center justify-between gap-4" aria-label="User pages">
          <p className="text-sm text-brand-text-muted">
            Page {pagination.page} of {Math.max(pagination.total_pages, 1)} · {pagination.total} users
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1 || loading} onClick={() => { setLoading(true); setPage((current) => current - 1) }}>Previous</Button>
            <Button variant="outline" disabled={page >= pagination.total_pages || loading} onClick={() => { setLoading(true); setPage((current) => current + 1) }}>Next</Button>
          </div>
        </nav>
      )}
    </section>
  )
}
