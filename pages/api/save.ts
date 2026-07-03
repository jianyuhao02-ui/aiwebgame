import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// Save pet: expects { name, prompt, myItems, mascot }
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { name, prompt, myItems, mascot } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Missing name' });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY; // should be service_role key for server-side
  if (!url || !key) {
    return res.status(501).json({ error: 'Supabase not configured on server. Use client localStorage fallback.' });
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase.from('pets').insert([{ name, prompt, my_items: myItems, mascot }]).select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  } catch (err: any) {
    return res.status(500).json({ error: String(err) });
  }
}
