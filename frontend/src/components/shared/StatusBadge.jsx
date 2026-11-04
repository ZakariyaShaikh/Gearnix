import { orderStatusLabel, orderStatusTone } from '@/constants/orderStatus'

const toneClasses = {
  neutral: 'bg-white/10 text-white/70',
  success: 'bg-emerald-900/50 text-emerald-200',
  danger: 'bg-red-900/50 text-red-200',
  warning: 'bg-amber-900/50 text-amber-200',
  violet: 'bg-violet-900/50 text-violet-200',
}

export function StatusBadge({ status, label }) {
  const tone = orderStatusTone(status)
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${toneClasses[tone] || toneClasses.neutral}`}>
      {label || orderStatusLabel(status)}
    </span>
  )
}
