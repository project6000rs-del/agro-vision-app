"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { saveSession } from "@/lib/supabase-auth"

const SUPABASE_URL = "https://zjvlghjtlxoecnjbskln.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdmxnaGp0bHhvZWNuamJza2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2ODUzNTEsImV4cCI6MjEwNDI2MTM1MX0.9Gywe5jvuG3EwUosOjJTcJi5nsASr9BB8vhLVrnVXOU"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    async function finishLogin() {
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      const access_token = params.get("access_token")
      const refresh_token = params.get("refresh_token")

      if (!access_token || !refresh_token) {
        router.replace("/login?error=missing_token")
        return
      }

      const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${access_token}` },
      })
      const user = await userRes.json()

      saveSession({ access_token, refresh_token, user })
      router.replace("/")
    }

    finishLogin()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Signing you in…</p>
    </div>
  )
}
