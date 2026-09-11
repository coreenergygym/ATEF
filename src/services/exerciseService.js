import { supabase } from '../lib/supabase'
import { validateUpload, fileExtension } from '../lib/uploads'

const TABLE = 'exercises'
const IMAGE_BUCKET = 'exercise-images'
const VIDEO_BUCKET = 'exercise-videos'

export async function getActiveExercises() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  if (error) throw error
  return data
}

export async function getExerciseById(id) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function getAllExercises() {
  const { data, error } = await supabase.from(TABLE).select('*').order('display_order', { ascending: true })
  if (error) throw error
  return data
}

export async function uploadExerciseImage(file) {
  validateUpload(file, 'image')
  const ext = fileExtension(file)
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, { upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
  return { path, publicUrl: data.publicUrl }
}

export async function uploadExerciseVideo(file) {
  validateUpload(file, 'video')
  const ext = fileExtension(file)
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(VIDEO_BUCKET).upload(path, file, { upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path)
  return { path, publicUrl: data.publicUrl }
}

export async function createExercise(exercise) {
  const { data, error } = await supabase.from(TABLE).insert(exercise).select().single()
  if (error) throw error
  return data
}

export async function updateExercise(id, updates) {
  const { data: existing, error: fetchError } = await supabase.from(TABLE).select('image_path, video_path').eq('id', id).single()
  if (fetchError) throw fetchError
  const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id).select().single()
  if (error) throw error
  if (updates.image_path && existing.image_path && updates.image_path !== existing.image_path) await supabase.storage.from(IMAGE_BUCKET).remove([existing.image_path])
  if (updates.video_path && existing.video_path && updates.video_path !== existing.video_path) await supabase.storage.from(VIDEO_BUCKET).remove([existing.video_path])
  return data
}

export async function deleteExercise(id, imagePath, videoPath) {
  if (imagePath) await supabase.storage.from(IMAGE_BUCKET).remove([imagePath])
  if (videoPath) await supabase.storage.from(VIDEO_BUCKET).remove([videoPath])
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}
