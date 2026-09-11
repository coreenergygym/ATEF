import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, LockKeyhole } from 'lucide-react'
import { useGymSettings } from '../../hooks/useGymSettings.jsx'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/membership', label: 'Membership' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/diet-plans', label: 'Diet Plans' },
  { to: '/exercise-guide', label: 'Exercise Guide' },
  { to: '/contact', label: 'Contact' }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { settings } = useGymSettings()
  const gymName = settings?.gym_name || 'ATEF'

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-obsidian/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt={`${gymName} logo`} className="h-9 w-auto" />
          ) : (
            <span className="font-display text-xl font-semibold tracking-tight text-ink">{gymName}</span>
          )}
        </NavLink>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`
              }
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <NavLink
            to="/admin/login"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm font-medium text-muted transition hover:border-violet/40 hover:text-ink"
          >
            <LockKeyhole size={15} /> Admin Login
          </NavLink>
          <NavLink
            to="/contact"
            className="rounded-full bg-violet px-5 py-2.5 text-sm font-medium text-white shadow-glow transition hover:bg-violet-soft"
          >
            Join Now
          </NavLink>
        </div>

        <button
          className="text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/5 bg-obsidian px-5 pb-6 pt-2 lg:hidden">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-3 text-base ${
                      isActive ? 'bg-white/5 text-ink' : 'text-muted'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <NavLink
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-muted transition hover:border-violet/40 hover:text-ink"
            >
              <LockKeyhole size={15} /> Admin Login
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className="rounded-full bg-violet px-4 py-3 text-center text-sm font-medium text-white"
            >
              Join Now
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  )
}
