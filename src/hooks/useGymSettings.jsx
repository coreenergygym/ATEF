import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/**
 * Loads the single gym_settings row plus the gym_timings table.
 * Used across the public site (Navbar, Footer, Contact) so the owner's
 * edits in the admin panel show up everywhere without a redeploy.
 */
export function useGymSettings() {
  const [settings, setSettings] = useState(null)
  const [timings, setTimings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const [{ data: settingsRow, error: settingsError }, { data: timingRows, error: timingError }] =
          await Promise.all([
            supabase.from('gym_settings').select('*').maybeSingle(),
            supabase.from('gym_timings').select('*')
          ])

        if (settingsError) throw settingsError
        if (timingError) throw timingError

        if (isMounted) {
          setSettings(settingsRow)
          const sorted = [...(timingRows || [])].sort(
            (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
          )
          setTimings(sorted)
        }
      } catch (err) {
        if (isMounted) setError(err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  return { settings, timings, loading, error }
}

export { DAY_ORDER }
