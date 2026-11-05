import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiShare2, FiPrinter } from 'react-icons/fi'
import { getPublicBlog } from '@/api/blogs.api'
import { listBlogs } from '@/api/blogs.api'
import { formatDate, getMediaUrl } from '@/utils/media'
import { sanitizeBlogHtml } from '@/utils/sanitize'
import { PageMeta } from '@/components/shared/PageMeta'

export function BlogDetailPage() {
  const { slug } = useParams()
  const [response, setResponse] = useState({ slug: null, post: null, error: '' })
  const [related, setRelated] = useState([])
  const loading = response.slug !== slug
  const post = loading ? null : response.post
  const error = loading ? '' : response.error

  useEffect(() => {
    let active = true
    getPublicBlog(slug).then((result) => {
      if (!active) return
      setResponse({ slug, post: result, error: '' })
    }).catch((requestError) => {
      if (!active) return
      setResponse({ slug, post: null, error: requestError.message })
    })
    return () => { active = false }
  }, [slug])

  useEffect(() => {
    let active = true
    listBlogs({ page: 1, limit: 3 }).then((result) => {
      if (!active) return
      setRelated(result.items.filter((item) => item.slug !== slug))
    }).catch(() => { setRelated([]) })
    return () => { active = false }
  }, [slug])

  if (loading) return <><PageMeta title="Gaming Story" /><p role="status" className="py-16 text-center">Loading story…</p></>
  if (error || !post) {
    return (
      <>
        <PageMeta title="Story Not Found" description="This gaming story is not available." />
        <section className="mx-auto max-w-xl py-16 text-center">
          <h1 className="font-primary text-3xl font-bold">Story not found</h1>
          <p role="alert" className="mt-3 text-brand-text-muted">{error || 'This story is not available.'}</p>
          <Link to="/blogs" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-brand-accent-pink px-6 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Back to News</Link>
        </section>
      </>
    )
  }

  return (
    <article className="mx-auto max-w-4xl space-y-8 py-4">
      <PageMeta
        title={post.title}
        description={post.excerpt || 'Read the latest gaming story from Gearnix.'}
        image={post.cover_image ? getMediaUrl(post.cover_image) : undefined}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-brand-text-muted">
        <Link to="/" className="hover:text-brand-accent-pink">Home</Link>
        <span aria-hidden="true"> / </span>
        <Link to="/blogs" className="hover:text-brand-accent-pink">News</Link>
      </nav>
      {post.cover_image && <img src={getMediaUrl(post.cover_image)} alt={post.title} className="max-h-[34rem] w-full rounded-2xl object-cover" />}
      <header>
        <h1 className="font-primary text-3xl font-bold uppercase leading-tight sm:text-4xl">{post.title}</h1>
        {post.excerpt && <p className="mt-4 text-lg leading-7 text-brand-text-muted">{post.excerpt}</p>}
        <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
          <Link to="/blogs" className="px-2 py-1 rounded border border-brand-border-subtle hover:border-brand-accent-pink hover:text-brand-accent-pink transition-colors">News</Link>
          <span className="text-zinc-500">·</span>
          <time dateTime={post.published_at} className="px-2 py-1 rounded border border-brand-border-subtle">{formatDate(post.published_at)}</time>
        </div>
      </header>
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1 lg:w-3/4">
          <div className="flex items-center gap-3 mb-8">
            <button type="button" className="inline-flex items-center gap-2 rounded border border-brand-border-subtle bg-brand-base px-3 py-2 text-xs font-semibold text-brand-text-primary hover:border-brand-accent-pink hover:text-brand-accent-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink">
              <FiShare2 size={14} />
              SHARE
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded border border-brand-border-subtle bg-brand-base px-3 py-2 text-xs font-semibold text-brand-text-primary hover:border-brand-accent-pink hover:text-brand-accent-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink">
              <FiPrinter size={14} />
              PRINT
            </button>
          </div>
          <div
            className="prose prose-invert max-w-none text-[17px] leading-[1.8] text-brand-text-primary [&_a]:text-brand-accent-pink [&_blockquote]:border-brand-accent-pink [&_h2]:font-primary [&_h3]:font-primary [&_li]:my-1"
            dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.content) }}
          />
        </main>
        <aside className="flex-none lg:w-1/4 space-y-6">
          <section className="space-y-4">
            <h3 className="font-primary text-lg font-bold uppercase">Related stories</h3>
            {related.length ? (
              <div className="space-y-4">
                {related.map((item) => (
                  <article key={item.blog_id} className="flex flex-col gap-2">
                    <Link to={`/blogs/${item.slug}`} className="text-sm font-medium text-brand-text-primary hover:text-brand-accent-pink line-clamp-2">{item.title}</Link>
                    <p className="text-xs text-brand-text-muted">{formatDate(item.published_at)}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-brand-text-muted">No related stories available.</p>
            )}
          </section>
        </aside>
      </div>
      <footer className="border-t border-brand-border-subtle pt-6">
        <Link to="/blogs" className="inline-flex min-h-11 items-center rounded-full border border-brand-border-subtle px-5 hover:border-brand-accent-pink hover:text-brand-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink">← Back to News</Link>
      </footer>
    </article>
  )
}
