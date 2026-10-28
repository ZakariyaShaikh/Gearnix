import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { listBlogs, updateBlog, getAdminBlog } from '@/api/blogs.api'
import { BlogEditor } from '@/pages/admin/BlogEditor'
import { formatDate } from '@/utils/media'

const pageLimit = 12

export function BlogsAdminPage() {
  const [blogs, setBlogs] = useState([])
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [editorBlog, setEditorBlog] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [loadingBlogId, setLoadingBlogId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function loadBlogs() {
    setLoading(true)
    setError('')
    try {
      const result = await listBlogs({
        page,
        limit: pageLimit,
        search: submittedSearch,
        includeDrafts: true,
      })
      setBlogs(result.items)
      setPagination(result.pagination)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    listBlogs({ page, limit: pageLimit, search: submittedSearch, includeDrafts: true })
      .then((result) => {
        if (!active) return
        setBlogs(result.items)
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
  }, [page, submittedSearch])

  async function openBlog(blogId) {
    setLoadingBlogId(blogId)
    setError('')
    try {
      setEditorBlog(await getAdminBlog(blogId))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoadingBlogId(null)
    }
  }

  async function togglePublished(blog) {
    setError('')
    setNotice('')
    try {
      await updateBlog(blog.blog_id, { is_published: !blog.is_published })
      setNotice(blog.is_published ? 'Post unpublished; its published date is retained.' : 'Post published.')
      await loadBlogs()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function handleSaved(message) {
    setEditorBlog(undefined)
    setNotice(message)
    await loadBlogs()
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-accent-pink">Blog Admin</p>
          <h2 className="mt-2 font-primary text-3xl font-bold">Blog posts</h2>
          <p className="mt-2 text-sm text-brand-text-muted">Drafts stay private until you publish them.</p>
        </div>
        {editorBlog === undefined && (
          <Button onClick={() => setEditorBlog(null)} className="min-h-11 bg-brand-accent-pink text-white hover:bg-brand-accent-magenta">
            <FiPlus aria-hidden="true" />
            New post
          </Button>
        )}
      </header>

      {editorBlog !== undefined && (
        <BlogEditor
          key={editorBlog?.blog_id || 'new'}
          blog={editorBlog}
          onClose={() => setEditorBlog(undefined)}
          onSaved={handleSaved}
        />
      )}

      <form className="grid gap-3 sm:grid-cols-[minmax(12rem,1fr)_auto]" onSubmit={(event) => { event.preventDefault(); setLoading(true); setPage(1); setSubmittedSearch(search.trim()) }}>
        <div className="space-y-2">
          <Label htmlFor="admin-blog-search">Search blog posts</Label>
          <Input id="admin-blog-search" value={search} maxLength={100} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <Button type="submit" variant="outline" className="min-h-11 self-end">Search</Button>
      </form>

      {error && <p role="alert" className="rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-300">{error}</p>}
      {notice && <p role="status" className="rounded-md border border-green-500/40 bg-green-950/30 p-3 text-sm text-green-200">{notice}</p>}
      <div className="overflow-x-auto rounded-xl border border-brand-border-subtle">
        <table className="w-full min-w-[46rem] text-left text-sm">
          <thead className="bg-brand-black text-brand-text-muted">
            <tr><th className="p-3">Post</th><th className="p-3">Status</th><th className="p-3">Published</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-brand-border-subtle">
            {loading ? (
              <tr><td className="p-5 text-brand-text-muted" colSpan="4">Loading posts…</td></tr>
            ) : blogs.length === 0 ? (
              <tr><td className="p-5 text-brand-text-muted" colSpan="4">No blog posts found.</td></tr>
            ) : blogs.map((blog) => (
              <tr key={blog.blog_id} className="bg-brand-base">
                <td className="p-3">
                  <p className="font-semibold">{blog.title}</p>
                  <p className="mt-1 text-xs text-brand-text-muted">/blogs/{blog.slug}</p>
                </td>
                <td className="p-3">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${blog.is_published ? 'bg-green-900/50 text-green-200' : 'bg-zinc-800 text-zinc-300'}`}>
                    {blog.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="p-3 text-brand-text-muted">{blog.published_at ? formatDate(blog.published_at) : '—'}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" disabled={loadingBlogId === blog.blog_id} onClick={() => openBlog(blog.blog_id)}>
                      {loadingBlogId === blog.blog_id ? 'Loading…' : 'Edit'}
                    </Button>
                    <Button variant="outline" onClick={() => togglePublished(blog)}>
                      {blog.is_published ? 'Unpublish' : 'Publish'}
                    </Button>
                    {blog.is_published && <Link to={`/blogs/${blog.slug}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-md px-3 text-brand-accent-pink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink">View</Link>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <nav className="flex items-center justify-between gap-4" aria-label="Blog pages">
          <p className="text-sm text-brand-text-muted">Page {pagination.page} of {Math.max(pagination.total_pages, 1)} · {pagination.total} posts</p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1 || loading} onClick={() => { setLoading(true); setPage((current) => current - 1) }}>Previous</Button>
            <Button variant="outline" disabled={page >= pagination.total_pages || loading} onClick={() => { setLoading(true); setPage((current) => current + 1) }}>Next</Button>
          </div>
        </nav>
      )}
    </section>
  )
}
