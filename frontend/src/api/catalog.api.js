import { apiRequest } from '@/api/client'

function getData(response, action) {
  if (!response || !Object.hasOwn(response, 'data')) {
    throw new Error(`The server returned an invalid ${action} response.`)
  }
  return response.data
}

export async function listCategories({ includeHidden = true } = {}) {
  const response = await apiRequest(
    includeHidden ? '/categories/admin' : '/categories',
  )
  const data = getData(response, 'categories')
  if (!Array.isArray(data)) throw new Error('The server returned an invalid categories response.')
  return data
}

export async function createCategory(values) {
  return getData(
    await apiRequest('/categories', { method: 'POST', body: values }),
    'category',
  )
}

export async function updateCategory(categoryId, values) {
  return getData(
    await apiRequest(`/categories/${categoryId}`, {
      method: 'PATCH',
      body: values,
    }),
    'category',
  )
}

export async function listProducts({ page = 1, limit = 12, search = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (search.trim()) params.set('search', search.trim())
  const response = await apiRequest(`/products/admin?${params}`)
  const data = getData(response, 'products')
  if (!data || !Array.isArray(data.items)) {
    throw new Error('The server returned an invalid products response.')
  }
  return data
}

export async function listPublicProducts({
  page = 1,
  limit = 12,
  search = '',
  category = '',
} = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (search.trim()) params.set('search', search.trim())
  if (category) params.set('category', category)
  const response = await apiRequest(`/products?${params}`)
  const data = getData(response, 'products')
  if (!data || !Array.isArray(data.items) || !data.pagination) {
    throw new Error('The server returned an invalid products response.')
  }
  return data
}

export async function getPublicProduct(productId) {
  return getData(await apiRequest(`/products/${productId}`), 'product')
}

export async function getPublicProductBySlug(slug) {
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const result = await listPublicProducts({ page, limit: 50 })
    totalPages = result.pagination.total_pages
    const match = result.items.find((product) => product.slug === slug)
    if (match) return getPublicProduct(match.product_id)
    page += 1
  }

  const error = new Error('Product not found.')
  error.status = 404
  throw error
}

export async function getProduct(productId) {
  return getData(await apiRequest(`/products/${productId}`), 'product')
}

export async function createProduct(values) {
  return getData(
    await apiRequest('/products', { method: 'POST', body: values }),
    'product',
  )
}

export async function updateProduct(productId, values) {
  return getData(
    await apiRequest(`/products/${productId}`, {
      method: 'PATCH',
      body: values,
    }),
    'product',
  )
}

export async function uploadProductImages(productId, files) {
  const body = new FormData()
  files.forEach((file) => body.append('images', file))
  return getData(
    await apiRequest(`/products/${productId}/images`, {
      method: 'POST',
      body,
    }),
    'product images',
  )
}

export async function deleteProductImage(productId, imageId) {
  return getData(
    await apiRequest(`/products/${productId}/images/${imageId}`, {
      method: 'DELETE',
    }),
    'product image',
  )
}

export async function setPrimaryProductImage(productId, imageId) {
  return getData(
    await apiRequest(`/products/${productId}/images/${imageId}/primary`, {
      method: 'PATCH',
    }),
    'product images',
  )
}
export async function deleteProduct(productId) {
  return getData(await apiRequest(`/products/${Number(productId)}`, { method: 'DELETE' }), 'product')
}
