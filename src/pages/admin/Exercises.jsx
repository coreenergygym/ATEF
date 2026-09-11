import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import {
  getAllExercises, uploadExerciseImage, uploadExerciseVideo, createExercise, updateExercise, deleteExercise
} from '../../services/exerciseService.js'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { Input, Textarea } from './Membership.jsx'

const EMPTY = {
  name: '', target_muscle: '', target_body_part: '', description: '',
  instructions: '', common_mistakes: '', tips: '', is_active: true
}

export default function AdminExercises() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [imageFile, setImageFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [error, setError] = useState(null)

  function load() {
    setLoading(true)
    getAllExercises().then(setExercises).catch(setError).finally(() => setLoading(false))
  }
  useEffect(load, [])

  function openEdit(ex) {
    setEditing(ex || 'new')
    setForm(ex ? { ...ex } : { ...EMPTY })
    setImageFile(null)
    setVideoFile(null)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = { ...form }
      delete payload.id
      delete payload.created_at
      if (imageFile) {
        const { publicUrl, path } = await uploadExerciseImage(imageFile)
        payload.image_url = publicUrl
        payload.image_path = path
      }
      if (videoFile) {
        const { publicUrl, path } = await uploadExerciseVideo(videoFile)
        payload.video_url = publicUrl
        payload.video_path = path
      }
      if (editing === 'new') {
        payload.display_order = exercises.length
        await createExercise(payload)
      } else {
        await updateExercise(editing.id, payload)
      }
      setEditing(null)
      load()
    } catch (err) {
      setError('Could not save this exercise.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setSaving(true)
    try {
      await deleteExercise(toDelete.id, toDelete.image_path, toDelete.video_path)
      setToDelete(null)
      load()
    } catch (err) {
      setError('Could not delete this exercise.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Exercise &amp; Machines</h1>
        <button onClick={() => openEdit(null)} className="flex items-center gap-2 rounded-full bg-violet px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-soft">
          <Plus size={16} /> Add Exercise
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {!loading && exercises.length === 0 && <EmptyState title="No exercises yet" description="Add your first machine or exercise." />}

      <div className="space-y-4">
        {exercises.map((ex) => (
          <div key={ex.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-surface/50 p-5">
            <div>
              <p className="text-ink">{ex.name} {!ex.is_active && <span className="ml-2 rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted">Inactive</span>}</p>
              <p className="text-sm text-muted">{ex.target_muscle} {ex.target_body_part ? `· ${ex.target_body_part}` : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateExercise(ex.id, { is_active: !ex.is_active }).then(load)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted hover:text-ink">
                {ex.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => openEdit(ex)} className="p-2 text-muted hover:text-ink"><Pencil size={16} /></button>
              <button onClick={() => setToDelete(ex)} className="p-2 text-muted hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form onSubmit={handleSave} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-charcoal p-7">
            <h2 className="mb-6 text-lg text-ink">{editing === 'new' ? 'Add Exercise' : 'Edit Exercise'}</h2>
            <div className="space-y-4">
              <Input label="Exercise / Machine Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
              <Input label="Target Muscle" value={form.target_muscle || ''} onChange={(v) => setForm((f) => ({ ...f, target_muscle: v }))} />
              <Input label="Target Body Part" value={form.target_body_part || ''} onChange={(v) => setForm((f) => ({ ...f, target_body_part: v }))} />
              <Textarea label="Description" value={form.description || ''} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
              <Textarea label="Step-by-step Instructions" value={form.instructions || ''} onChange={(v) => setForm((f) => ({ ...f, instructions: v }))} rows={4} />
              <Textarea label="Common Mistakes (optional)" value={form.common_mistakes || ''} onChange={(v) => setForm((f) => ({ ...f, common_mistakes: v }))} />
              <Textarea label="Additional Tips (optional)" value={form.tips || ''} onChange={(v) => setForm((f) => ({ ...f, tips: v }))} />
              <label className="block">
                <span className="mb-1.5 block text-sm text-muted">Photo</span>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="block w-full text-sm text-muted" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-muted">Correct-form demonstration video</span>
                <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="block w-full text-sm text-muted" />
              </label>
              <label className="flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
                Active (visible on website)
              </label>
            </div>
            <div className="mt-7 flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-muted hover:text-ink">Cancel</button>
              <button type="submit" disabled={saving} className="rounded-full bg-violet px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-soft disabled:opacity-60">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog open={!!toDelete} title={`Delete "${toDelete?.name}"?`} loading={saving} onCancel={() => setToDelete(null)} onConfirm={handleDelete} />
    </div>
  )
}
