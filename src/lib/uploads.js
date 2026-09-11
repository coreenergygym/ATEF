const LIMITS = {
  image: 10 * 1024 * 1024,
  video: 200 * 1024 * 1024,
  document: 20 * 1024 * 1024,
}

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]

export function validateUpload(file, kind) {
  if (!file) throw new Error('No file selected.')
  const allowed = kind === 'image' ? IMAGE_TYPES : kind === 'video' ? VIDEO_TYPES : DOCUMENT_TYPES
  const limit = LIMITS[kind]
  if (!allowed.includes(file.type)) {
    throw new Error(`Unsupported ${kind} file type.`)
  }
  if (file.size > limit) {
    throw new Error(`File is too large. Maximum size is ${Math.round(limit / (1024 * 1024))}MB.`)
  }
}

export function fileExtension(file) {
  return file.name.split('.').pop()?.toLowerCase() || 'bin'
}
