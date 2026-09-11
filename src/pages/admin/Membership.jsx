import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import {
  getAllPlans, createPlan, updatePlan, deletePlan
} from '../../services/membershipService.js'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'

const EMPTY = { name: '', duration: '', price: '', description: '', features: '', is_active: true }

export default function AdminMembership() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // plan object or 'new'
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [error, setError] = useState(null)

  function load() {
    setLoading(true)
    getAllPlans().then(setPlans).catch(setError).finally(() => setLoading(false))
  }

  useEffect(load, [])

  function openEdit(plan) {
    setEditing(plan || 'new')
    setForm(
      plan
        ? { ...plan, features: (plan.features || []).join('\n') }
        : { ...EMPTY }
    )
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = {
      name: form.name,
      duration: form.duration,
      price: Number(form.price) || 0,
      description: form.description,
      features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
      is_active: !!form.is_active,
      display_order: form.display_order ?? plans.length
    }
    try {
      if (editing === 'new') await createPlan(payload)
      else await updatePlan(editing.id, payload)
      setEditing(null)
      load()
    } catch (err) {
      setError('Could not save the plan. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setSaving(true)
    try {
      await deletePlan(toDelete.id)
      setToDelete(null)
      load()
    } catch (err) {
      setError('Could not delete the plan.')
    } finally {
      setSaving(false)
    }
  }

  async function move(plan, direction) {
    const idx = plans.findIndex((p) => p.id === plan.id)
    const swapIdx = idx + direction
    if (swapIdx < 0 || swapIdx >= plans.length) return
    const other = plans[swapIdx]
    await Promise.all([
      updatePlan(plan.id, { display_order: other.display_order }),
      updatePlan(other.id, { display_order: plan.display_order })
    ])
    load()
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Membership Plans</h1>
        <button
          onClick={() => openEdit(null)}
          className="flex items-center gap-2 rounded-full bg-violet px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-soft"
        >
          <Plus size={16} /> Add Plan
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {!loading && plans.length === 0 && (
        <EmptyState title="No membership plans yet" description="Add your first plan to show it on the website." />
      )}

      <div className="space-y-4">
        {plans.map((plan, i) => (
          <div key={plan.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-surface/50 p-5">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-ink">{plan.name}</p>
                {!plan.is_active && (
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted">Inactive</span>
                )}
              </div>
              <p className="text-sm text-muted">₹{plan.price} · {plan.duration}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => move(plan, -1)} disabled={i === 0} className="p-2 text-muted hover:text-ink disabled:opacity-30">
                <ArrowUp size={16} />
              </button>
              <button onClick={() => move(plan, 1)} disabled={i === plans.length - 1} className="p-2 text-muted hover:text-ink disabled:opacity-30">
                <ArrowDown size={16} />
              </button>
              <button
                onClick={() => updatePlan(plan.id, { is_active: !plan.is_active }).then(load)}
                className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted hover:text-ink"
              >
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
            <h2 className="mb-6 text-lg text-ink">{editing === 'new' ? 'Add Plan' : 'Edit Plan'}</h2>
            <div className="space-y-4">
              <Input label="Plan Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
              <Input label="Duration (e.g. 1 Month, 1 Year)" value={form.duration} onChange={(v) => setForm((f) => ({ ...f, duration: v }))} />
              <Input label="Price (₹)" type="number" value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} required />
              <Textarea label="Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
              <Textarea label="Features (one per line)" value={form.features} onChange={(v) => setForm((f) => ({ ...f, features: v }))} rows={4} />
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

      <ConfirmDialog
        open={!!toDelete}
        title={`Delete "${toDelete?.name}"?`}
        description="This will remove the plan from the website permanently."
        loading={saving}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export function Input({ label, value, onChange, type = 'text', required }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-obsidian/60 px-4 py-2.5 text-sm text-ink focus:border-violet/60"
      />
    </label>
  )
}

export function Textarea({ label, value, onChange, rows = 3 }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-obsidian/60 px-4 py-2.5 text-sm text-ink focus:border-violet/60"
      />
    </label>
  )
}
