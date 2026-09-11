import React, { useEffect, useState } from 'react'
import { getGymSettings, upsertGymSettings, uploadLogo } from '../../services/settingsService.js'
import { Input, Textarea } from './Membership.jsx'

export default function AdminGymInfo() {
  const [settings, setSettings] = useState(null)
  const [form, setForm] = useState(null)
  const [logoFile, setLogoFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    getGymSettings()
      .then((data) => {
        setSettings(data)
        setForm(
          data || {
            gym_name: 'ATEF — All Time Elite Fitness',
            tagline: '',
            about_short: '',
            about_long: '',
            address: '3rd Floor, Pentagon Tower, Plot No. 9, Lajpat Nagar, Alwar, Rajasthan — 301001',
            phone: '+91 85040 37039',
            whatsapp: '+91 85040 37039',
            instagram_url: 'https://www.instagram.com/atefclub/',
            email: '',
            maps_url: 'https://maps.app.goo.gl/yN62AxTqHbgeqq1fA'
          }
        )
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const payload = { ...form }
      if (logoFile) {
        const { publicUrl } = await uploadLogo(logoFile)
        payload.logo_url = publicUrl
      }
      const saved = await upsertGymSettings(payload, settings?.id)
      setSettings(saved)
      setMessage('Saved.')
    } catch (err) {
      setMessage('Could not save changes.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !form) return <p className="text-muted">Loading…</p>

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 font-display text-3xl text-ink">Gym Information</h1>
      <form onSubmit={handleSave} className="space-y-5">
        <Input label="Gym Name" value={form.gym_name || ''} onChange={(v) => setForm((f) => ({ ...f, gym_name: v }))} />
        <Input label="Tagline" value={form.tagline || ''} onChange={(v) => setForm((f) => ({ ...f, tagline: v }))} />
        <Textarea label="About (short)" value={form.about_short || ''} onChange={(v) => setForm((f) => ({ ...f, about_short: v }))} />
        <Textarea label="About (detailed)" value={form.about_long || ''} onChange={(v) => setForm((f) => ({ ...f, about_long: v }))} rows={5} />
        <Textarea label="Address" value={form.address || ''} onChange={(v) => setForm((f) => ({ ...f, address: v }))} />
        <Input label="Phone" value={form.phone || ''} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
        <Input label="WhatsApp" value={form.whatsapp || ''} onChange={(v) => setForm((f) => ({ ...f, whatsapp: v }))} />
        <Input label="Instagram URL" value={form.instagram_url || ''} onChange={(v) => setForm((f) => ({ ...f, instagram_url: v }))} />
        <Input label="Email (leave blank if none yet)" value={form.email || ''} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
        <Input label="Google Maps Link" value={form.maps_url || ''} onChange={(v) => setForm((f) => ({ ...f, maps_url: v }))} />
        <label className="block">
          <span className="mb-1.5 block text-sm text-muted">Logo</span>
          {form.logo_url && <img src={form.logo_url} alt="Current logo" className="mb-3 h-12" />}
          <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="block w-full text-sm text-muted" />
        </label>

        {message && <p className="text-sm text-muted">{message}</p>}

        <button type="submit" disabled={saving} className="rounded-full bg-violet px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-soft disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
