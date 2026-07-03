import type { NextApiRequest, NextApiResponse } from 'next'

type Data = { emotion: string; emoji: string; explain?: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | { error: string }>) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'Missing text' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // fallback naive rules
    const lower = (text || '').toLowerCase();
    if (/笑|笑话|搞笑|haha|lol/.test(lower)) return res.status(200).json({ emotion: 'funny', emoji: '🤣', explain: '关键词匹配：含笑/搞笑' });
    if (/悲伤|难过|哭|sad|tear/.test(lower)) return res.status(200).json({ emotion: 'sad', emoji: '😢', explain: '关键词匹配：悲伤' });
    return res.status(200).json({ emotion: 'neutral', emoji: '🤖', explain: '默认情绪' });
  }

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an assistant that classifies short text into one of: funny, sad, neutral. Respond JSON like {"emotion":"funny","emoji":"🤣","explain":"..."} only.' },
          { role: 'user', content: `Classify the emotion of the following text and return JSON: ${text}` }
        ],
        max_tokens: 60,
        temperature: 0
      })
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(500).json({ error: `OpenAI error: ${r.status} ${t}` });
    }
    const j = await r.json();
    const reply = j.choices?.[0]?.message?.content || '';
    // try to parse JSON
    try {
      const parsed = JSON.parse(reply);
      return res.status(200).json({ emotion: parsed.emotion || 'neutral', emoji: parsed.emoji || '🤖', explain: parsed.explain || '' });
    } catch (e) {
      // fallback: simple text-based heuristics
      const lower = (reply || '').toLowerCase();
      if (/funny|😂|🤣|笑/.test(lower)) return res.status(200).json({ emotion: 'funny', emoji: '🤣', explain: '模型回复包含搞笑提示' });
      if (/sad|悲伤|😢|哭/.test(lower)) return res.status(200).json({ emotion: 'sad', emoji: '😢', explain: '模型回复包含悲伤提示' });
      return res.status(200).json({ emotion: 'neutral', emoji: '🤖', explain: '模型未明确分类，采用默认' });
    }
  } catch (err: any) {
    return res.status(500).json({ error: String(err) });
  }
}
