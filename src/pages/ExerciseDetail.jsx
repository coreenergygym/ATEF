import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Dumbbell } from 'lucide-react'
import { getExerciseById } from '../services/exerciseService.js'
import EmptyState from '../components/ui/EmptyState.jsx'

export default function ExerciseDetail() {
  const { id } = useParams()
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getExerciseById(id)
      .then(setExercise)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="mx-auto max-w-4xl px-5 py-20 text-muted">Loading…</div>
  }

  if (error || !exercise) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-20">
        <EmptyState icon={Dumbbell} title="Exercise not found" description="It may have been removed or renamed." />
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
      <Link to="/exercise-guide" className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft size={16} /> Back to Exercise Guide
      </Link>

      {exercise.image_url && (
        <img src={exercise.image_url} alt={exercise.name} className="mb-8 max-h-96 w-full rounded-2xl object-cover" />
      )}

      <h1 className="mb-2 font-display text-3xl text-ink">{exercise.name}</h1>
      <p className="mb-8 text-sm uppercase tracking-wide text-violet-soft">
        {exercise.target_muscle}
        {exercise.target_body_part ? ` · ${exercise.target_body_part}` : ''}
      </p>

      {exercise.description && <p className="mb-8 text-muted">{exercise.description}</p>}

      {exercise.video_url && (
        <div className="mb-10">
          <h2 className="mb-3 text-lg text-ink">Correct form</h2>
          <video src={exercise.video_url} controls className="w-full rounded-2xl" />
        </div>
      )}

      {exercise.instructions && (
        <div className="mb-10">
          <h2 className="mb-3 text-lg text-ink">Step-by-step instructions</h2>
          <p className="whitespace-pre-line text-muted">{exercise.instructions}</p>
        </div>
      )}

      {exercise.common_mistakes && (
        <div className="mb-10">
          <h2 className="mb-3 text-lg text-ink">Common mistakes</h2>
          <p className="whitespace-pre-line text-muted">{exercise.common_mistakes}</p>
        </div>
      )}

      {exercise.tips && (
        <div>
          <h2 className="mb-3 text-lg text-ink">Tips</h2>
          <p className="whitespace-pre-line text-muted">{exercise.tips}</p>
        </div>
      )}
    </section>
  )
}
