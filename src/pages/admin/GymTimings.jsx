import React, { useEffect, useState } from 'react'
import { getGymTimings, upsertGymTiming } from '../../services/settingsService.js'
import { DAY_ORDER } from '../../hooks/useGymSettings.jsx'

export default function AdminGymTimings() {
  const [timings, setTimings] = useState({})
  const [loading, setLoading] = useState(true)
  const [savingDay, setSavingDay] = useState(null)

  useEffect(() => {
    getGymTimings()
      .then((rows) => {
        const map = {}
        DAY_ORDER.forEach((day) => {
          const existing = rows.find((r) => r.day === day)
          map[day] = existing || { day, open_time: '06:00', close_time: '22:00', is_open: true }
        })
        setTimings(map)
      })
      .finally(() => setLoading(false))
  }, [])

  function updateDay(day, patch) {
    setTimings((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }))
  }

  async function saveDay(day) {
    setSavingDay(day)
    try {
      const saved = await upsertGymTiming(timings[day])
      setTimings((prev) => ({ ...prev, [day]: saved }))
    } finally {
      setSavingDay(null)
    }
  }

  if (loading) return <p className="text-muted">Loading…</p>

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 font-display text-3xl text-ink">Gym Timings</h1>
      <p className="mb-8 text-sm text-muted">Changes here appear immediately on the public Contact page.</p>

      <div className="space-y-3">
        {DAY_ORDER.map((day) => {
          const t = timings[day]
          return (
            <div key={day} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/5 bg-surface/50 p-4">
              <span className="w-28 text-sm text-ink">{day}</span>
              <label className="flex items-center gap-2 text-xs text-muted">
                <input type="checkbox" checked={t.is_open} onChange={(e) => updateDay(day, { is_open: e.target.checked })} />
                Open
              </label>
              <input
                type="time"
                value={t.open_time}
                disabled={!t.is_open}
                onChange={(e) => updateDay(day, { open_time: e.target.value })}
                className="rounded-lg border border-white/10 bg-obsidian/60 px-3 py-1.5 text-sm text-ink disabled:opacity-40"
              />
              <span className="text-muted">–</span>
              <input
                type="time"
                value={t.close_time}
                disabled={!t.is_open}
                onChange={(e) => updateDay(day, { close_time: e.target.value })}
                className="rounded-lg border border-white/10 bg-obsidian/60 px-3 py-1.5 text-sm text-ink disabled:opacity-40"
              />
              <button
                onClick={() => saveDay(day)}
                disabled={savingDay === day}
                className="ml-auto rounded-full bg-violet/20 px-4 py-1.5 text-xs text-violet-soft hover:bg-violet/30 disabled:opacity-60"
              >
                {savingDay === day ? 'Saving…' : 'Save'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
