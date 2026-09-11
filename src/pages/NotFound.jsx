import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <h1 className="mb-4 font-display text-5xl text-ink">404</h1>
      <p className="mb-8 text-muted">This page doesn't exist.</p>
      <Link to="/" className="rounded-full bg-violet px-6 py-3 text-sm font-medium text-white hover:bg-violet-soft">
        Back home
      </Link>
    </div>
  )
}
