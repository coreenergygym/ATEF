import React from 'react'
import { useGymSettings } from '../hooks/useGymSettings.jsx'

export default function About() {
  const { settings, loading } = useGymSettings()

  return (
    <section className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
      <p className="mb-3 text-sm uppercase tracking-widest text-violet-soft">About Us</p>
      <h1 className="mb-8 font-display text-4xl text-ink">{settings?.gym_name || 'ATEF — All Time Elite Fitness'}</h1>

      {loading ? (
        <div className="h-32 animate-pulse rounded-2xl bg-surface/60" />
      ) : (
        <div className="space-y-6 text-muted">
          <p className="text-lg text-ink">
            {settings?.about_short || 'A premium performance fitness club built for focused training.'}
          </p>
          <p className="whitespace-pre-line">
            {settings?.about_long ||
              'More about ATEF will be added here soon by the gym team. In the meantime, come experience the space in person or reach out through the Contact page.'}
          </p>
        </div>
      )}
    </section>
  )
}
