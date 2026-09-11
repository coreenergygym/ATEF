import React, { useState } from 'react'
import { MapPin, Phone, Instagram, Mail, CheckCircle2 } from 'lucide-react'
import { useGymSettings, DAY_ORDER } from '../hooks/useGymSettings.jsx'
import { createEnquiry } from '../services/enquiryService.js'
import { buildEnquiryWhatsAppLink, buildGeneralWhatsAppLink, WHATSAPP_DISPLAY } from '../lib/whatsapp.js'
import { getActivePlans } from '../services/membershipService.js'

const EMPTY_FORM = {
  full_name: '',
  phone: '',
  age: '',
  gender: '',
  interested_plan: '',
  fitness_goal: '',
  message: ''
}

export default function Contact() {
  const { settings, timings, loading: settingsLoading } = useGymSettings()
  const [form, setForm] = useState(EMPTY_FORM)
  const [plans, setPlans] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(null) // holds the submitted enquiry for the WhatsApp CTA
  const [submitError, setSubmitError] = useState(null)

  React.useEffect(() => {
    getActivePlans().then(setPlans).catch(() => setPlans([]))
  }, [])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validate() {
    const next = {}
    if (!form.full_name.trim()) next.full_name = 'Full name is required.'
    if (!form.phone.trim()) next.phone = 'Phone number is required.'
    else if (!/^[+\d][\d\s().-]{7,19}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number.'
    if (form.age && (isNaN(form.age) || Number(form.age) < 10 || Number(form.age) > 100)) {
      next.age = 'Enter a valid age.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return
    setSubmitting(true)
    try {
      const saved = await createEnquiry(form)
      setSuccess(saved)
      setForm(EMPTY_FORM)
    } catch (err) {
      setSubmitError('Something went wrong sending your enquiry. Please try WhatsApp instead.')
    } finally {
      setSubmitting(false)
    }
  }

  const timingsConfigured = timings && timings.length > 0 && timings.some((t) => t.is_open)

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <p className="mb-3 text-sm uppercase tracking-widest text-violet-soft">Contact</p>
      <h1 className="mb-12 font-display text-4xl text-ink">Let's get you started</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Info column */}
        <div className="space-y-8">
          <div>
            <h2 className="mb-1 text-lg text-ink">{settings?.gym_name || 'ATEF — All Time Elite Fitness'}</h2>
          </div>

          <div className="flex items-start gap-3 text-muted">
            <MapPin size={18} className="mt-0.5 shrink-0 text-violet-soft" />
            <div>
              <p>{settings?.address || '3rd Floor, Pentagon Tower, Plot No. 9, Lajpat Nagar, Alwar, Rajasthan — 301001'}</p>
              <a
                href={settings?.maps_url || 'https://maps.app.goo.gl/yN62AxTqHbgeqq1fA'}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-sm text-violet-soft hover:text-violet"
              >
                Get directions
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3 text-muted">
            <Phone size={18} className="mt-0.5 shrink-0 text-violet-soft" />
            <div>
              <a href={`tel:${settings?.phone || '+918504037039'}`} className="block hover:text-ink">
                {settings?.phone || '+91 85040 37039'}
              </a>
              <a href={buildGeneralWhatsAppLink()} target="_blank" rel="noreferrer" className="block hover:text-ink">
                WhatsApp: {WHATSAPP_DISPLAY}
              </a>
            </div>
          </div>

          {settings?.email && (
            <div className="flex items-center gap-3 text-muted">
              <Mail size={18} className="shrink-0 text-violet-soft" />
              <a href={`mailto:${settings.email}`} className="hover:text-ink">{settings.email}</a>
            </div>
          )}

          <div className="flex items-center gap-3 text-muted">
            <Instagram size={18} className="shrink-0 text-violet-soft" />
            <a
              href={settings?.instagram_url || 'https://www.instagram.com/atefclub/'}
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink"
            >
              @atefclub
            </a>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-ink">Timings</h3>
            {settingsLoading ? (
              <div className="h-24 animate-pulse rounded-xl bg-surface/60" />
            ) : timingsConfigured ? (
              <ul className="space-y-1 text-sm text-muted">
                {DAY_ORDER.map((day) => {
                  const t = timings.find((row) => row.day === day)
                  return (
                    <li key={day} className="flex justify-between border-b border-white/5 py-1.5">
                      <span>{day}</span>
                      <span>{t && t.is_open ? `${t.open_time} – ${t.close_time}` : 'Closed'}</span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted">Timings will be updated soon.</p>
            )}
          </div>
        </div>

        {/* Form column */}
        <div className="rounded-2xl border border-white/5 bg-surface/50 p-8">
          {success ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto mb-4 text-violet-soft" size={36} />
              <h3 className="mb-2 text-lg text-ink">Enquiry received</h3>
              <p className="mb-6 text-sm text-muted">
                Thanks — our team will get back to you shortly. You can also send this straight to us on WhatsApp now.
              </p>
              <a
                href={buildEnquiryWhatsAppLink(success)}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full bg-violet px-6 py-3 text-sm font-medium text-white hover:bg-violet-soft"
              >
                Open WhatsApp with these details
              </a>
              <p className="mt-3 text-xs text-muted">
                This opens WhatsApp with your message drafted — you'll still need to press send there.
              </p>
              <button
                onClick={() => setSuccess(null)}
                className="mt-6 block w-full text-sm text-muted hover:text-ink"
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <Field label="Full Name" error={errors.full_name}>
                <input
                  value={form.full_name}
                  onChange={(e) => update('full_name', e.target.value)}
                  className={inputClass(errors.full_name)}
                  autoComplete="name"
                />
              </Field>

              <Field label="Phone Number" error={errors.phone}>
                <input
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className={inputClass(errors.phone)}
                  autoComplete="tel"
                  inputMode="tel"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Age" error={errors.age}>
                  <input
                    value={form.age}
                    onChange={(e) => update('age', e.target.value)}
                    className={inputClass(errors.age)}
                    inputMode="numeric"
                  />
                </Field>
                <Field label="Gender">
                  <select
                    value={form.gender}
                    onChange={(e) => update('gender', e.target.value)}
                    className={inputClass()}
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </Field>
              </div>

              <Field label="Interested Membership Plan">
                <select
                  value={form.interested_plan}
                  onChange={(e) => update('interested_plan', e.target.value)}
                  className={inputClass()}
                >
                  <option value="">Select a plan</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </Field>

              <Field label="Fitness Goal">
                <input
                  value={form.fitness_goal}
                  onChange={(e) => update('fitness_goal', e.target.value)}
                  className={inputClass()}
                  placeholder="e.g. weight loss, strength, general fitness"
                />
              </Field>

              <Field label="Message">
                <textarea
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  className={inputClass()}
                  rows={3}
                />
              </Field>

              {submitError && <p className="text-sm text-red-400">{submitError}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-violet px-6 py-3.5 font-medium text-white transition hover:bg-violet-soft disabled:opacity-60"
              >
                {submitting ? 'Sending…' : 'Send Enquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  )
}

function inputClass(error) {
  return `w-full rounded-lg border bg-obsidian/60 px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-violet/60 ${
    error ? 'border-red-500/60' : 'border-white/10'
  }`
}
