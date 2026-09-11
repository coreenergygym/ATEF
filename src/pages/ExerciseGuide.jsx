import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Dumbbell } from 'lucide-react'
import { getActiveExercises } from '../services/exerciseService.js'
import { GridSkeleton } from '../components/ui/Skeleton.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

export default function ExerciseGuide() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [bodyPart, setBodyPart] = useState('All')

  useEffect(() => {
    getActiveExercises()
      .then(setExercises)
      .catch(() => setExercises([]))
      .finally(() => setLoading(false))
  }, [])

  const bodyParts = useMemo(
    () => ['All', ...new Set(exercises.map((e) => e.target_body_part).filter(Boolean))],
    [exercises]
  )

  const filtered = exercises.filter((e) => {
    const matchesQuery = `${e.name} ${e.target_muscle}`.toLowerCase().includes(query.toLowerCase())
    const matchesPart = bodyPart === 'All' || e.target_body_part === bodyPart
    return matchesQuery && matchesPart
  })

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <p className="mb-3 text-sm uppercase tracking-widest text-violet-soft">Exercise Guide</p>
      <h1 className="mb-8 font-display text-4xl text-ink">Machines &amp; exercises, done right</h1>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exercises…"
            className="w-full rounded-full border border-white/10 bg-surface/60 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-violet/50"
          />
        </div>
        {bodyParts.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {bodyParts.map((part) => (
              <button
                key={part}
                onClick={() => setBodyPart(part)}
                className={`rounded-full border px-4 py-2 text-xs transition ${
                  bodyPart === part
                    ? 'border-violet bg-violet/20 text-ink'
                    : 'border-white/10 text-muted hover:text-ink'
                }`}
              >
                {part}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && <GridSkeleton count={6} />}

      {!loading && filtered.length === 0 && (
        <EmptyState
          icon={Dumbbell}
          title="No exercises found"
          description="Try a different search term or filter."
        />
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ex) => (
            <Link
              key={ex.id}
              to={`/exercise-guide/${ex.id}`}
              className="group overflow-hidden rounded-2xl border border-white/5 bg-surface/50 transition hover:border-violet/40"
            >
              {ex.image_url ? (
                <img src={ex.image_url} alt={ex.name} className="h-48 w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-48 items-center justify-center bg-surface2 text-muted">
                  <Dumbbell size={28} />
                </div>
              )}
              <div className="p-5">
                <h3 className="mb-1 text-lg text-ink">{ex.name}</h3>
                <p className="text-sm text-muted">
                  {ex.target_muscle}
                  {ex.target_body_part ? ` · ${ex.target_body_part}` : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
