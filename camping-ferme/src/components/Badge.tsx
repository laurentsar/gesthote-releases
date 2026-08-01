import type { ReactNode } from 'react'

type Tone = 'green' | 'orange' | 'gray' | 'red' | 'blue'

const toneClasses: Record<Tone, string> = {
  green: 'bg-forest-100 text-forest-800',
  orange: 'bg-sunflower-100 text-sunflower-800',
  gray: 'bg-gray-100 text-gray-600',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-sky-100 text-sky-700',
}

export default function Badge({
  children,
  tone = 'gray',
}: {
  children: ReactNode
  tone?: Tone
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  )
}
