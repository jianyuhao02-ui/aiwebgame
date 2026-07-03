import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// GET -> list pets
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    return res.status(501).json({ error: 'Supabase not configured on server. Use client localStorage fallback.' });
  }
  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase.from('pets').select('*').order('created_at', { ascending: false }).limit(50);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  } catch (err: any) {
    return res.status(500).json({ error: String(err) });
  }
}
