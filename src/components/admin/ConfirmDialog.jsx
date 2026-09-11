import React from 'react'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Delete', onConfirm, onCancel, loading }) {
  if (!open) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-charcoal p-6 shadow-card">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <AlertTriangle size={18} />
          </div>
          <h2 id="confirm-dialog-title" className="text-lg font-medium text-ink">
            {title}
          </h2>
        </div>
        {description && <p className="mb-6 text-sm text-muted">{description}</p>}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm text-muted transition hover:text-ink"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-500/90 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            {loading ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
