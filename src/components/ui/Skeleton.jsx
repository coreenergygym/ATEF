import React from 'react'

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-surface/60 p-5 animate-pulse">
      <div className="mb-4 h-40 rounded-xl bg-white/5" />
      <div className="mb-2 h-4 w-2/3 rounded bg-white/5" />
      <div className="h-3 w-1/2 rounded bg-white/5" />
    </div>
  )
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
