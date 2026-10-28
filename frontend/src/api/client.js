let accessToken = null
let refreshPromise = null

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
const refreshExcludedPaths = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
  '/auth/logout-all',
])

export class ApiError extends Error {
  constructor(message, { status, data, cause } = {}) {
    super(message, { cause })
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export function setAccessToken(token) {
  accessToken = token || null
}

export function getAccessToken() {
  return accessToken
}

function getApiUrl(path) {
  if (!apiBaseUrl) {
    throw new Error('VITE_API_URL is not configured.')
  }

  return `${apiBaseUrl}/${path.replace(/^\/+/, '')}`
}

async function readResponse(response) {
  if (response.status === 204) {
    return null
  }

  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function makeError(response, data) {
  const message =
    data && typeof data === 'object' && typeof data.message === 'string'
      ? data.message
      : response.statusText || 'The request failed.'

  return new ApiError(message, { status: response.status, data })
}

async function refreshAccessToken() {
  const response = await fetch(getApiUrl('/auth/refresh'), {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  const data = await readResponse(response)
  const token = data?.data?.access_token

  if (!response.ok) {
    setAccessToken(null)
    if (response.status === 401) {
      return false
    }
    throw makeError(response, data)
  }

  if (typeof token !== 'string' || token.length === 0) {
    setAccessToken(null)
    throw new ApiError('The server did not return an access token.', {
      status: response.status,
      data,
    })
  }

  setAccessToken(token)
  return true
}

function getRefreshPromise() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

function shouldRefresh(path) {
  return !refreshExcludedPaths.has(`/${path.replace(/^\/+/, '')}`)
}

function createRequestOptions(options) {
  const { body, headers: requestHeaders, ...rest } = options
  const headers = new Headers(requestHeaders)

  headers.set('Accept', 'application/json')
  headers.delete('Authorization')
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  let requestBody = body
  if (
    body !== undefined &&
    typeof body !== 'string' &&
    !(typeof FormData !== 'undefined' && body instanceof FormData)
  ) {
    headers.set('Content-Type', 'application/json')
    requestBody = JSON.stringify(body)
  }

  return {
    ...rest,
    body: requestBody,
    credentials: 'include',
    headers,
  }
}

export async function apiRequest(path, options = {}) {
  const requestOptions = createRequestOptions(options)
  let response = await fetch(getApiUrl(path), requestOptions)
  let data = await readResponse(response)

  if (response.status === 401 && shouldRefresh(path)) {
    const refreshed = await getRefreshPromise()
    if (refreshed) {
      response = await fetch(getApiUrl(path), createRequestOptions(options))
      data = await readResponse(response)
    }
  }

  if (!response.ok) {
    throw makeError(response, data)
  }

  return data
}
