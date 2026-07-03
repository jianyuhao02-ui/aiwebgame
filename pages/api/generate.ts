import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  text: string,
  emoji?: string,
  explain?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') return res.status(405).end();
  const { prompt } = req.body || {};

  // If no API key is configured, return a mock response so users can try without a key.
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Simple heuristic to pick emoji
    const lower = (prompt || '').toLowerCase();
    let emoji = '🤔';
    if (lower.includes('笑') || lower.includes('joke') || lower.includes('幽默')) emoji = '🤣';
    if (lower.includes('安慰') || lower.includes('鼓励') || lower.includes('慰')) emoji = '😊';

    const text = `（示例输出）这是基于你的 prompt 的示例回答。\nPrompt: ${prompt || '[空]'}\n\n小提示：部署并在环境变量中添加 OPENAI_API_KEY 即可调用真实模型。`;
    return res.status(200).json({ text, emoji, explain: '示例模式：未配置 OPENAI_API_KEY' });
  }

  try {
    // Call OpenAI Chat Completions (simple example). Adjust model or provider as needed.
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a playful assistant that responds concisely.' },
          { role: 'user', content: prompt || '说一段笑话' }
        ],
        max_tokens: 200,
        temperature: 0.8
      })
    });

    if (!r.ok) {
      const errText = await r.text();
      return res.status(500).json({ text: `模型调用失败：${r.status} ${errText}`, emoji: '💥' });
    }

    const j = await r.json();
    const reply = j.choices?.[0]?.message?.content || JSON.stringify(j);

    // Naive sentiment-like emoji assignment
    let emoji = '🤖';
    if (/笑|笑话|搞笑|🤣|哈哈/.test(reply)) emoji = '🤣';
    if (/悲伤|难过|哭/.test(reply)) emoji = '😢';

    return res.status(200).json({ text: reply, emoji, explain: '来自 OpenAI 生成' });
  } catch (err: any) {
    return res.status(500).json({ text: '服务器错误：' + String(err), emoji: '💥' });
  }
}
