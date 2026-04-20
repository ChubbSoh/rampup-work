'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputCls =
  'w-full font-poppins text-sm text-[#2D2D2D] bg-[#F7F7F7] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:border-[#3DBE5A] focus:ring-2 focus:ring-[#3DBE5A]/20 transition placeholder:text-[#AAAAAA]'

export default function ControlLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)

    const res = await fetch('/api/control-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/control')
    } else {
      setError(true)
      setPassword('')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#EDEDED] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm px-8 py-10 w-full max-w-sm space-y-6">
        <div className="space-y-1">
          <p className="font-poppins text-[11px] font-bold text-[#3DBE5A] uppercase tracking-[2px]">
            RampUp
          </p>
          <h1 className="font-sora font-extrabold text-2xl text-[#2D2D2D] tracking-tight">
            Control Panel
          </h1>
          <p className="font-poppins text-sm text-[#888888]">Agency use only.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-poppins text-[12px] font-semibold text-[#888888] uppercase tracking-[1px]">
              Password
            </label>
            <input
              type="password"
              className={`${inputCls} ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
              placeholder="••••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false) }}
              autoFocus
              required
              disabled={loading}
            />
            {error && (
              <p className="font-poppins text-xs text-red-500 mt-1">Access denied.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3DBE5A] text-white font-poppins font-semibold text-sm px-6 py-3 rounded-full hover:brightness-105 transition-all active:scale-[0.97] disabled:opacity-60"
          >
            {loading ? 'Checking…' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  )
}
