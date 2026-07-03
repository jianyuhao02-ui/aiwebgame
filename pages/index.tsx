import { useEffect, useRef, useState } from 'react'
import { templates } from '../data/templates'
import TemplateCard from '../components/TemplateCard'
import MyAppPanel from '../components/MyAppPanel'
import ExportButton from '../components/ExportButton'
import Auth from '../components/Auth'
import supabase from '../lib/supabaseClient'

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [emoji, setEmoji] = useState('🪄');
  const [explain, setExplain] = useState('');
  const [mascot, setMascot] = useState<'cat'|'dog'>('cat');
  const [audioOn, setAudioOn] = useState(true);
  const [animateEmoji, setAnimateEmoji] = useState(false);
  const [mascotState, setMascotState] = useState<'idle'|'happy'|'sad'>('idle');
  const [myItems, setMyItems] = useState<typeof templates>([]);
  const [savedPets, setSavedPets] = useState<any[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const lottieRef = useRef<any>(null);
  const animRef = useRef<any>(null);

  useEffect(() => {
    try {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      audioCtxRef.current = null;
    }
  }, []);

  useEffect(() => {
    // load lottie and play animation based on mascotState using local files
    let mounted = true;
    async function load() {
      const lottie = (await import('lottie-web'))?.default;
      if (!lottie || !mounted) return;
      const container = lottieRef.current;
      if (!container) return;
      let path = '/animations/idle.json';
      if (mascotState === 'happy') path = '/animations/happy.json';
      if (mascotState === 'sad') path = '/animations/sad.json';

      if (animRef.current) {
        try { animRef.current.destroy(); } catch {}
      }

      animRef.current = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path
      });
    }
    load();
    return () => { mounted = false; if (animRef.current) try { animRef.current.destroy(); } catch {} };
  }, [mascotState]);

  async function fetchSaved() {
    // try Supabase client list via serverless GET /api/load which uses anon key
    try {
      const r = await fetch('/api/load');
      const j = await r.json();
      if (r.ok && j.data) setSavedPets(j.data);
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => { fetchSaved(); }, []);

  function playTone(type: 'happy'|'sad'|'error') {
    if (!audioOn) return;
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    try {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      if (type === 'happy') { o.frequency.value = 880; g.gain.value = 0.02; }
      if (type === 'sad') { o.frequency.value = 220; g.gain.value = 0.02; }
      if (type === 'error') { o.frequency.value = 120; g.gain.value = 0.04; }
      o.type = 'sine';
      o.start();
      const now = ctx.currentTime;
      g.gain.setValueAtTime(g.gain.value, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      o.stop(now + 0.36);
    } catch (e) {
      // ignore
    }
  }

  async function handleGenerate() {
    setLoading(true);
    setResult('');
    setEmoji('⏳');
    setAnimateEmoji(true);
    setMascotState('idle');

    try {
      // Before showing result, call emotion classifier to improve mascot state
      const emoRes = await fetch('/api/emotion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: prompt }) });
      const emoJson = await emoRes.json();
      if (emoRes.ok && emoJson.emotion) {
        if (emoJson.emotion === 'happy' || emoJson.emotion === 'funny') setMascotState('happy');
        else if (emoJson.emotion === 'sad') setMascotState('sad');
        else setMascotState('idle');
        setEmoji(emoJson.emoji || '🤖');
        setExplain(emoJson.explain || '');
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      const reply = data.text ?? '（无返回）';
      setResult(reply);

      // play tone based on mascotState
      if (mascotState === 'happy') playTone('happy');
      else if (mascotState === 'sad') playTone('sad');
      else playTone('happy');

      setAnimateEmoji(true);
      setTimeout(() => setAnimateEmoji(false), 700);
    } catch (err) {
      setResult('请求失败：' + String(err));
      setEmoji('💥');
      setMascotState('sad');
      playTone('error');
    } finally {
      setLoading(false);
      setTimeout(() => setMascotState('idle'), 1200);
    }
  }

  function useTemplate(content: string) {
    setPrompt(content);
  }

  function handleDropToMyApp(id: string) {
    const t = templates.find(x => x.id === id);
    if (!t) return;
    setMyItems(prev => prev.some(x => x.id === id) ? prev : [...prev, t]);
  }

  function removeItem(id: string) {
    setMyItems(prev => prev.filter(x => x.id !== id));
  }

  async function savePet() {
    const name = window.prompt('给你的宠物/微应用起个名字：') || ('pet-' + Date.now());
    try {
      const res = await fetch('/api/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, prompt, myItems, mascot }) });
      const j = await res.json();
      if (!res.ok) return alert('保存失败：' + (j.error || JSON.stringify(j)));
      alert('保存成功');
      fetchSaved();
    } catch (e) { alert('保存失败：' + String(e)); }
  }

  async function loadPet(pet:any) {
    if (!pet) return;
    setPrompt(pet.prompt || '');
    setMyItems(pet.my_items || []);
    setMascot(pet.mascot || 'cat');
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <div className="card flex items-center gap-4">
          <div className="w-24 h-24 flex items-center justify-center rounded-lg" style={{background: 'linear-gradient(135deg,var(--color-cream),white)'}}>
            <div style={{width:96, height:96}} ref={lottieRef}></div>
          </div>
          <div>
            <h1 className="title text-3xl">AI 小精灵</h1>
            <p className="text-sm text-gray-500">通过拖拽魔法卡和一句话，喂养你的 AI 宠物。把卡片拖进「我的应用面板」来组合你的微型应用。</p>
          </div>

          <div className="ml-auto flex flex-col items-end gap-2">
            <div className="text-xs text-gray-500">账户</div>
            <Auth />
          </div>
        </div>

        {/* Templates panel */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">魔法卡片 — 点击或拖拽使用</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {templates.map(t => (
              <div key={t.id} className="flex-shrink-0">
                <TemplateCard t={t} onUse={useTemplate} />
              </div>
            ))}
          </div>
        </div>

        <MyAppPanel items={myItems} onRemove={removeItem} onDrop={handleDropToMyApp} />

        <div className="mt-6 card">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">你的 Prompt</label>
            <div className="flex items-center gap-2">
              <ExportButton prompt={prompt} myItems={myItems} mascot={mascot} audioOn={audioOn} />
            </div>
          </div>

          <textarea
            className="mt-2 w-full h-32 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="或者点击/拖拽上方卡片快速开始"
          />

          <div className="mt-4 flex gap-2 items-center">
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
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={audioOn} onChange={(e) => setAudioOn(e.target.checked)} />
                <span>音效</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 card flex items-start gap-4">
          <div className={`text-7xl emoji ${animateEmoji ? 'animate' : ''}`}>{emoji}</div>
          <div className="flex-1">
            <div className="bg-gray-50 p-4 rounded-md min-h-[72px]">
              <div className="whitespace-pre-wrap">{result || '结果会在这里显示'}</div>
            </div>
            {explain && <p className="mt-2 text-sm text-gray-500">解释：{explain}</p>}
          </div>
        </div>

        <div className="mt-6 flex gap-2 justify-center">
          <button onClick={savePet} className="px-4 py-2 rounded-full bg-mint text-white">保存宠物</button>
          <button className="px-4 py-2 rounded-full border">分享</button>
        </div>

        <div className="mt-6 card">
          <h3 className="font-semibold mb-2">已保存的宠物（最近）</h3>
          {savedPets.length === 0 ? (
            <div className="text-sm text-gray-400">暂无已保存的宠物</div>
          ) : (
            <div className="flex flex-col gap-2">
              {savedPets.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-gray-500">{new Date(p.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => loadPet(p)} className="px-2 py-1 border rounded-md">载入</button>
                    <a href={`/api/load?id=${p.id}`} className="px-2 py-1 border rounded-md">查看</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-6 text-xs text-gray-400 text-center">预览模式 — 真实体验需在环境变量中配置 OPENAI_API_KEY</p>
      </div>
    </main>
  )
}
