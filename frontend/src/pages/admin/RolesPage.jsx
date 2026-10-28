import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { listRoles, updateRolePermissions } from '@/api/roles.api'
import { useAuth } from '@/auth/AuthContext'

const permissionGroups = [
  ['Users', [PERMISSIONS.USER_READ, PERMISSIONS.USER_UPDATE_ROLE]],
  ['Roles', [PERMISSIONS.ROLE_READ, PERMISSIONS.ROLE_UPDATE]],
  ['Products', [PERMISSIONS.PRODUCT_READ, PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_UPDATE, PERMISSIONS.PRODUCT_DELETE]],
  ['Categories', [PERMISSIONS.CATEGORY_READ, PERMISSIONS.CATEGORY_CREATE, PERMISSIONS.CATEGORY_UPDATE, PERMISSIONS.CATEGORY_DELETE]],
  ['Blogs', [PERMISSIONS.BLOG_READ, PERMISSIONS.BLOG_CREATE, PERMISSIONS.BLOG_UPDATE, PERMISSIONS.BLOG_DELETE]],
  ['Customer', [PERMISSIONS.CART_MANAGE, PERMISSIONS.WISHLIST_MANAGE, PERMISSIONS.ADDRESS_MANAGE, PERMISSIONS.ORDER_MANAGE]],
]

export function RolesPage() {
  const { hasPermission } = useAuth()
  const canEditRoles = hasPermission(PERMISSIONS.ROLE_UPDATE)
  const [roles, setRoles] = useState([])
  const [drafts, setDrafts] = useState({})
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function loadRoles() {
    setError('')
    try {
      const data = await listRoles()
      setRoles(data)
      setDrafts(Object.fromEntries(data.map((role) => [
        role.role_id,
        role.permissions.map((permission) => permission.permission_key),
      ])))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    listRoles().then((data) => {
      if (!active) return
      setRoles(data)
      setDrafts(Object.fromEntries(data.map((role) => [
        role.role_id,
        role.permissions.map((permission) => permission.permission_key),
      ])))
      setLoading(false)
    }).catch((requestError) => {
      if (!active) return
      setError(requestError.message)
      setLoading(false)
    })
    return () => { active = false }
  }, [])

  function togglePermission(roleId, key) {
    setDrafts((current) => {
      const selected = current[roleId] || []
      return {
        ...current,
        [roleId]: selected.includes(key)
          ? selected.filter((item) => item !== key)
          : [...selected, key],
      }
    })
  }

  async function saveRole(role) {
    setSavingId(role.role_id)
    setError('')
    setNotice('')
    try {
      await updateRolePermissions(role.role_id, drafts[role.role_id] || [])
      setNotice(`${role.role_name} permissions updated.`)
      await loadRoles()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-accent-pink">Super Admin</p>
        <h2 className="mt-2 font-primary text-3xl font-bold">Roles & permissions</h2>
        <p className="mt-2 text-sm text-brand-text-muted">Review assigned access and save permission changes.</p>
      </header>
      {error && <p role="alert" className="rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-300">{error}</p>}
      {notice && <p role="status" className="rounded-md border border-green-500/40 bg-green-950/30 p-3 text-sm text-green-200">{notice}</p>}
      {loading ? <p role="status">Loading roles…</p> : roles.length === 0 ? <p>No roles are available.</p> : (
        <div className="space-y-5">
          {roles.map((role) => {
            const selected = drafts[role.role_id] || []
            return (
              <article key={role.role_id} className="rounded-xl border border-brand-border-subtle bg-brand-black p-5">
                <header className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-primary text-xl font-bold">{role.role_name}</h3>
                    <p className="mt-1 text-sm text-brand-text-muted">{role.description || 'No description'} · {role.user_count} users</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {!role.is_active && <span className="text-sm text-amber-300">Inactive</span>}
                    {role.is_locked && <span className="rounded-full border border-brand-accent-pink/50 px-3 py-1 text-xs text-brand-accent-pink">Locked</span>}
                    {!role.is_locked && canEditRoles && (
                      <Button disabled={savingId === role.role_id} onClick={() => saveRole(role)} className="min-h-11 bg-brand-accent-pink text-white hover:bg-brand-accent-magenta">
                        {savingId === role.role_id ? 'Saving…' : 'Save permissions'}
                      </Button>
                    )}
                  </div>
                </header>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {permissionGroups.map(([group, keys]) => (
                    <fieldset key={group} disabled={role.is_locked || !role.is_active || !canEditRoles} className="space-y-2 disabled:opacity-60">
                      <legend className="mb-2 text-sm font-semibold">{group}</legend>
                      {keys.map((key) => (
                        <label key={key} className="flex min-h-9 items-center gap-2 text-sm text-brand-text-muted">
                          <input
                            type="checkbox"
                            checked={selected.includes(key)}
                            onChange={() => togglePermission(role.role_id, key)}
                            className="size-4 accent-pink-500"
                          />
                          <span>{key}</span>
                        </label>
                      ))}
                    </fieldset>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
