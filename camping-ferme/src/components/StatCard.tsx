import type { ReactNode } from 'react'

export default function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string
  value: ReactNode
  hint?: string
  icon?: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-forest-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-forest-600">{label}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-semibold text-forest-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-forest-500">{hint}</p>}
    </div>
  )
}
