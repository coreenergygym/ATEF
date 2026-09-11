import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import {
  getAllDietPlans, uploadDietFile, createDietPlan, updateDietPlan, deleteDietPlan
} from '../../services/dietService.js'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { Input, Textarea } from './Membership.jsx'

const EMPTY = { title: '', short_description: '', detailed_content: '', category: '', is_active: true }

export default function AdminDietPlans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [imageFile, setImageFile] = useState(null)
  const [docFile, setDocFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [error, setError] = useState(null)

  function load() {
    setLoading(true)
    getAllDietPlans().then(setPlans).catch(setError).finally(() => setLoading(false))
  }
  useEffect(load, [])

  function openEdit(plan) {
    setEditing(plan || 'new')
    setForm(plan ? { ...plan } : { ...EMPTY })
    setImageFile(null)
    setDocFile(null)
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
        const { publicUrl, path } = await uploadDietFile(imageFile, 'images')
        payload.image_url = publicUrl
        payload.image_path = path
      }
      if (docFile) {
        const { publicUrl, path } = await uploadDietFile(docFile, 'files')
        payload.file_url = publicUrl
        payload.file_path = path
      }
      if (editing === 'new') {
        payload.display_order = plans.length
        await createDietPlan(payload)
      } else {
        await updateDietPlan(editing.id, payload)
      }
      setEditing(null)
      load()
    } catch (err) {
      setError('Could not save the diet plan.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setSaving(true)
    try {
      const paths = [toDelete.image_path, toDelete.file_path].filter(Boolean)
      await deleteDietPlan(toDelete.id, paths)
      setToDelete(null)
      load()
    } catch (err) {
      setError('Could not delete this plan.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Diet Plans</h1>
        <button onClick={() => openEdit(null)} className="flex items-center gap-2 rounded-full bg-violet px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-soft">
          <Plus size={16} /> Add Plan
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {!loading && plans.length === 0 && <EmptyState title="No diet plans yet" description="Add your first plan." />}

      <div className="space-y-4">
        {plans.map((plan) => (
          <div key={plan.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-surface/50 p-5">
            <div>
              <p className="text-ink">{plan.title} {!plan.is_active && <span className="ml-2 rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted">Inactive</span>}</p>
              <p className="text-sm text-muted">{plan.short_description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateDietPlan(plan.id, { is_active: !plan.is_active }).then(load)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted hover:text-ink">
                {plan.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => openEdit(plan)} className="p-2 text-muted hover:text-ink"><Pencil size={16} /></button>
              <button onClick={() => setToDelete(plan)} className="p-2 text-muted hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form onSubmit={handleSave} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-charcoal p-7">
            <h2 className="mb-6 text-lg text-ink">{editing === 'new' ? 'Add Diet Plan' : 'Edit Diet Plan'}</h2>
            <div className="space-y-4">
              <Input label="Plan Title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} required />
              <Input label="Category (optional)" value={form.category || ''} onChange={(v) => setForm((f) => ({ ...f, category: v }))} />
              <Textarea label="Short Description" value={form.short_description || ''} onChange={(v) => setForm((f) => ({ ...f, short_description: v }))} />
              <Textarea label="Detailed Content" value={form.detailed_content || ''} onChange={(v) => setForm((f) => ({ ...f, detailed_content: v }))} rows={5} />
              <label className="block">
                <span className="mb-1.5 block text-sm text-muted">Image (optional)</span>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="block w-full text-sm text-muted" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-muted">Document (optional)</span>
                <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setDocFile(e.target.files?.[0] || null)} className="block w-full text-sm text-muted" />
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

      <ConfirmDialog open={!!toDelete} title={`Delete "${toDelete?.title}"?`} loading={saving} onCancel={() => setToDelete(null)} onConfirm={handleDelete} />
    </div>
  )
}
