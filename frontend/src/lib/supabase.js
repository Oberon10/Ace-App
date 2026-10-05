import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rjbbbnotsuqbwxochxri.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqYmJibm90c3VxYnd4b2NoeHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MjczNTUsImV4cCI6MjEwNTQwMzM1NX0.mTN8ayr45Iph80kdsMvVZVEt7th8E0_OhGkDrg2eINs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Synchronizes a registered customer into the Supabase `customers` table
 * Required fields: id, first name, last name, email address, country, phone number, password, items
 */
export async function syncCustomerToSupabase(customerData) {
  try {
    const firstName = customerData.firstName || customerData.first_name || (customerData.name ? customerData.name.split(' ')[0] : '') || '';
    const lastName = customerData.lastName || customerData.last_name || (customerData.name ? customerData.name.split(' ').slice(1).join(' ') : '') || '';
    const emailAddress = customerData.emailAddress || customerData.email_address || customerData.email || '';
    const country = customerData.country || 'Ghana';
    const phoneNumber = customerData.phoneNumber || customerData.phone_number || customerData.phone || '';
    const password = customerData.password || customerData.loginPassword || '';
    const items = customerData.items || 'General Cargo & Commercial Goods';

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email_address: emailAddress.trim().toLowerCase(),
      country: country.trim(),
      phone_number: phoneNumber.trim(),
      password: password,
      items: typeof items === 'string' ? items.trim() : JSON.stringify(items)
    };

    const { data, error } = await supabase
      .from('customers')
      .insert([payload])
      .select();

    if (error) {
      console.warn('⚠️ Supabase customer sync returned error:', error.message);
      return { success: false, error };
    }

    console.log('✅ Successfully synced customer to Supabase `customers` table:', data?.[0]);
    return { success: true, data: data?.[0] };
  } catch (err) {
    console.warn('⚠️ Exception syncing customer to Supabase:', err);
    return { success: false, error: err };
  }
}

/**
 * Fetches all customers from the Supabase `customers` table
 */
export async function fetchSupabaseCustomers() {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('⚠️ Could not fetch customers from Supabase:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.warn('⚠️ Exception fetching customers from Supabase:', err);
    return [];
  }
}
