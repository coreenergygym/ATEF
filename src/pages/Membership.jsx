import React, { useEffect, useState } from 'react'
import { Check, Layers } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getActivePlans } from '../services/membershipService.js'
import { GridSkeleton } from '../components/ui/Skeleton.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

export default function Membership() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getActivePlans()
      .then(setPlans)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <p className="mb-3 text-sm uppercase tracking-widest text-violet-soft">Membership</p>
      <h1 className="mb-12 font-display text-4xl text-ink">Choose your plan</h1>

      {loading && <GridSkeleton count={3} />}

      {!loading && error && (
        <EmptyState
          icon={Layers}
          title="Couldn't load membership plans"
          description="Please refresh the page or check back shortly."
        />
      )}

      {!loading && !error && plans.length === 0 && (
        <EmptyState
          icon={Layers}
          title="Membership plans coming soon"
          description="We're finalising our plans. Reach out to us directly for current pricing."
        />
      )}

      {!loading && !error && plans.length > 0 && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col rounded-2xl border border-white/5 bg-surface/60 p-8 transition hover:border-violet/40"
            >
              <h3 className="font-display text-2xl text-ink">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted">{plan.duration}</p>
              <p className="mt-6 text-3xl font-medium text-ink">
                ₹{plan.price}
                {plan.duration && <span className="text-sm font-normal text-muted"> / {plan.duration}</span>}
              </p>
              {plan.description && <p className="mt-4 text-sm text-muted">{plan.description}</p>}

              {Array.isArray(plan.features) && plan.features.length > 0 && (
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted">
                      <Check size={16} className="mt-0.5 shrink-0 text-violet-soft" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              <Link
                to="/contact"
                className="mt-8 rounded-full bg-violet px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-violet-soft"
              >
                Enquire Now
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
