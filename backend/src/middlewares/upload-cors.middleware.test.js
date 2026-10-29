import assert from 'node:assert/strict'
import test from 'node:test'
import { allowCrossOriginUploads } from './upload-cors.middleware.js'

test('profile images allow cross-origin display in the storefront', () => {
  const headers = new Map()
  const response = { setHeader: (name, value) => headers.set(name, value) }
  let nextCalled = false

  allowCrossOriginUploads({ path: '/profile-images/avatar.webp' }, response, () => { nextCalled = true })

  assert.equal(headers.get('Cross-Origin-Resource-Policy'), 'cross-origin')
  assert.equal(nextCalled, true)
})

test('blog and product image CORS behavior remains enabled', () => {
  for (const path of ['/blog-images/cover.png', '/product-images/mouse.png']) {
    const headers = new Map()
    allowCrossOriginUploads({ path }, { setHeader: (name, value) => headers.set(name, value) }, () => {})
    assert.equal(headers.get('Cross-Origin-Resource-Policy'), 'cross-origin')
  }
})
