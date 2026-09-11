import React, { useEffect, useState } from 'react'
import { Phone, MessageCircle, Inbox } from 'lucide-react'
import { getAllEnquiries, updateEnquiryStatus } from '../../services/enquiryService.js'
import { buildEnquiryWhatsAppLink } from '../../lib/whatsapp.js'
import EmptyState from '../../components/ui/EmptyState.jsx'

const STATUSES = ['New', 'Contacted', 'Enrolled', 'Archived']

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  function load() {
    setLoading(true)
    getAllEnquiries().then(setEnquiries).catch(() => setEnquiries([])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  async function handleStatusChange(id, status) {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)))
    await updateEnquiryStatus(id, status)
  }

  const visible = filter === 'All' ? enquiries : enquiries.filter((e) => e.status === filter)

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-ink">Enquiries</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {['All', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-1.5 text-xs transition ${
              filter === s ? 'border-violet bg-violet/20 text-ink' : 'border-white/10 text-muted hover:text-ink'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {!loading && visible.length === 0 && (
        <EmptyState icon={Inbox} title="No enquiries" description="New enquiries submitted from the website will appear here." />
      )}

      <div className="space-y-4">
        {visible.map((e) => (
          <div key={e.id} className="rounded-xl border border-white/5 bg-surface/50 p-5">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-ink">{e.full_name}</p>
                <p className="text-xs text-muted">{new Date(e.created_at).toLocaleString()}</p>
              </div>
              <select
                value={e.status}
                onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                className="rounded-full border border-white/10 bg-obsidian/60 px-3 py-1.5 text-xs text-ink"
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 gap-1 text-sm text-muted sm:grid-cols-2">
              <p>Phone: {e.phone}</p>
              <p>Age: {e.age || '-'}</p>
              <p>Gender: {e.gender || '-'}</p>
              <p>Plan: {e.interested_plan || '-'}</p>
              <p className="sm:col-span-2">Goal: {e.fitness_goal || '-'}</p>
              {e.message && <p className="sm:col-span-2">Message: {e.message}</p>}
            </div>
            <div className="mt-4 flex gap-4">
              <a href={`tel:${e.phone}`} className="flex items-center gap-1.5 text-sm text-violet-soft hover:text-violet">
                <Phone size={15} /> Call
              </a>
              <a href={buildEnquiryWhatsAppLink(e)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-cyan hover:text-cyan-soft">
                <MessageCircle size={15} /> WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
