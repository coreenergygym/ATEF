import { supabase } from '../lib/supabase'
import { validateUpload, fileExtension } from '../lib/uploads'

const TABLE = 'gallery_items'
const BUCKET = 'gallery'

export async function getActiveGalleryItems() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  if (error) throw error
  return data
}

export async function getAllGalleryItems() {
  const { data, error } = await supabase.from(TABLE).select('*').order('display_order', { ascending: true })
  if (error) throw error
  return data
}

export async function uploadGalleryFile(file) {
  const kind = file.type.startsWith('video/') ? 'video' : 'image'
  validateUpload(file, kind)
  const ext = fileExtension(file)
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { path, publicUrl: data.publicUrl }
}

export async function createGalleryItem(item) {
  const { data, error } = await supabase.from(TABLE).insert(item).select().single()
  if (error) throw error
  return data
}

export async function updateGalleryItem(id, updates) {
  const { data: existing, error: fetchError } = await supabase.from(TABLE).select('storage_path').eq('id', id).single()
  if (fetchError) throw fetchError
  const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id).select().single()
  if (error) throw error
  if (updates.storage_path && existing.storage_path && updates.storage_path !== existing.storage_path) {
    await supabase.storage.from(BUCKET).remove([existing.storage_path])
  }
  return data
}

export async function deleteGalleryItem(id, storagePath) {
  if (storagePath) {
    await supabase.storage.from(BUCKET).remove([storagePath])
  }
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}
