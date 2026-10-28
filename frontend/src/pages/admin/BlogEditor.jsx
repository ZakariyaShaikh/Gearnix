import { useMemo, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import DOMPurify from 'dompurify'
import { FiBold, FiItalic, FiLink, FiList, FiMinus, FiPlus, FiUnderline } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createBlog, removeBlogCover, updateBlog, uploadBlogCover } from '@/api/blogs.api'
import { getMediaUrl } from '@/utils/media'

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function ToolbarButton({ label, pressed, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-brand-border-subtle px-3 text-brand-text-primary transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink"
    >
      {children}
    </button>
  )
}

export function BlogEditor({ blog, onClose, onSaved }) {
  const [blogId, setBlogId] = useState(blog?.blog_id || null)
  const [title, setTitle] = useState(blog?.title || '')
  const [slug, setSlug] = useState(blog?.slug || '')
  const [slugEdited, setSlugEdited] = useState(Boolean(blog?.slug))
  const [excerpt, setExcerpt] = useState(blog?.excerpt || '')
  const [published, setPublished] = useState(Boolean(blog?.is_published))
  const [coverImage, setCoverImage] = useState(blog?.cover_image || '')
  const [coverFile, setCoverFile] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const initialContent = useMemo(
    () => DOMPurify.sanitize(blog?.content || '', { USE_PROFILES: { html: true } }),
    [blog?.content],
  )
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'min-h-64 max-w-none px-4 py-3 text-brand-text-primary focus:outline-none [&_a]:text-brand-accent-pink [&_blockquote]:border-l-2 [&_blockquote]:border-brand-accent-pink [&_blockquote]:pl-4 [&_h2]:my-4 [&_h2]:font-primary [&_h2]:text-2xl [&_h3]:my-3 [&_h3]:font-primary [&_h3]:text-xl [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-6',
      },
    },
  })

  if (!editor) return <p role="status">Loading editor…</p>
  const currentSlug = slugEdited ? slug : slugify(title)

  function setLink() {
    const currentHref = editor.getAttributes('link').href || ''
    const href = window.prompt('Enter a link URL', currentHref)
    if (href === null) return
    if (!href.trim()) {
      editor.chain().focus().unsetLink().run()
      return
    }

    try {
      const url = new URL(href)
      if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) {
        setError('Use an http, https, or mailto link.')
        return
      }
    } catch {
      setError('Enter a valid absolute URL.')
      return
    }
    editor.chain().focus().setLink({ href }).run()
  }

  async function save(event, publishState = published) {
    event?.preventDefault()
    if (!editor.getText().trim()) {
      setError('Blog content is required.')
      return
    }
    const cleanSlug = currentSlug.trim()
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug)) {
      setError('Slug must use lowercase letters, numbers, and single hyphens.')
      return
    }

    setSaving(true)
    setError('')
    const cleanContent = DOMPurify.sanitize(editor.getHTML(), { USE_PROFILES: { html: true } })
    let activeBlogId = blogId

    try {
      const values = {
        title: title.trim(),
        slug: cleanSlug,
        excerpt: excerpt.trim() || null,
        content: cleanContent,
        is_published: activeBlogId ? publishState : false,
      }
      const saved = activeBlogId
        ? await updateBlog(activeBlogId, values)
        : await createBlog(values)
      activeBlogId = activeBlogId || saved.blog_id
      if (!activeBlogId) {
        throw new Error('The server saved the post but did not return its ID.')
      }
      setBlogId(activeBlogId)
      setCoverImage(saved.cover_image || coverImage)

      if (coverFile) {
        const cover = await uploadBlogCover(activeBlogId, coverFile)
        setCoverImage(cover.cover_image || '')
        setCoverFile(null)
      }

      if (!blogId && publishState) {
        await updateBlog(activeBlogId, { is_published: true })
      }

      await onSaved(publishState ? 'Blog published.' : 'Draft saved.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function deleteCover() {
    if (!blogId) {
      setCoverFile(null)
      setCoverImage('')
      return
    }
    setSaving(true)
    setError('')
    try {
      await removeBlogCover(blogId)
      setCoverImage('')
      setCoverFile(null)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} className="space-y-6 rounded-xl border border-brand-border-subtle bg-brand-black p-5 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-accent-pink">Blog Admin</p>
          <h3 className="mt-2 font-primary text-2xl font-bold">{blogId ? 'Edit blog post' : 'New blog post'}</h3>
        </div>
        <Button type="button" variant="outline" onClick={onClose}>Close editor</Button>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="blog-title">Title</Label>
          <Input id="blog-title" value={title} minLength={3} maxLength={200} required onChange={(event) => setTitle(event.target.value)} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="blog-slug">Slug</Label>
          <Input id="blog-slug" value={currentSlug} maxLength={220} required pattern="[a-z0-9]+(-[a-z0-9]+)*" onChange={(event) => { setSlugEdited(true); setSlug(event.target.value) }} />
          <p className="text-xs text-brand-text-muted">URL: /blogs/{currentSlug || 'your-post-slug'}</p>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="blog-excerpt">Excerpt</Label>
          <textarea id="blog-excerpt" value={excerpt} maxLength={500} onChange={(event) => setExcerpt(event.target.value)} className="min-h-24 w-full rounded-md border border-brand-border-subtle bg-brand-base px-3 py-2 text-brand-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink" />
          <p className="text-right text-xs text-brand-text-muted">{excerpt.length}/500</p>
        </div>
      </div>

      <section className="space-y-2">
        <Label>Content</Label>
        <div className="flex flex-wrap gap-2 rounded-t-md border border-brand-border-subtle bg-brand-base p-2" role="toolbar" aria-label="Blog formatting">
          <ToolbarButton label="Bold" pressed={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><FiBold aria-hidden="true" /></ToolbarButton>
          <ToolbarButton label="Italic" pressed={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><FiItalic aria-hidden="true" /></ToolbarButton>
          <ToolbarButton label="Underline" pressed={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><FiUnderline aria-hidden="true" /></ToolbarButton>
          <ToolbarButton label="Heading 2" pressed={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><span className="font-primary font-bold">H2</span></ToolbarButton>
          <ToolbarButton label="Heading 3" pressed={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><span className="font-primary font-bold">H3</span></ToolbarButton>
          <ToolbarButton label="Bulleted list" pressed={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><FiList aria-hidden="true" /></ToolbarButton>
          <ToolbarButton label="Quote" pressed={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><span className="font-serif text-lg">“</span></ToolbarButton>
          <ToolbarButton label="Add or edit link" pressed={editor.isActive('link')} onClick={setLink}><FiLink aria-hidden="true" /></ToolbarButton>
          <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}><FiMinus aria-hidden="true" /></ToolbarButton>
          <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}><FiPlus aria-hidden="true" /></ToolbarButton>
        </div>
        <EditorContent editor={editor} className="rounded-b-md border border-t-0 border-brand-border-subtle bg-brand-base [&_.ProseMirror-focused]:outline-none" />
        <p className="text-xs text-brand-text-muted">HTML is sanitized before saving and again before it is displayed.</p>
      </section>

      <section className="space-y-3">
        <Label htmlFor="blog-cover">Cover image (JPEG, PNG, or WebP; up to 2 MB)</Label>
        {coverImage && (
          <div className="max-w-xl space-y-3">
            <img src={getMediaUrl(coverImage)} alt={`Cover for ${title || 'blog post'}`} className="aspect-[3/2] w-full rounded-lg object-cover" />
            <Button type="button" variant="outline" disabled={saving} onClick={deleteCover}>Remove cover</Button>
          </div>
        )}
        <Input
          id="blog-cover"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file && file.size > 2 * 1024 * 1024) {
              setCoverFile(null)
              setError('Cover image must be 2 MB or smaller.')
              return
            }
            if (file && !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
              setCoverFile(null)
              setError('Cover image must be JPEG, PNG, or WebP.')
              return
            }
            setCoverFile(file || null)
            setError('')
          }}
        />
        {coverFile && <p className="text-sm text-brand-text-muted">Selected: {coverFile.name}</p>}
      </section>

      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} className="size-4 accent-pink-500" />
        Publish this post
      </label>

      {error && <p role="alert" className="rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-300">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" disabled={saving} onClick={(event) => save(event, false)}>
          {saving ? 'Saving…' : 'Save as draft'}
        </Button>
        <Button type="button" disabled={saving} onClick={(event) => save(event, true)} className="min-h-11 bg-brand-accent-pink text-white hover:bg-brand-accent-magenta">
          {saving ? 'Saving…' : published ? 'Publish changes' : 'Publish'}
        </Button>
      </div>
    </form>
  )
}
