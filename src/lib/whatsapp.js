const WHATSAPP_NUMBER = '918504037039' // +91 85040 37039, no symbols, for wa.me links

/**
 * Builds a wa.me link pre-filled with enquiry details.
 * Opening this link does NOT guarantee the message is sent automatically —
 * it opens WhatsApp with the message drafted; the user still has to press send.
 */
export function buildEnquiryWhatsAppLink(enquiry) {
  const lines = [
    'New ATEF Membership Enquiry',
    '',
    `Name: ${enquiry.full_name || '-'}`,
    `Phone: ${enquiry.phone || '-'}`,
    `Age: ${enquiry.age || '-'}`,
    `Gender: ${enquiry.gender || '-'}`,
    `Interested Plan: ${enquiry.interested_plan || '-'}`,
    `Fitness Goal: ${enquiry.fitness_goal || '-'}`,
    `Message: ${enquiry.message || '-'}`
  ]
  const text = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}

export function buildGeneralWhatsAppLink(message = 'Hi ATEF, I would like to know more.') {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const WHATSAPP_DISPLAY = '+91 85040 37039'
