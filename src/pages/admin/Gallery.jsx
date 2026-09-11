import React, { useEffect, useState } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react'
import {
  getAllGalleryItems, uploadGalleryFile, createGalleryItem, updateGalleryItem, deleteGalleryItem
} from '../../services/galleryService.js'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { Input } from './Membership.jsx'

export default function AdminGallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  function load() {
    setLoading(true)
    getAllGalleryItems().then(setItems).catch(setError).finally(() => setLoading(false))
  }
  useEffect(load, [])

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const mediaType = file.type.startsWith('video') ? 'video' : 'image'
      const { path, publicUrl } = await uploadGalleryFile(file)
      await createGalleryItem({
        media_url: publicUrl,
        storage_path: path,
        media_type: mediaType,
        title: title || null,
        caption: caption || null,
        is_active: true,
        display_order: items.length
      })
      setTitle('')
      setCaption('')
      setFile(null)
      load()
    } catch (err) {
      setError('Upload failed. Check the file type/size and try again.')
    } finally {
      setUploading(false)
    }
  }

  async function move(item, direction) {
    const idx = items.findIndex((i) => i.id === item.id)
    const swapIdx = idx + direction
    if (swapIdx < 0 || swapIdx >= items.length) return
    const other = items[swapIdx]
    await Promise.all([
      updateGalleryItem(item.id, { display_order: other.display_order }),
      updateGalleryItem(other.id, { display_order: item.display_order })
    ])
    load()
  }

  async function handleDelete() {
    setBusy(true)
    try {
      await deleteGalleryItem(toDelete.id, toDelete.storage_path)
      setToDelete(null)
      load()
    } catch (err) {
      setError('Could not delete this item.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink">Gallery</h1>

      <form onSubmit={handleUpload} className="mb-10 rounded-2xl border border-white/5 bg-surface/50 p-6">
        <h2 className="mb-4 text-sm font-medium text-ink">Upload new media</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Title (optional)" value={title} onChange={setTitle} />
          <Input label="Caption (optional)" value={caption} onChange={setCaption} />
        </div>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm text-muted">Photo or video file</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-violet/20 file:px-4 file:py-2 file:text-violet-soft"
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={!file || uploading}
          className="mt-5 flex items-center gap-2 rounded-full bg-violet px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-soft disabled:opacity-60"
        >
          <Plus size={16} /> {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </form>

      {!loading && items.length === 0 && (
        <EmptyState icon={ImageIcon} title="No gallery items yet" description="Upload your first photo or video above." />
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div key={item.id} className="overflow-hidden rounded-xl border border-white/5 bg-surface/50">
            {item.media_type === 'video' ? (
              <video src={item.media_url} className="h-40 w-full object-cover" muted />
            ) : (
              <img src={item.media_url} alt={item.title || ''} className="h-40 w-full object-cover" />
            )}
            <div className="flex items-center justify-between p-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-ink">{item.title || 'Untitled'}</p>
                {!item.is_active && <span className="text-xs text-muted">Inactive</span>}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => move(item, -1)} disabled={i === 0} className="p-1.5 text-muted hover:text-ink disabled:opacity-30"><ArrowUp size={14} /></button>
                <button onClick={() => move(item, 1)} disabled={i === items.length - 1} className="p-1.5 text-muted hover:text-ink disabled:opacity-30"><ArrowDown size={14} /></button>
                <button
                  onClick={() => updateGalleryItem(item.id, { is_active: !item.is_active }).then(load)}
                  className="p-1.5 text-xs text-muted hover:text-ink"
                  title={item.is_active ? 'Deactivate' : 'Activate'}
                >
                  {item.is_active ? '●' : '○'}
                </button>
                <button onClick={() => setToDelete(item)} className="p-1.5 text-muted hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this gallery item?"
        description="The file will be permanently removed from storage."
        loading={busy}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
