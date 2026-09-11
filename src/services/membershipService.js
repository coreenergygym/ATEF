import { supabase } from '../lib/supabase'

const TABLE = 'membership_plans'

export async function getActivePlans() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  if (error) throw error
  return data
}

export async function getAllPlans() {
  const { data, error } = await supabase.from(TABLE).select('*').order('display_order', { ascending: true })
  if (error) throw error
  return data
}

export async function createPlan(plan) {
  const { data, error } = await supabase.from(TABLE).insert(plan).select().single()
  if (error) throw error
  return data
}

export async function updatePlan(id, updates) {
  const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deletePlan(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}
