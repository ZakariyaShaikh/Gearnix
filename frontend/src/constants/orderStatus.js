export const ORDER_STATUS = Object.freeze({
  pending_payment: { label: 'Payment pending', tone: 'neutral' },
  paid: { label: 'Paid', tone: 'success' },
  failed: { label: 'Payment failed', tone: 'danger' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
  refund_pending: { label: 'Refund pending', tone: 'warning' },
  refunded: { label: 'Refunded', tone: 'violet' },
  refund_failed: { label: 'Refund failed', tone: 'danger' },
})

export function orderStatusLabel(status) {
  return ORDER_STATUS[status]?.label || String(status || '').replaceAll('_', ' ')
}

export function orderStatusTone(status) {
  return ORDER_STATUS[status]?.tone || 'neutral'
}
