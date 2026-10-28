import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { listBlogs } from '@/api/blogs.api'
import { formatDate, getMediaUrl } from '@/utils/media'

const pageLimit = 12

export function BlogsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(Number(searchParams.get('page')) || 1, 1)
  const [result, setResult] = useState({ key: null, items: [], pagination: null, error: '' })
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const queryKey = searchParams.toString()
  const loading = result.key !== queryKey
  const posts = loading ? [] : result.items
  const pagination = loading ? null : result.pagination
  const error = loading ? '' : result.error

  useEffect(() => {
    let active = true
    listBlogs({ page, limit: pageLimit, search: searchParams.get('search') || '' })
      .then((result) => {
        if (!active) return
        setResult({ key: queryKey, items: result.items, pagination: result.pagination, error: '' })
      })
      .catch((requestError) => {
        if (!active) return
        setResult({ key: queryKey, items: [], pagination: null, error: requestError.message })
      })
    return () => { active = false }
  }, [page, queryKey, searchParams])

  function submitSearch(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    setSearchParams(params)
  }

  return (
    <section className="space-y-8 bg-brand-light py-6 text-brand-text-dark sm:py-10">
      <header className="text-center">
        <h1 className="font-primary text-4xl font-bold uppercase sm:text-5xl">News</h1>
        <p className="mt-3 text-sm">
          <Link to="/" className="hover:text-brand-accent-magenta">Home</Link>
          <span className="mx-2 text-brand-accent-magenta" aria-hidden="true">•</span>
          <span>News</span>
        </p>
      </header>

      <form onSubmit={submitSearch} className="mx-auto grid max-w-3xl gap-3 px-4 sm:grid-cols-[1fr_auto]">
        <div className="space-y-2">
          <Label htmlFor="blog-search">Search news</Label>
          <Input id="blog-search" value={search} maxLength={100} onChange={(event) => setSearch(event.target.value)} className="bg-white text-brand-text-dark" />
        </div>
        <Button type="submit" variant="outline" className="min-h-11 self-end">Search</Button>
      </form>

      {error && <p role="alert" className="mx-auto max-w-3xl rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {loading ? (
        <div className="grid gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <div key={index} className="aspect-[3/2] animate-pulse rounded-xl bg-zinc-200 motion-reduce:animate-none" />)}
        </div>
      ) : posts.length === 0 ? (
        <p className="px-4 py-10 text-center text-zinc-600">No published stories found.</p>
      ) : (
        <div className="grid gap-x-6 gap-y-10 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.blog_id} className="group">
              <Link to={`/blogs/${post.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-magenta">
                <div className="aspect-[3/2] overflow-hidden rounded-xl bg-zinc-200">
                  {post.cover_image ? <img src={getMediaUrl(post.cover_image)} alt={post.title} loading="lazy" className="size-full object-cover transition-transform duration-300 motion-reduce:transition-none group-hover:scale-105" /> : <div className="flex size-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 font-primary text-2xl font-bold text-white">{post.title}</div>}
                </div>
                <h2 className="mt-4 font-primary text-xl font-bold uppercase leading-snug transition-colors group-hover:text-brand-accent-magenta">{post.title}</h2>
                {/* TODO-DESIGN: Excerpt and date styling is unspecified in docs/design.md. */}
                {post.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">{post.excerpt}</p>}
                <p className="mt-3 text-sm text-zinc-500">{formatDate(post.published_at)}</p>
              </Link>
            </article>
          ))}
        </div>
      )}

      {pagination && pagination.total_pages > 1 && (
        <nav className="flex items-center justify-between px-4" aria-label="News pages">
          <p className="text-sm text-zinc-600">Page {pagination.page} of {pagination.total_pages}</p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1 || loading} onClick={() => { const params = new URLSearchParams(searchParams); params.set('page', String(page - 1)); setSearchParams(params) }}>Previous</Button>
            <Button variant="outline" disabled={page >= pagination.total_pages || loading} onClick={() => { const params = new URLSearchParams(searchParams); params.set('page', String(page + 1)); setSearchParams(params) }}>Next</Button>
          </div>
        </nav>
      )}
    </section>
  )
}
