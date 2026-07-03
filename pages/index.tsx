import { useState } from 'react'

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [emoji, setEmoji] = useState('🪄');
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
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="card flex items-center gap-4">
          <div className="w-20 h-20 flex items-center justify-center rounded-lg" style={{background: 'linear-gradient(135deg,var(--color-cream),white)'}}>
            <div className="text-4xl">🐣</div>
          </div>
          <div>
            <h1 className="title text-3xl">AI 小精灵</h1>
            <p className="text-sm text-gray-500">通过拖拽魔法卡和一句话，喂养你的 AI 宠物。试试写个笑话 prompt。</p>
          </div>
        </div>

        <div className="mt-6 card">
          <label className="block text-sm font-medium text-gray-700">你的 Prompt</label>
          <textarea
            className="mt-2 w-full h-32 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如：请用亲切幽默的口吻写一个两段笑话，主题是猫和咖啡"
          />

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary"
            >{loading ? '生成中…' : '生成'}</button>
            <button
              onClick={() => { setPrompt('请用亲切幽默的口吻写一个两段笑话，主题是猫和咖啡') }}
              className="px-4 py-2 border rounded-md"
            >示例 Prompt</button>

            <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
              <div className="bg-cream px-3 py-1 rounded-full">情绪：{emoji}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 card flex items-start gap-4">
          <div className="text-7xl">{emoji}</div>
          <div className="flex-1">
            <div className="bg-gray-50 p-4 rounded-md min-h-[72px]">
              <div className="whitespace-pre-wrap">{result || '结果会在这里显示'}</div>
            </div>
            {explain && <p className="mt-2 text-sm text-gray-500">解释：{explain}</p>}
          </div>
        </div>

        <div className="mt-6 flex gap-2 justify-center">
          <button className="px-4 py-2 rounded-full bg-mint text-white">保存宠物</button>
          <button className="px-4 py-2 rounded-full border">分享</button>
        </div>

        <p className="mt-6 text-xs text-gray-400 text-center">预览模式 — 真实体验需在环境变量中配置 OPENAI_API_KEY</p>
      </div>
    </main>
  )
}
