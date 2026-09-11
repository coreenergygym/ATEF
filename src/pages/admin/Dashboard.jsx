import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layers, Image as ImageIcon, Salad, Dumbbell, Inbox, AlertCircle } from 'lucide-react'
import { getDashboardStats } from '../../services/settingsService.js'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'New Enquiries', value: stats?.newEnquiries, icon: AlertCircle, to: '/admin/enquiries' },
    { label: 'Total Enquiries', value: stats?.totalEnquiries, icon: Inbox, to: '/admin/enquiries' },
    { label: 'Active Plans', value: stats?.activePlans, icon: Layers, to: '/admin/membership' },
    { label: 'Gallery Items', value: stats?.galleryItems, icon: ImageIcon, to: '/admin/gallery' },
    { label: 'Diet Plans', value: stats?.dietPlans, icon: Salad, to: '/admin/diet-plans' },
    { label: 'Exercises', value: stats?.exercises, icon: Dumbbell, to: '/admin/exercises' }
  ]

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink">Dashboard</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="rounded-2xl border border-white/5 bg-surface/60 p-6 transition hover:border-violet/40"
          >
            <Icon className="mb-4 text-violet-soft" size={22} />
            <p className="text-2xl font-medium text-ink">
              {loading ? '—' : value ?? 0}
            </p>
            <p className="mt-1 text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg text-ink">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/membership" className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-ink hover:border-violet/40">
            Manage Membership Plans
          </Link>
          <Link to="/admin/gallery" className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-ink hover:border-violet/40">
            Upload Gallery Media
          </Link>
          <Link to="/admin/gym-timings" className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-ink hover:border-violet/40">
            Update Gym Timings
          </Link>
        </div>
      </div>
    </div>
  )
}
