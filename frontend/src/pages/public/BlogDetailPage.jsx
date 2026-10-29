import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPublicBlog } from '@/api/blogs.api'
import { formatDate, getMediaUrl } from '@/utils/media'
import { sanitizeBlogHtml } from '@/utils/sanitize'
import { PageMeta } from '@/components/shared/PageMeta'

export function BlogDetailPage() {
  const { slug } = useParams()
  const [response, setResponse] = useState({ slug: null, post: null, error: '' })
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
        <p className="text-sm text-brand-text-muted">{formatDate(post.published_at)}</p>
        <h1 className="mt-3 font-primary text-3xl font-bold uppercase leading-tight sm:text-4xl">{post.title}</h1>
        {post.excerpt && <p className="mt-4 text-lg leading-7 text-brand-text-muted">{post.excerpt}</p>}
      </header>
      <div
        className="prose prose-invert max-w-none text-[17px] leading-[1.8] text-brand-text-primary [&_a]:text-brand-accent-pink [&_blockquote]:border-brand-accent-pink [&_h2]:font-primary [&_h3]:font-primary [&_li]:my-1"
        dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.content) }}
      />
      <footer className="border-t border-brand-border-subtle pt-6">
        <Link to="/blogs" className="inline-flex min-h-11 items-center rounded-full border border-brand-border-subtle px-5 hover:border-brand-accent-pink hover:text-brand-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink">← Back to News</Link>
      </footer>
    </article>
  )
}
