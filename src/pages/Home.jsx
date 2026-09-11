import React from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell, HeartPulse, Salad, Users, ArrowRight } from 'lucide-react'
import { useGymSettings } from '../hooks/useGymSettings.jsx'

export default function Home() {
  const { settings } = useGymSettings()
  const gymName = settings?.gym_name || 'ATEF'
  const tagline =
    settings?.tagline || 'A focused space for strength, fitness, and performance training.'

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5 bg-obsidian bg-radial-fade">
        <div className="mx-auto flex max-w-7xl flex-col items-start px-5 py-24 lg:px-8 lg:py-36">
          {settings?.logo_url && (
            <img src={settings.logo_url} alt={`${gymName} logo`} className="mb-8 h-14 w-auto" />
          )}
          <p className="mb-4 text-sm uppercase tracking-widest text-violet-soft">All Time Elite Fitness</p>
          <h1 className="max-w-3xl text-balance font-display text-4xl font-medium leading-tight text-ink sm:text-5xl lg:text-6xl">
            Train with purpose. Build your performance.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">{tagline}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="rounded-full bg-violet px-7 py-3.5 font-medium text-white shadow-glow transition hover:bg-violet-soft"
            >
              Join Now
            </Link>
            <Link
              to="/gallery"
              className="rounded-full border border-white/15 px-7 py-3.5 font-medium text-ink transition hover:border-violet/50"
            >
              Explore Gym
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm uppercase tracking-widest text-violet-soft">About {gymName}</p>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              {settings?.about_short ||
                'A focused training environment for strength, fitness, and performance.'}
            </h2>
          </div>
          <p className="text-muted">
            {settings?.about_long ||
              'Explore our training services, membership options, exercise guidance, and other resources.'}
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-y border-white/5 bg-charcoal">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {[
            { icon: Dumbbell, label: 'Strength & Conditioning' },
            { icon: HeartPulse, label: 'HIIT & Cardio' },
            { icon: Salad, label: 'Nutrition Guidance' },
            { icon: Users, label: 'Group & Personal Training' }
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="rounded-2xl border border-white/5 bg-surface/60 p-6">
              <Icon className="mb-4 text-violet-soft" size={24} />
              <p className="text-ink">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services preview */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-3xl text-ink">What we offer</h2>
          <Link to="/services" className="flex items-center gap-1 text-sm text-violet-soft hover:text-violet">
            All services <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {['CrossFit', 'Personal Training', 'Yoga', 'Zumba', 'Kickboxing', 'Cycling'].map((s) => (
            <div
              key={s}
              className="rounded-xl border border-white/5 bg-surface/50 px-4 py-6 text-center text-sm text-muted transition hover:border-violet/40 hover:text-ink"
            >
              {s}
            </div>
          ))}
        </div>
      </section>

      {/* Join CTA */}
      <section className="border-t border-white/5 bg-aurora">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center lg:px-8">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Ready to train with us?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Tell us your goals and we'll help you find the right plan.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block rounded-full bg-violet px-8 py-4 font-medium text-white shadow-glow transition hover:bg-violet-soft"
          >
            Join Now
          </Link>
        </div>
      </section>
    </div>
  )
}
