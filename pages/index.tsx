import { useState } from 'react'

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [emoji, setEmoji] = useState('🤖');
  const [explain, setExplain] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setResult('');
    setEmoji('⏳');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setResult(data.text ?? '（无返回）');
      setEmoji(data.emoji ?? '🤖');
      setExplain(data.explain ?? '');
    } catch (err) {
      setResult('请求失败：' + String(err));
      setEmoji('💥');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <header className="flex items-center gap-4">
          <div className="text-4xl">🪄</div>
          <div>
            <h1 className="text-2xl font-bold">AI 小精灵 — Prompt Playground</h1>
            <p className="text-sm text-gray-500">给小精灵一句话，它会用情绪告诉你效果如何（试试写个笑话 prompt）</p>
          </div>
        </header>

        <section className="mt-6">
          <label className="block text-sm font-medium text-gray-700">你的 Prompt</label>
          <textarea
            className="mt-2 w-full h-32 p-3 border rounded-md"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如：请用亲切幽默的口吻写一个两段笑话，主题是猫和咖啡"
          />

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
            >{loading ? '生成中…' : '生成'}</button>
            <button
              onClick={() => { setPrompt('请用亲切幽默的口吻写一个两段笑话，主题是猫和咖啡') }}
              className="px-4 py-2 border rounded-md"
            >示例 Prompt</button>
          </div>
        </section>

        <section className="mt-6 flex items-start gap-4">
          <div className="text-6xl">{emoji}</div>
          <div className="flex-1">
            <div className="bg-gray-50 p-4 rounded-md min-h-[72px]">
              <div className="whitespace-pre-wrap">{result || '结果会在这里显示'}</div>
            </div>
            {explain && <p className="mt-2 text-sm text-gray-500">解释：{explain}</p>}
          </div>
        </section>

        <footer className="mt-6 text-xs text-gray-400">提示：未配置 OPENAI_API_KEY 会返回示例输出，完整体验请在部署平台配置环境变量。</footer>
      </div>
    </main>
  )
}
