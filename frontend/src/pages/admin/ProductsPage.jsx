import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  createProduct,
  deleteProductImage,
  getProduct,
  listCategories,
  listProducts,
  setPrimaryProductImage,
  updateProduct,
  uploadProductImages,
} from '@/api/catalog.api'
import { PERMISSIONS } from '@/constants/permissions'
import { useAuth } from '@/auth/AuthContext'

const pageLimit = 12

function getImageUrl(imageUrl) {
  if (!imageUrl) return ''
  try {
    return new URL(imageUrl, import.meta.env.VITE_API_URL).href
  } catch {
    return ''
  }
}

function ProductEditor({ product, onClose, onSaved }) {
  const { hasPermission } = useAuth()
  const editing = Boolean(product)
  const [values, setValues] = useState({
    name: product?.name || '',
    description: product?.details?.description || '',
    price: product?.details?.price ?? product?.price ?? '',
    stock_quantity: product?.details?.stock_quantity ?? product?.stock_quantity ?? 0,
    is_active: product ? Boolean(product.details?.is_active ?? product.is_active) : true,
  })
  const [categories, setCategories] = useState([])
  const [categoryIds, setCategoryIds] = useState(
    (product?.details?.categories || []).map((category) => Number(category.category_id)),
  )
  const [originalCategoryIds, setOriginalCategoryIds] = useState(
    (product?.details?.categories || []).map((category) => Number(category.category_id)),
  )
  const [images, setImages] = useState(product?.details?.images || [])
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(editing && product.is_active && !product.details)
  const [detailsAvailable, setDetailsAvailable] = useState(!editing || Boolean(product?.details))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    listCategories().then((items) => {
      if (active) setCategories(items.filter((item) => Boolean(item.is_active)))
    }).catch((requestError) => {
      if (active) setError(requestError.message)
    })

    if (editing && !product.details && product.is_active) {
      getProduct(product.product_id).then((details) => {
        if (!active) return
        setDetailsAvailable(true)
        setValues({
          name: details.name,
          description: details.description || '',
          price: details.price,
          stock_quantity: details.stock_quantity,
          is_active: Boolean(details.is_active),
        })
        const detailCategoryIds = (details.categories || []).map((category) => Number(category.category_id))
        setCategoryIds(detailCategoryIds)
        setOriginalCategoryIds(detailCategoryIds)
        setImages(details.images || [])
      }).catch((requestError) => {
        if (active) setError(requestError.message)
      }).finally(() => {
        if (active) setLoading(false)
      })
    }

    return () => { active = false }
  }, [editing, product])

  function toggleCategory(id) {
    setCategoryIds((current) => current.includes(id)
      ? current.filter((categoryId) => categoryId !== id)
      : [...current, id])
  }

  function selectImageFiles(event) {
    const selected = Array.from(event.target.files || [])
    if (selected.length > 5) {
      setFiles([])
      setError('You can upload at most 5 images at once.')
      return
    }
    if (selected.some((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))) {
      setFiles([])
      setError('Images must be JPEG, PNG, or WebP files.')
      return
    }
    if (selected.some((file) => file.size > 2 * 1024 * 1024)) {
      setFiles([])
      setError('Each image must be 2 MB or smaller.')
      return
    }
    setError('')
    setFiles(selected)
  }

  async function save(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    let savedProductId = product?.product_id

    try {
      const payload = {
        name: values.name.trim(),
        price: Number(values.price),
        stock_quantity: Number(values.stock_quantity),
        is_active: values.is_active,
      }
      if (!editing) {
        payload.description = values.description
        payload.category_ids = categoryIds
      } else if (detailsAvailable) {
        payload.description = values.description
        const categoriesChanged =
          categoryIds.length !== originalCategoryIds.length ||
          categoryIds.some((id) => !originalCategoryIds.includes(id))
        if (categoriesChanged) payload.category_ids = categoryIds
      }

      const saved = editing
        ? await updateProduct(savedProductId, payload)
        : await createProduct(payload)
      savedProductId = savedProductId || saved.product_id

      if (!savedProductId) {
        throw new Error('The server saved the product but did not return its ID.')
      }

      if (files.length > 0) {
        await uploadProductImages(savedProductId, files)
      }
      await onSaved()
    } catch (requestError) {
      if (!editing && savedProductId) {
        await onSaved(`Product created, but image upload failed: ${requestError.message}`)
      } else {
        setError(requestError.message)
      }
    } finally {
      setSaving(false)
    }
  }

  async function runImageAction(action) {
    setError('')
    try {
      const nextImages = await action()
      if (Array.isArray(nextImages)) setImages(nextImages)
      else setImages(await getProduct(product.product_id).then((detail) => detail.images || []))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  if (loading) return <p role="status">Loading product…</p>

  return (
    <form onSubmit={save} className="space-y-5 rounded-xl border border-brand-border-subtle bg-brand-black p-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-primary text-xl font-bold">{editing ? `Edit ${product.name}` : 'Create product'}</h3>
          {editing && !detailsAvailable && (
            <p className="mt-2 text-sm text-amber-200">
              This product is hidden. The API does not return full details for hidden products, so only its name, price, stock, and visibility can be changed here.
            </p>
          )}
        </div>
        <Button type="button" variant="outline" onClick={onClose}>Close</Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="product-name">Name</Label>
          <Input id="product-name" required minLength={2} maxLength={200} value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} />
        </div>
        {(!editing || detailsAvailable) && (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="product-description">Description</Label>
            <textarea id="product-description" maxLength={5000} value={values.description} onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))} className="min-h-28 w-full rounded-md border border-brand-border-subtle bg-brand-base px-3 py-2 text-brand-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink" />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="product-price">Price (₹)</Label>
          <Input id="product-price" type="number" min="0.01" step="0.01" required value={values.price} onChange={(event) => setValues((current) => ({ ...current, price: event.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-stock">Stock quantity</Label>
          <Input id="product-stock" type="number" min="0" step="1" required value={values.stock_quantity} onChange={(event) => setValues((current) => ({ ...current, stock_quantity: event.target.value }))} />
        </div>
      </div>

      {(!editing || detailsAvailable) && (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Categories</legend>
          {categories.length === 0 ? <p className="text-sm text-brand-text-muted">No active categories available.</p> : (
            <div className="grid gap-2 sm:grid-cols-2">
              {categories.map((category) => (
                <label key={category.category_id} className="flex min-h-10 items-center gap-2 text-sm">
                  <input type="checkbox" checked={categoryIds.includes(Number(category.category_id))} onChange={() => toggleCategory(Number(category.category_id))} className="size-4 accent-pink-500" />
                  {category.name}
                </label>
              ))}
            </div>
          )}
          {categoryIds.length === 0 && <p className="text-xs text-amber-200">Choose at least one active category.</p>}
        </fieldset>
      )}

      <label className="flex min-h-10 items-center gap-3 text-sm">
        <input type="checkbox" name="is_active" checked={values.is_active} onChange={(event) => setValues((current) => ({ ...current, is_active: event.target.checked }))} className="size-4 accent-pink-500" />
        Visible in store
      </label>

      {editing && detailsAvailable && hasPermission(PERMISSIONS.PRODUCT_UPDATE) && (
        <section className="space-y-3 border-t border-brand-border-subtle pt-5">
          <h4 className="font-semibold">Product images</h4>
          {images.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <article key={image.image_id} className="rounded-lg border border-brand-border-subtle p-3">
                  {getImageUrl(image.image_url) && <img src={getImageUrl(image.image_url)} alt="" loading="lazy" className="mb-3 aspect-video w-full rounded object-cover" />}
                  <p className="text-xs text-brand-text-muted">{image.is_primary ? 'Primary image' : 'Product image'}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {!image.is_primary && <Button type="button" variant="outline" onClick={() => runImageAction(() => setPrimaryProductImage(product.product_id, image.image_id))}>Make primary</Button>}
                    <Button type="button" variant="outline" onClick={() => runImageAction(() => deleteProductImage(product.product_id, image.image_id))}>Delete image</Button>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="product-images">Upload up to 5 images (JPEG, PNG, WebP; 2 MB each)</Label>
            <Input id="product-images" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectImageFiles} />
            {files.length > 0 && <p className="text-sm text-brand-text-muted">{files.length} image(s) selected for upload.</p>}
          </div>
        </section>
      )}

      {!editing && hasPermission(PERMISSIONS.PRODUCT_UPDATE) && (
        <div className="space-y-2">
          <Label htmlFor="new-product-images">Images (optional, up to 5)</Label>
          <Input id="new-product-images" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectImageFiles} />
        </div>
      )}

      {error && <p role="alert" className="rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-300">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving || (!editing && categoryIds.length === 0) || (editing && detailsAvailable && categoryIds.length === 0 && originalCategoryIds.length > 0)} className="min-h-11 bg-brand-accent-pink text-white hover:bg-brand-accent-magenta">
          {saving ? 'Saving…' : editing ? 'Save product' : 'Create product'}
        </Button>
      </div>
    </form>
  )
}

export function ProductsPage() {
  const { hasPermission } = useAuth()
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState(null)
  const [search, setSearch] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editor, setEditor] = useState(null)
  const [notice, setNotice] = useState('')

  async function loadProducts() {
    setLoading(true)
    setError('')
    try {
      const result = await listProducts({ page, limit: pageLimit, search: submittedSearch })
      setProducts(result.items)
      setPagination(result.pagination)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    listProducts({ page, limit: pageLimit, search: submittedSearch })
      .then((result) => {
        if (!active) return
        setProducts(result.items)
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

  async function toggleVisibility(product) {
    setError('')
    setNotice('')
    try {
      await updateProduct(product.product_id, { is_active: !product.is_active })
      setNotice(`Product is now ${product.is_active ? 'hidden' : 'visible'}.`)
      await loadProducts()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function handleSaved(message = 'Product saved.') {
    setEditor(null)
    setNotice(message)
    await loadProducts()
  }

  function productForEdit(product) {
    setEditor({ ...product, details: null, is_active: Boolean(product.is_active) })
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-accent-pink">Product Admin</p>
          <h2 className="mt-2 font-primary text-3xl font-bold">Products</h2>
          <p className="mt-2 text-sm text-brand-text-muted">Search all products, including hidden items.</p>
        </div>
        {hasPermission(PERMISSIONS.PRODUCT_CREATE) && (
          <Button onClick={() => setEditor(false)} className="min-h-11 bg-brand-accent-pink text-white hover:bg-brand-accent-magenta">Add product</Button>
        )}
      </header>

        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); setLoading(true); setPage(1); setSubmittedSearch(search.trim()) }}>
        <div className="flex-1 space-y-2">
          <Label htmlFor="product-search">Search products</Label>
          <Input id="product-search" value={search} maxLength={100} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <Button type="submit" variant="outline" className="min-h-11 self-end">Search</Button>
      </form>

      {error && <p role="alert" className="rounded-md border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-300">{error}</p>}
      {notice && <p role="status" className="rounded-md border border-green-500/40 bg-green-950/30 p-3 text-sm text-green-200">{notice}</p>}
      {editor !== null && (
        <ProductEditor
          key={editor ? editor.product_id : 'new'}
          product={editor || null}
          onClose={() => setEditor(null)}
          onSaved={handleSaved}
        />
      )}

      <div className="overflow-x-auto rounded-xl border border-brand-border-subtle">
        <table className="w-full min-w-[42rem] text-left text-sm">
          <thead className="bg-brand-black text-brand-text-muted"><tr><th className="p-3">Product</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Visibility</th><th className="p-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-brand-border-subtle">
            {loading ? <tr><td className="p-5 text-brand-text-muted" colSpan="5">Loading products…</td></tr> : products.length === 0 ? <tr><td className="p-5 text-brand-text-muted" colSpan="5">No products match this search.</td></tr> : products.map((product) => (
              <tr key={product.product_id} className="bg-brand-base">
                <td className="p-3"><span className="font-medium">{product.name}</span><span className="mt-1 block text-xs text-brand-text-muted">ID {product.product_id}</span></td>
                <td className="p-3">₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-3">{product.stock_quantity}</td>
                <td className="p-3">{product.is_active ? 'Visible' : 'Hidden'}</td>
                <td className="p-3"><div className="flex flex-wrap gap-2">
                  {hasPermission(PERMISSIONS.PRODUCT_UPDATE) && <Button variant="outline" onClick={() => productForEdit(product)}>Edit</Button>}
                  {hasPermission(PERMISSIONS.PRODUCT_UPDATE) && <Button variant="outline" onClick={() => toggleVisibility(product)}>{product.is_active ? 'Hide' : 'Show'}</Button>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <nav className="flex items-center justify-between gap-4" aria-label="Product pages">
          <p className="text-sm text-brand-text-muted">Page {pagination.page} of {Math.max(pagination.total_pages, 1)} · {pagination.total} products</p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1 || loading} onClick={() => { setLoading(true); setPage((current) => current - 1) }}>Previous</Button>
            <Button variant="outline" disabled={page >= pagination.total_pages || loading} onClick={() => { setLoading(true); setPage((current) => current + 1) }}>Next</Button>
          </div>
        </nav>
      )}
    </section>
  )
}
