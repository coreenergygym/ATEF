import { supabase } from '../lib/supabase'
import { validateUpload, fileExtension } from '../lib/uploads'

const TABLE = 'diet_plans'
const IMAGE_BUCKET = 'diet-plans'

export async function getActiveDietPlans() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  if (error) throw error
  return data
}

export async function getAllDietPlans() {
  const { data, error } = await supabase.from(TABLE).select('*').order('display_order', { ascending: true })
  if (error) throw error
  return data
}

export async function uploadDietFile(file, folder = 'images') {
  const kind = folder === 'images' ? 'image' : 'document'
  validateUpload(file, kind)
  const ext = fileExtension(file)
  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, { upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
  return { path, publicUrl: data.publicUrl }
}

export async function createDietPlan(plan) {
  const { data, error } = await supabase.from(TABLE).insert(plan).select().single()
  if (error) throw error
  return data
}

export async function updateDietPlan(id, updates) {
  const { data: existing, error: fetchError } = await supabase.from(TABLE).select('image_path, file_path').eq('id', id).single()
  if (fetchError) throw fetchError
  const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id).select().single()
  if (error) throw error
  const oldPaths = []
  if (updates.image_path && existing.image_path && updates.image_path !== existing.image_path) oldPaths.push(existing.image_path)
  if (updates.file_path && existing.file_path && updates.file_path !== existing.file_path) oldPaths.push(existing.file_path)
  if (oldPaths.length) await supabase.storage.from(IMAGE_BUCKET).remove(oldPaths)
  return data
}

export async function deleteDietPlan(id, storagePaths = []) {
  if (storagePaths.length) {
    await supabase.storage.from(IMAGE_BUCKET).remove(storagePaths)
  }
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}
