import { supabase } from '../lib/supabase'

const TABLE = 'enquiries'

// Public: create only. Reading/updating enquiries is restricted to admin by RLS.
export async function createEnquiry(enquiry) {
  const { data, error } = await supabase.from(TABLE).insert({ ...enquiry, status: 'New' }).select().single()
  if (error) throw error
  return data
}

export async function getAllEnquiries() {
  const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateEnquiryStatus(id, status) {
  const { data, error } = await supabase.from(TABLE).update({ status }).eq('id', id).select().single()
  if (error) throw error
  return data
}
