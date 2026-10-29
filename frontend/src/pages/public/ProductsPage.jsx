import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { listCategories, listPublicProducts } from '@/api/catalog.api'
import { ProductCard } from '@/components/shared/ProductCard'
import { PageMeta } from '@/components/shared/PageMeta'

const pageLimit = 12

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [categoryError, setCategoryError] = useState('')
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const page = Math.max(Number(searchParams.get('page')) || 1, 1)
  const queryKey = searchParams.toString()
  const [result, setResult] = useState({ key: null, items: [], pagination: null, error: '' })
  const loading = result.key !== queryKey
  const products = loading ? [] : result.items
  const pagination = loading ? null : result.pagination
  const error = loading ? '' : result.error

  useEffect(() => {
    let active = true
    listCategories({ includeHidden: false }).then((result) => {
      if (active) {
        setCategories(result)
        setCategoryError('')
      }
    }).catch((requestError) => {
      if (active) setCategoryError(requestError.message)
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    listPublicProducts({
      page,
      limit: pageLimit,
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
    }).then((result) => {
      if (!active) return
      setResult({ key: queryKey, items: result.items, pagination: result.pagination, error: '' })
    }).catch((requestError) => {
      if (!active) return
      setResult({ key: queryKey, items: [], pagination: null, error: requestError.message })
    })
    return () => { active = false }
  }, [page, queryKey, searchParams])

  function applyFilters(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    if (category) params.set('category', category)
    setSearchParams(params)
  }

  function setPage(nextPage) {
    const params = new URLSearchParams(searchParams)
    if (nextPage > 1) params.set('page', String(nextPage))
    else params.delete('page')
    setSearchParams(params)
  }

  return (
    <section className="space-y-8">
      <PageMeta title="Shop Products" description="Find the gaming gear that makes every session yours." />
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-pink">Gearnix gear</p>
        <h1 className="font-primary text-3xl font-bold sm:text-4xl">Shop Products</h1>
        <p className="max-w-2xl text-brand-text-muted">Find the gear that makes every session yours.</p>
      </header>

      <form onSubmit={applyFilters} className="grid gap-4 rounded-xl border border-brand-border-subtle bg-brand-black p-4 sm:grid-cols-[minmax(12rem,1fr)_minmax(12rem,0.65fr)_auto]">
        <div className="space-y-2">
          <Label htmlFor="store-product-search">Search products</Label>
          <Input id="store-product-search" value={search} maxLength={100} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="store-category">Category</Label>
          <select id="store-category" value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 w-full rounded-md border border-brand-border-subtle bg-brand-base px-3 text-brand-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink">
            <option value="">All categories</option>
            {categories.map((item) => <option key={item.category_id} value={item.slug}>{item.name}</option>)}
          </select>
        </div>
        <Button type="submit" className="min-h-11 self-end bg-brand-accent-pink text-white hover:bg-brand-accent-magenta">Apply filters</Button>
      </form>

      {error && <p role="alert" className="rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-300">{error}</p>}
      {categoryError && <p role="alert" className="rounded-md border border-amber-500/40 bg-amber-950/20 p-3 text-sm text-amber-200">Categories could not be loaded: {categoryError}</p>}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Loading products">
          {Array.from({ length: 8 }, (_, index) => <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-white/10 motion-reduce:animate-none" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-brand-border-subtle bg-brand-black p-8 text-center">
          <h2 className="font-primary text-xl font-bold">No products found</h2>
          <p className="mt-2 text-sm text-brand-text-muted">Try another search or choose a different category.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => <ProductCard key={product.product_id} product={product} />)}
        </div>
      )}

      {pagination && pagination.total_pages > 1 && (
        <nav className="flex items-center justify-between gap-4" aria-label="Product pages">
          <p className="text-sm text-brand-text-muted">Page {pagination.page} of {pagination.total_pages} · {pagination.total} products</p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1 || loading} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" disabled={page >= pagination.total_pages || loading} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </nav>
      )}
    </section>
  )
}
