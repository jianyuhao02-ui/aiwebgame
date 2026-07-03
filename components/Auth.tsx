import { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!supabase) return
    async function init() {
      try {
        const { data } = await supabase.auth.getSession()
        setUser(data.session?.user ?? null)
      } catch (e) {
        // ignore
      }

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      return () => {
        try { listener.subscription.unsubscribe() } catch {}
      }
    }
    init()
  }, [])

  async function signIn() {
    if (!email) return alert('请输入邮箱以登录（magic link）')
    setLoading(true)
    try {
      const { error } = await supabase?.auth.signInWithOtp({ email })
      if (error) alert('发送失败：' + error.message)
      else alert('已发送登录链接到邮箱，请查收（演示模式）。')
    } catch (e:any) {
      alert('登录失败：' + String(e.message || e))
    } finally { setLoading(false) }
  }

  async function signOut() {
    try { await supabase?.auth.signOut() } catch {}
  }

  if (!supabase) {
    return <div className="text-sm text-gray-400">未配置 Supabase（启用保存功能请设置 NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_ANON_KEY）</div>
  }

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <div className="text-sm text-gray-600">已登录：{user.email}</div>
          <button onClick={signOut} className="px-2 py-1 border rounded-md">登出</button>
        </>
      ) : (
        <>
          <input className="px-2 py-1 border rounded-md text-sm" placeholder="你的邮箱" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <button onClick={signIn} disabled={loading} className="px-2 py-1 bg-primary text-white rounded-md">登录</button>
        </>
      )}
    </div>
  )
}
