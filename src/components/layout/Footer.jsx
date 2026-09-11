import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, MapPin, Phone, Mail } from 'lucide-react'
import { useGymSettings } from '../../hooks/useGymSettings.jsx'
import { WHATSAPP_DISPLAY, buildGeneralWhatsAppLink } from '../../lib/whatsapp.js'

export default function Footer() {
  const { settings } = useGymSettings()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 bg-charcoal">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="font-display text-lg text-ink">{settings?.gym_name || 'ATEF — All Time Elite Fitness'}</h3>
          {settings?.tagline && <p className="mt-3 text-sm text-muted">{settings.tagline}</p>}
        </div>

        <div>
          <h4 className="mb-4 text-sm font-medium text-ink">Explore</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link to="/membership" className="hover:text-ink">Membership</Link></li>
            <li><Link to="/gallery" className="hover:text-ink">Gallery</Link></li>
            <li><Link to="/diet-plans" className="hover:text-ink">Diet Plans</Link></li>
            <li><Link to="/exercise-guide" className="hover:text-ink">Exercise Guide</Link></li>
            <li className="pt-2"><Link to="/admin/login" className="inline-flex items-center rounded-full border border-white/10 px-3 py-2 text-sm text-muted transition hover:border-violet/40 hover:text-ink">Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-medium text-ink">Contact</h4>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 shrink-0 text-violet-soft" />
              <a href={`tel:${settings?.phone || '+918504037039'}`} className="hover:text-ink">
                {settings?.phone || '+91 85040 37039'}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 shrink-0 text-violet-soft" />
              <a href={buildGeneralWhatsAppLink()} target="_blank" rel="noreferrer" className="hover:text-ink">
                WhatsApp: {WHATSAPP_DISPLAY}
              </a>
            </li>
            {settings?.email && (
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 shrink-0 text-violet-soft" />
                <a href={`mailto:${settings.email}`} className="hover:text-ink">{settings.email}</a>
              </li>
            )}
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-violet-soft" />
              <span>{settings?.address || '3rd Floor, Pentagon Tower, Plot No. 9, Lajpat Nagar, Alwar, Rajasthan — 301001'}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-medium text-ink">Follow</h4>
          <a
            href={settings?.instagram_url || 'https://www.instagram.com/atefclub/'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-muted transition hover:border-violet/40 hover:text-ink"
          >
            <Instagram size={16} /> Instagram
          </a>
        </div>
      </div>

      <div className="border-t border-white/5 px-5 py-6 text-center text-xs text-muted lg:px-8">
        © {year} {settings?.gym_name || 'ATEF — All Time Elite Fitness'}. All rights reserved.
      </div>
    </footer>
  )
}
