import { apiRequest } from '@/api/client'

function getData(response, action) {
  if (!response || !Object.hasOwn(response, 'data')) {
    throw new Error(`The server returned an invalid ${action} response.`)
  }
  return response.data
}

export async function getCart() {
  return getData(await apiRequest('/cart'), 'cart')
}

export async function addCartItem(productId, quantity = 1) {
  return getData(
    await apiRequest('/cart/items', {
      method: 'POST',
      body: { product_id: Number(productId), quantity },
    }),
    'cart item',
  )
}

export async function getWishlist() {
  const data = getData(await apiRequest('/wishlist'), 'wishlist')
  if (!Array.isArray(data)) throw new Error('The server returned an invalid wishlist response.')
  return data
}

export async function addWishlistItem(productId) {
  return getData(
    await apiRequest('/wishlist/items', {
      method: 'POST',
      body: { product_id: Number(productId) },
    }),
    'wishlist item',
  )
}

export async function removeWishlistItem(productId) {
  return getData(
    await apiRequest(`/wishlist/items/${productId}`, { method: 'DELETE' }),
    'wishlist item',
  )
}
