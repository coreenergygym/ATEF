import React from 'react'

export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-2xl border border-white/5 bg-surface/40">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet/10 text-violet-soft">
          <Icon size={22} />
        </div>
      )}
      <p className="text-lg font-medium text-ink">{title}</p>
      {description && <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>}
    </div>
  )
}
