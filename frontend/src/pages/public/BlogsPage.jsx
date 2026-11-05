import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FiSearch } from 'react-icons/fi'
import { listBlogs } from '@/api/blogs.api'
import { getMediaUrl } from '@/utils/media'
import { PageMeta } from '@/components/shared/PageMeta'

const pageLimit = 6
const categories = [
  'Headphones',
  'Keyboards',
  'Mouse',
  'Accessories',
  'Gaming Controllers',
  'Wireless Headset',
  'Wireless Keyboard',
]
const blogTags = ['Computer', 'Console', 'Headphone', 'Keyboard', 'Mouse']

function formatBlogDate(date) {
  if (!date) return ''
  const value = new Date(date)
  if (Number.isNaN(value.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  }).format(value).replace(',', '').toUpperCase()
}

export function BlogsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(Number(searchParams.get('page')) || 1, 1)
  const [result, setResult] = useState({ key: null, items: [], pagination: null, error: '' })
  const [recentResult, setRecentResult] = useState({ items: [], error: '', loaded: false })
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

  useEffect(() => {
    let active = true
    listBlogs({ page: 1, limit: 3 })
      .then((result) => {
        if (active) setRecentResult({ items: result.items, error: '', loaded: true })
      })
      .catch((requestError) => {
        if (active) setRecentResult({ items: [], error: requestError.message, loaded: true })
      })
    return () => { active = false }
  }, [])

  function submitSearch(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    setSearchParams(params)
  }

  function filterBy(term) {
    setSearch(term)
    setSearchParams(term ? { search: term } : {})
  }

  function goToPage(nextPage) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(nextPage))
    setSearchParams(params)
  }

  return (
    <section className="-mx-4 -mb-[calc(68px_+_env(safe-area-inset-bottom))] -mt-8 bg-brand-light px-4 pb-20 pt-16 text-brand-text-dark sm:-mx-6 sm:pt-28 md:-mb-12 md:pt-40">
      <PageMeta title="Gaming News & Stories" description="Read gaming news, guides, and stories from Gearnix." />
      <header className="text-center">
        <h1 className="font-primary text-2xl font-bold uppercase">News</h1>
        <p className="mt-2 text-xs">
          <Link to="/" className="hover:text-brand-accent-magenta">Home</Link>
          <span className="mx-2 text-brand-accent-magenta" aria-hidden="true">•</span>
          <span>News</span>
        </p>
      </header>

      <div className="mx-auto mt-10 grid max-w-[1280px] grid-cols-1 gap-10 sm:mt-16 sm:px-2 lg:mt-40 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-0">
        <aside className="order-2 space-y-10 lg:order-1 lg:pr-0" aria-label="Blog sidebar">
          <section aria-label="Categories" className="flex min-h-[364px] items-center rounded-md bg-zinc-100 px-10 py-8">
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <button type="button" onClick={() => filterBy(category)} className="flex min-h-6 items-center gap-3 text-left text-xs font-medium hover:text-brand-accent-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-magenta">
                    <span aria-hidden="true" className="size-[7px] shrink-0 rounded-full border border-zinc-400" />
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section aria-label="Search news" className="rounded-md bg-zinc-100 p-[30px]">
            <form onSubmit={submitSearch} className="relative">
              <Label htmlFor="blog-search" className="sr-only">Search news</Label>
              <Input id="blog-search" value={search} maxLength={100} placeholder="Search..." onChange={(event) => setSearch(event.target.value)} className="h-[50px] rounded-full border-zinc-400 bg-white pr-12 text-[10px] text-brand-text-dark placeholder:text-zinc-500" />
              <Button type="submit" aria-label="Search" className="absolute right-1 top-1 size-[42px] min-h-0 rounded-full bg-zinc-900 p-0 text-white hover:bg-zinc-700">
                <FiSearch aria-hidden="true" size={16} />
              </Button>
            </form>
          </section>

          <section aria-labelledby="recent-posts-heading" className="rounded-md border border-zinc-200 p-6">
            <h2 id="recent-posts-heading" className="border-b border-zinc-100 pb-4 font-primary text-sm font-bold uppercase">Recent Post</h2>
            <div className="mt-5 space-y-5">
              {recentResult.items.map((post) => (
                <Link key={post.blog_id} to={`/blogs/${post.slug}`} className="group grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4">
                  <span className="block aspect-square overflow-hidden rounded-sm bg-zinc-100">
                    {post.cover_image && <img src={getMediaUrl(post.cover_image)} alt="" loading="lazy" className="size-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[9px] uppercase text-zinc-400">{formatBlogDate(post.published_at)}</span>
                    <span className="mt-1 block line-clamp-3 font-primary text-[10px] font-bold leading-4 group-hover:text-brand-accent-magenta">{post.title}</span>
                  </span>
                </Link>
              ))}
              {!recentResult.loaded && <div className="h-28 animate-pulse rounded bg-zinc-100 motion-reduce:animate-none" />}
              {recentResult.error && <p role="alert" className="text-xs text-red-700">Could not load recent posts: {recentResult.error}</p>}
            </div>
          </section>

          <section aria-labelledby="blog-tags-heading" className="rounded-md border border-zinc-200 p-6">
            <h2 id="blog-tags-heading" className="border-b border-zinc-100 pb-4 font-primary text-sm font-bold">Blog Tags</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {blogTags.map((tag) => (
                <button key={tag} type="button" onClick={() => filterBy(tag)} className="rounded-sm bg-zinc-900 px-3 py-2 text-[10px] font-semibold text-white hover:bg-brand-accent-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-magenta">
                  {tag}
                </button>
              ))}
            </div>
          </section>

          <section aria-labelledby="blog-banner-heading" className="rounded-md border border-zinc-200 p-6">
            <h2 id="blog-banner-heading" className="border-b border-zinc-100 pb-4 font-primary text-sm font-bold">Blog Banner</h2>
            <div aria-hidden="true" className="mt-5 aspect-[3/4] rounded-sm bg-zinc-50" />
          </section>
        </aside>

        <div id="blog-list" className="order-1 min-w-0 lg:order-2 lg:pl-[60px]">
          {error && <p role="alert" className="mb-6 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          {loading ? (
            <div className="space-y-[30px]">
              {Array.from({ length: pageLimit }, (_, index) => (
                <div key={index} className="grid gap-[30px] border-b border-zinc-200 pb-[30px] sm:grid-cols-[42.5%_minmax(0,1fr)]">
                  <div className="aspect-[4/3] animate-pulse bg-zinc-100 motion-reduce:animate-none" />
                  <div className="space-y-4">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-100 motion-reduce:animate-none" />
                    <div className="h-4 w-full animate-pulse rounded bg-zinc-100 motion-reduce:animate-none" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-100 motion-reduce:animate-none" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="py-10 text-center text-sm text-zinc-600">No published stories found.</p>
          ) : (
            <div className="space-y-[30px]">
              {posts.map((post) => (
                <article key={post.blog_id} className="group grid gap-[30px] border-b border-zinc-200 pb-[30px] sm:grid-cols-[42.5%_minmax(0,1fr)]">
                  <Link to={`/blogs/${post.slug}`} aria-label={post.title} className="block aspect-[4/3] overflow-hidden bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-magenta">
                    {post.cover_image && <img src={getMediaUrl(post.cover_image)} alt="" loading="lazy" className="size-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" />}
                  </Link>
                  <div className="flex min-w-0 flex-col items-start">
                    <Link to={`/blogs/${post.slug}`} className="block focus-visible:outline-none">
                      <h2 className="font-primary text-base font-bold uppercase leading-tight transition-colors group-hover:text-brand-accent-magenta">{post.title}</h2>
                    </Link>
                    <p className="mt-2 text-[9px] uppercase tracking-wide text-zinc-400">{formatBlogDate(post.published_at)} <span className="mx-2" aria-hidden="true">|</span> Gearnix</p>
                    {post.excerpt && <p className="mt-4 line-clamp-3 text-[11px] leading-[1.55] text-zinc-700">{post.excerpt}</p>}
                    <Link to={`/blogs/${post.slug}`} className="mt-5 inline-flex min-h-10 items-center rounded-full bg-zinc-900 px-6 text-xs font-semibold text-white transition-colors hover:bg-brand-accent-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-magenta focus-visible:ring-offset-2">
                      Read More
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {pagination && pagination.total_pages > 1 && (
            <nav className="mt-8 flex justify-center gap-3" aria-label="News pages">
              <Button variant="ghost" aria-label="Previous page" disabled={page <= 1 || loading} onClick={() => goToPage(page - 1)} className="size-11 min-h-0 rounded-full bg-zinc-100 p-0 text-zinc-900 hover:bg-zinc-200">
                ‹
              </Button>
              {Array.from({ length: pagination.total_pages }, (_, index) => index + 1).map((pageNumber) => (
                <Button key={pageNumber} variant="ghost" aria-current={pageNumber === page ? 'page' : undefined} disabled={loading} onClick={() => goToPage(pageNumber)} className={`size-11 min-h-0 rounded-full p-0 text-xs ${pageNumber === page ? 'bg-brand-accent-pink text-white hover:bg-brand-accent-magenta' : 'border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100'}`}>
                  {pageNumber}
                </Button>
              ))}
              <Button variant="ghost" aria-label="Next page" disabled={page >= pagination.total_pages || loading} onClick={() => goToPage(page + 1)} className="size-11 min-h-0 rounded-full bg-zinc-100 p-0 text-zinc-900 hover:bg-zinc-200">
                ›
              </Button>
            </nav>
          )}
        </div>
      </div>
    </section>
  )
}
