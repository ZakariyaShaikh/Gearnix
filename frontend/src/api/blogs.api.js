import { apiRequest } from '@/api/client'

function getData(response, action) {
  if (!response || !Object.hasOwn(response, 'data')) {
    throw new Error(`The server returned an invalid ${action} response.`)
  }
  return response.data
}

export async function listBlogs({ page = 1, limit = 12, search = '', includeDrafts = false } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (search.trim()) params.set('search', search.trim())
  const path = includeDrafts ? '/blogs/admin' : '/blogs'
  const data = getData(await apiRequest(`${path}?${params}`), 'blogs')
  if (!data || !Array.isArray(data.items) || !data.pagination) {
    throw new Error('The server returned an invalid blogs response.')
  }
  return data
}

export async function getPublicBlog(slug) {
  return getData(await apiRequest(`/blogs/${encodeURIComponent(slug)}`), 'blog')
}

export async function getAdminBlog(blogId) {
  return getData(await apiRequest(`/blogs/admin/${blogId}`), 'blog')
}

export async function createBlog(values) {
  return getData(await apiRequest('/blogs', { method: 'POST', body: values }), 'blog')
}

export async function updateBlog(blogId, values) {
  return getData(await apiRequest(`/blogs/${blogId}`, { method: 'PATCH', body: values }), 'blog')
}

export async function uploadBlogCover(blogId, file) {
  const body = new FormData()
  body.append('cover', file)
  return getData(
    await apiRequest(`/blogs/${blogId}/cover`, { method: 'POST', body }),
    'blog cover',
  )
}

export async function removeBlogCover(blogId) {
  return getData(
    await apiRequest(`/blogs/${blogId}/cover`, { method: 'DELETE' }),
    'blog cover',
  )
}
