import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

export function RefundDialog({
  open,
  amount,
  reason = '',
  onReasonChange,
  onSubmit,
  onCancel,
  busy = false,
  error = '',
  title = 'Request a refund',
  customerName,
  orderNumber,
}) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (open && dialogRef.current) dialogRef.current.focus()
  }, [open])

  if (!open) return null

  function handleReasonChange(value) {
    onReasonChange?.(value.slice(0, 255))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="refund-dialog-title">
      <div ref={dialogRef} tabIndex={-1} className="w-full max-w-md rounded-xl border border-brand-border-subtle bg-brand-black p-6 text-brand-text-primary outline-none">
        <h2 id="refund-dialog-title" className="font-primary text-xl font-bold">{title}</h2>
        {customerName && orderNumber && (
          <p className="mt-2 text-sm text-brand-text-muted">
            {customerName} · {orderNumber}
          </p>
        )}
        <p className="mt-4 text-sm text-brand-text-muted">
          Refund amount: <span className="font-semibold text-brand-text-primary">{amount}</span>
        </p>
        <div className="mt-4 space-y-2">
          <label htmlFor="refund-reason" className="text-sm font-medium">Reason (optional)</label>
          <textarea
            id="refund-reason"
            value={reason}
            onChange={(e) => handleReasonChange(e.target.value)}
            maxLength={255}
            rows={3}
            className="w-full rounded-md border border-brand-border-subtle bg-brand-base px-3 py-2 text-sm text-brand-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-pink"
          />
          <p className="text-xs text-brand-text-muted">{reason.length}/255</p>
        </div>
        {error && <p role="alert" className="mt-3 rounded-md border border-red-500/40 bg-red-950/30 p-2 text-sm text-red-200">{error}</p>}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={busy} className="min-h-11 border-white/20 text-white">
            Keep order
          </Button>
          <Button type="button" variant="destructive" onClick={() => onSubmit(reason || null)} disabled={busy} className="min-h-11">
            {busy ? 'Requesting…' : 'Request refund'}
          </Button>
        </div>
      </div>
    </div>
  )
}
