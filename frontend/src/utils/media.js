const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')

export function getMediaUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  if (!apiBaseUrl) return ''
  return new URL(`/${path.replace(/^\/+/, '')}`, apiBaseUrl).href
}

export function formatMoney(amount) {
  const value = Number(amount)
  if (!Number.isFinite(value)) return '₹0.00'
  return `₹${value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatDate(date) {
  if (!date) return ''
  const value = new Date(date)
  if (Number.isNaN(value.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(value)
}

export function formatDateTime(date) {
  if (!date) return ''
  const value = new Date(date)
  if (Number.isNaN(value.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(value)
}
