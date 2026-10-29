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

export async function updateCartItem(productId, quantity) {
  return getData(
    await apiRequest(`/cart/items/${Number(productId)}`, {
      method: 'PATCH',
      body: { quantity: Number(quantity) },
    }),
    'cart item',
  )
}

export async function removeCartItem(productId) {
  return getData(
    await apiRequest(`/cart/items/${Number(productId)}`, { method: 'DELETE' }),
    'cart item',
  )
}

export async function getWishlist() {
  const data = getData(await apiRequest('/wishlist'), 'wishlist')
  const items = Array.isArray(data) ? data : data?.items
  if (!Array.isArray(items)) throw new Error('The server returned an invalid wishlist response.')
  return items
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

export async function listAddresses() {
  const data = getData(await apiRequest('/addresses'), 'addresses')
  if (!Array.isArray(data)) throw new Error('The server returned an invalid addresses response.')
  return data
}

export async function createAddress(values) {
  return getData(await apiRequest('/addresses', { method: 'POST', body: values }), 'address')
}

export async function updateAddress(addressId, values) {
  return getData(await apiRequest(`/addresses/${Number(addressId)}`, {
    method: 'PATCH',
    body: values,
  }), 'address')
}

export async function deleteAddress(addressId) {
  return getData(await apiRequest(`/addresses/${Number(addressId)}`, { method: 'DELETE' }), 'address')
}

export async function checkout(addressId) {
  return getData(await apiRequest('/orders/checkout', {
    method: 'POST',
    body: { address_id: Number(addressId) },
  }), 'checkout')
}

export async function verifyOrderPayment(orderId, payment) {
  return getData(await apiRequest(`/orders/${Number(orderId)}/verify-payment`, {
    method: 'POST',
    body: payment,
  }), 'payment verification')
}

export async function cancelOrder(orderId) {
  return getData(await apiRequest(`/orders/${Number(orderId)}/cancel`, { method: 'POST' }), 'order cancellation')
}

export async function listOrders({ page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  const data = getData(await apiRequest(`/orders?${params}`), 'orders')
  if (!data || !Array.isArray(data.items)) throw new Error('The server returned an invalid orders response.')
  return data
}

export async function getOrder(orderId) {
  return getData(await apiRequest(`/orders/${Number(orderId)}`), 'order')
}
