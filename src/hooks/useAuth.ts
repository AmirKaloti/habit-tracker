// Hält den Login-Status (Supabase Auth, Magic Link). Ohne konfigurierte
// Supabase-Umgebungsvariablen (cloudEnabled = false) bleibt `user` immer null
// und die App verhält sich wie zuvor rein lokal.

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase, cloudEnabled } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(cloudEnabled)

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  // Schickt einen Magic Link an die angegebene E-Mail-Adresse.
  async function sendMagicLink(email: string): Promise<{ error: string | null }> {
    if (!supabase) return { error: 'Cloud-Sync ist nicht eingerichtet.' }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    return { error: error?.message ?? null }
  }

  async function signOut() {
    await supabase?.auth.signOut()
  }

  return { user, loading, cloudEnabled, sendMagicLink, signOut }
}
