"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Sprout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/supabase-auth"

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [signupDone, setSignupDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password)
        router.push("/")
      } else {
        await signUpWithEmail(email, password)
        setSignupDone(true)
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen bg-background md:grid-cols-2">
      {/* Field photo */}
      <div className="relative h-[38vh] overflow-hidden md:h-auto">
        <Image
          src="/login-bg.webp"
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 max-w-md p-6 md:p-10">
          <h2 className="font-heading text-2xl font-semibold leading-tight text-white md:text-3xl">
            Know your field. Grow with confidence.
          </h2>
          <p className="mt-2 text-sm text-white/80 md:text-base">
            Crop guidance, fertilizer plans, weather alerts, and market prices — built around the land you farm.
          </p>

          <div className="mt-6 flex items-center gap-3 border-t border-white/20 pt-5">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/30">
              <Image src="/testimonials/ravi-kumar.jpg" alt="" fill sizes="40px" className="object-cover" />
            </div>
            <div>
              <p className="text-sm text-white/90">
                The fertilizer suggestions saved me two trips to the shop this season.
              </p>
              <p className="mt-0.5 text-xs text-white/60">Ravi Kumar, cotton farmer — Nagpur</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth form */}
      <div className="flex items-center justify-center px-6 py-12 md:px-16">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8 flex items-center gap-2">
            <Sprout className="size-5 text-primary" />
            <span className="font-heading text-base font-semibold text-foreground">Agro Vision</span>
          </div>

          <h1 className="mb-1 font-heading text-2xl font-semibold text-foreground">
            {mode === "signin" ? "Log in to Agro Vision" : "Create your account"}
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            {mode === "signin" ? "Welcome back, farmer." : "Let's get your fields set up."}
          </p>

          {signupDone ? (
            <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">
              Account created! Check your email to confirm, then log in.
            </p>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="mb-4 w-full justify-center"
                onClick={signInWithGoogle}
              >
                Continue with Google
              </Button>

              <div className="mb-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-input bg-input/30 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-input bg-input/30 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                />

                {error ? <p className="text-sm text-destructive">{error}</p> : null}

                <Button type="submit" size="lg" disabled={loading} className="w-full justify-center">
                  {loading ? "Please wait…" : mode === "signin" ? "Log in" : "Sign up"}
                </Button>
              </form>

              <p className="mt-4 text-sm text-muted-foreground">
                {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "signin" ? "signup" : "signin")
                    setError(null)
                  }}
                  className="font-medium text-primary hover:underline"
                >
                  {mode === "signin" ? "Create an account" : "Log in"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
