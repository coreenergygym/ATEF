import React, { useEffect, useState } from 'react'
import { Image as ImageIcon, X } from 'lucide-react'
import { getActiveGalleryItems } from '../services/galleryService.js'
import { GridSkeleton } from '../components/ui/Skeleton.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

export default function Gallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(null)

  useEffect(() => {
    getActiveGalleryItems()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <p className="mb-3 text-sm uppercase tracking-widest text-violet-soft">Gallery</p>
      <h1 className="mb-12 font-display text-4xl text-ink">Inside ATEF</h1>

      {loading && <GridSkeleton count={9} />}

      {!loading && items.length === 0 && (
        <EmptyState
          icon={ImageIcon}
          title="Gallery coming soon"
          description="Photos and videos from the gym will be added here shortly."
        />
      )}

      {!loading && items.length > 0 && (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item)}
              className="block w-full overflow-hidden rounded-2xl border border-white/5 bg-surface/50 text-left focus-visible:outline-2"
            >
              {item.media_type === 'video' ? (
                <video src={item.media_url} className="w-full" muted playsInline preload="metadata" />
              ) : (
                <img src={item.media_url} alt={item.title || 'ATEF gallery'} className="w-full object-cover" loading="lazy" />
              )}
              {item.title && <p className="px-4 py-3 text-sm text-ink">{item.title}</p>}
            </button>
          ))}
        </div>
      )}

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute right-5 top-5 text-white"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <div className="max-h-[85vh] max-w-3xl" onClick={(e) => e.stopPropagation()}>
            {active.media_type === 'video' ? (
              <video src={active.media_url} controls autoPlay className="max-h-[85vh] w-full rounded-xl" />
            ) : (
              <img src={active.media_url} alt={active.title || 'ATEF gallery'} className="max-h-[85vh] w-full rounded-xl object-contain" />
            )}
            {active.caption && <p className="mt-3 text-center text-sm text-muted">{active.caption}</p>}
          </div>
        </div>
      )}
    </section>
  )
}
