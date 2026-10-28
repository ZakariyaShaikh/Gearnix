import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCategory, listCategories, updateCategory } from '@/api/catalog.api'
import { PERMISSIONS } from '@/constants/permissions'
import { useAuth } from '@/auth/AuthContext'

export function CategoriesPage() {
  const { hasPermission } = useAuth()
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [draftNames, setDraftNames] = useState({})
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function loadCategories() {
    setError('')
    try {
      const data = await listCategories()
      setCategories(data)
      setDraftNames(Object.fromEntries(data.map((category) => [category.category_id, category.name])))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    listCategories().then((data) => {
      if (!active) return
      setCategories(data)
      setDraftNames(Object.fromEntries(data.map((category) => [category.category_id, category.name])))
      setLoading(false)
    }).catch((requestError) => {
      if (!active) return
      setError(requestError.message)
      setLoading(false)
    })
    return () => { active = false }
  }, [])

  async function handleCreate(event) {
    event.preventDefault()
    setError('')
    setNotice('')
    try {
      await createCategory({ name, description })
      setName('')
      setDescription('')
      setNotice('Category created.')
      await loadCategories()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function saveCategory(categoryId, values) {
    setSavingId(categoryId)
    setError('')
    setNotice('')
    try {
      await updateCategory(categoryId, values)
      setNotice('Category updated.')
      await loadCategories()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-accent-pink">Product Admin</p>
        <h2 className="mt-2 font-primary text-3xl font-bold">Categories</h2>
        <p className="mt-2 text-sm text-brand-text-muted">Manage active and hidden catalog categories.</p>
      </header>
      {hasPermission(PERMISSIONS.CATEGORY_CREATE) && (
        <form onSubmit={handleCreate} className="grid gap-4 rounded-xl border border-brand-border-subtle bg-brand-black p-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="new-category-name">Category name</Label>
            <Input id="new-category-name" required minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-category-description">Description (optional)</Label>
            <Input id="new-category-description" maxLength={500} value={description} onChange={(event) => setDescription(event.target.value)} />
          </div>
          <Button type="submit" className="min-h-11 bg-brand-accent-pink text-white hover:bg-brand-accent-magenta sm:col-span-2">Create category</Button>
        </form>
      )}
      {error && <p role="alert" className="rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-300">{error}</p>}
      {notice && <p role="status" className="rounded-md border border-green-500/40 bg-green-950/30 p-3 text-sm text-green-200">{notice}</p>}
      <div className="space-y-3">
        {loading ? <p role="status">Loading categories…</p> : categories.length === 0 ? <p>No categories found.</p> : categories.map((category) => {
          const active = Boolean(category.is_active)
          return (
            <article key={category.category_id} className="grid gap-3 rounded-xl border border-brand-border-subtle bg-brand-black p-4 md:grid-cols-[minmax(12rem,1fr)_auto_auto] md:items-center">
              <div>
                <Label htmlFor={`category-${category.category_id}`} className="sr-only">Category name</Label>
                <Input
                  id={`category-${category.category_id}`}
                  value={draftNames[category.category_id] ?? category.name}
                  disabled={!hasPermission(PERMISSIONS.CATEGORY_UPDATE)}
                  onChange={(event) => setDraftNames((current) => ({ ...current, [category.category_id]: event.target.value }))}
                />
                <p className="mt-1 text-xs text-brand-text-muted">{category.slug} · {active ? 'Visible' : 'Hidden'}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {hasPermission(PERMISSIONS.CATEGORY_UPDATE) && (
                  <>
                    <Button variant="outline" disabled={savingId === category.category_id || (draftNames[category.category_id] ?? category.name).trim() === category.name} onClick={() => saveCategory(category.category_id, { name: (draftNames[category.category_id] ?? category.name).trim() })}>
                      Save name
                    </Button>
                    <Button variant="outline" disabled={savingId === category.category_id} onClick={() => saveCategory(category.category_id, { is_active: !active })}>
                      {active ? 'Hide' : 'Show'}
                    </Button>
                  </>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
