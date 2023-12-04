// pages/api/submitScore.js
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user, score } = req.body; // You'd pass these in the body of your POST request

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('leaderboard')
    .insert([
      { user_id: user.id, score: score, /* other fields */ }
    ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ data });
}
