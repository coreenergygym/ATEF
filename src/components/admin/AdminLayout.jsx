import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Layers, Image as ImageIcon, Salad, Dumbbell, Inbox,
  Building2, Clock, Settings as SettingsIcon, LogOut, Menu, X
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.jsx'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/membership', label: 'Membership Plans', icon: Layers },
  { to: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { to: '/admin/diet-plans', label: 'Diet Plans', icon: Salad },
  { to: '/admin/exercises', label: 'Exercise & Machines', icon: Dumbbell },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  { to: '/admin/gym-info', label: 'Gym Information', icon: Building2 },
  { to: '/admin/gym-timings', label: 'Gym Timings', icon: Clock },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon }
]

export default function AdminLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await signOut()
    navigate('/admin/login')
  }

  const SidebarContent = (
    <>
      <div className="mb-8 px-2">
        <p className="font-display text-lg text-ink">ATEF Admin</p>
      </div>
      <nav className="flex-1 space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive ? 'bg-violet/15 text-ink' : 'text-muted hover:bg-white/5 hover:text-ink'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-white/5 hover:text-ink"
      >
        <LogOut size={17} /> Logout
      </button>
    </>
  )

  return (
    <div className="min-h-screen bg-obsidian lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-charcoal p-5 lg:flex">
        {SidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-white/5 bg-charcoal px-5 py-4 lg:hidden">
        <p className="font-display text-lg text-ink">ATEF Admin</p>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="text-ink">
          <Menu size={24} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex bg-black/70 lg:hidden">
          <aside className="flex w-72 flex-col bg-charcoal p-5">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="mb-6 self-end text-ink">
              <X size={22} />
            </button>
            {SidebarContent}
          </aside>
          <div className="flex-1" onClick={() => setOpen(false)} />
        </div>
      )}

      <main className="flex-1 px-5 py-8 lg:px-10 lg:py-10">
        <Outlet />
      </main>
    </div>
  )
}
