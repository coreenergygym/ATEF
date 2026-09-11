import React, { useEffect, useState } from 'react'
import { Salad } from 'lucide-react'
import { getActiveDietPlans } from '../services/dietService.js'
import { GridSkeleton } from '../components/ui/Skeleton.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

export default function DietPlans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    getActiveDietPlans()
      .then(setPlans)
      .catch(() => setPlans([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <p className="mb-3 text-sm uppercase tracking-widest text-violet-soft">Diet Plans</p>
      <h1 className="mb-4 font-display text-4xl text-ink">Fuel your training</h1>
      <p className="mb-12 max-w-2xl text-sm text-muted">
        General nutrition guidance from our team. This is not medical advice — consult a qualified
        professional for individual dietary or health needs.
      </p>

      {loading && <GridSkeleton count={4} />}

      {!loading && plans.length === 0 && (
        <EmptyState icon={Salad} title="Diet plans coming soon" description="Check back for nutrition guidance from ATEF." />
      )}

      {!loading && plans.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {plans.map((plan) => {
            const isOpen = expanded === plan.id
            return (
              <div key={plan.id} className="overflow-hidden rounded-2xl border border-white/5 bg-surface/50">
                {plan.image_url && (
                  <img src={plan.image_url} alt={plan.title} className="h-48 w-full object-cover" loading="lazy" />
                )}
                <div className="p-6">
                  {plan.category && (
                    <span className="mb-2 inline-block rounded-full bg-violet/10 px-3 py-1 text-xs text-violet-soft">
                      {plan.category}
                    </span>
                  )}
                  <h3 className="mb-2 text-lg text-ink">{plan.title}</h3>
                  <p className="text-sm text-muted">{plan.short_description}</p>

                  {plan.detailed_content && (
                    <>
                      {isOpen && <p className="mt-4 whitespace-pre-line text-sm text-muted">{plan.detailed_content}</p>}
                      <button
                        onClick={() => setExpanded(isOpen ? null : plan.id)}
                        className="mt-4 text-sm font-medium text-violet-soft hover:text-violet"
                      >
                        {isOpen ? 'Show less' : 'Read more'}
                      </button>
                    </>
                  )}

                  {plan.file_url && (
                    <a
                      href={plan.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 block text-sm font-medium text-cyan hover:text-cyan-soft"
                    >
                      View document
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
