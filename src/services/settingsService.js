import { supabase } from '../lib/supabase'
import { validateUpload, fileExtension } from '../lib/uploads'

export async function getGymSettings() {
  const { data, error } = await supabase.from('gym_settings').select('*').maybeSingle()
  if (error) throw error
  return data
}

// gym_settings is designed as a single row. If it exists we update it,
// otherwise we create the first (and only) row.
export async function upsertGymSettings(updates, existingId) {
  if (existingId) {
    const { data, error } = await supabase
      .from('gym_settings')
      .update(updates)
      .eq('id', existingId)
      .select()
      .single()
    if (error) throw error
    return data
  }
  const { data, error } = await supabase.from('gym_settings').insert(updates).select().single()
  if (error) throw error
  return data
}

export async function uploadLogo(file) {
  validateUpload(file, 'image')
  const ext = fileExtension(file)
  const path = `logo-${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('branding').upload(path, file, { upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('branding').getPublicUrl(path)
  // Branding is reserved for the gym logo. Clean up older logo files after the new one exists.
  const { data: oldFiles } = await supabase.storage.from('branding').list('', { limit: 100 })
  const oldLogoPaths = (oldFiles || [])
    .map((item) => item.name)
    .filter((name) => name.startsWith('logo-') && name !== path)
  if (oldLogoPaths.length) await supabase.storage.from('branding').remove(oldLogoPaths)
  return { path, publicUrl: data.publicUrl }
}

export async function getGymTimings() {
  const { data, error } = await supabase.from('gym_timings').select('*').order('day')
  if (error) throw error
  return data
}

export async function upsertGymTiming(timing) {
  const { data, error } = await supabase
    .from('gym_timings')
    .upsert(timing, { onConflict: 'day' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getDashboardStats() {
  const [plans, gallery, diet, exercises, enquiries, newEnquiries] = await Promise.all([
    supabase.from('membership_plans').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('gallery_items').select('id', { count: 'exact', head: true }),
    supabase.from('diet_plans').select('id', { count: 'exact', head: true }),
    supabase.from('exercises').select('id', { count: 'exact', head: true }),
    supabase.from('enquiries').select('id', { count: 'exact', head: true }),
    supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'New')
  ])
  return {
    activePlans: plans.count || 0,
    galleryItems: gallery.count || 0,
    dietPlans: diet.count || 0,
    exercises: exercises.count || 0,
    totalEnquiries: enquiries.count || 0,
    newEnquiries: newEnquiries.count || 0
  }
}
