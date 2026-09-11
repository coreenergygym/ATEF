import React, { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'

export default function AdminLogin() {
  const { signIn, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await signIn(email, password)
      navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true })
    } catch (err) {
      setError('Invalid email or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-white/5 bg-surface/60 p-8">
        <h1 className="mb-1 font-display text-2xl text-ink">ATEF Admin</h1>
        <p className="mb-8 text-sm text-muted">Sign in to manage the website.</p>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-sm text-muted">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-obsidian/60 px-4 py-2.5 text-sm text-ink focus:border-violet/60"
            autoComplete="email"
          />
        </label>

        <label className="mb-6 block">
          <span className="mb-1.5 block text-sm text-muted">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-obsidian/60 px-4 py-2.5 text-sm text-ink focus:border-violet/60"
            autoComplete="current-password"
          />
        </label>

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-violet px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-soft disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
