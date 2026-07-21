// Login-Bildschirm (Magic Link). Erscheint nur, wenn Cloud-Sync eingerichtet ist
// und der Nutzer weder eingeloggt ist noch "Ohne Login weitermachen" gewählt hat.

import { useState } from 'react'

interface LoginScreenProps {
  onSendLink: (email: string) => Promise<{ error: string | null }>
  onSkip: () => void
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function LoginScreen({ onSendLink, onSkip }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function submit() {
    const clean = email.trim()
    if (!clean || status === 'sending') return
    setStatus('sending')
    const { error } = await onSendLink(clean)
    if (error) {
      setErrorMsg(error)
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-icon">◎</div>
        <h2 className="login-title">EINLOGGEN</h2>
        <p className="login-text">
          Mit Login werden deine Habits, Kategorien und Wochenziele auf jedem Gerät
          synchron gehalten. Kein Passwort nötig — du bekommst einen Login-Link per Mail.
        </p>

        {status === 'sent' ? (
          <div className="login-sent">
            ✓ Link geschickt an <strong>{email}</strong> — schau in dein Postfach.
          </div>
        ) : (
          <div className="login-form">
            <input
              className="j-input"
              type="email"
              placeholder="DEINE@EMAIL.DE"
              value={email}
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            <button className="j-btn" onClick={submit} disabled={status === 'sending'}>
              {status === 'sending' ? 'SENDE…' : 'LINK SENDEN'}
            </button>
          </div>
        )}

        {status === 'error' && <div className="login-error">✕ {errorMsg}</div>}

        <button className="j-btn j-btn-ghost login-skip" onClick={onSkip}>
          OHNE LOGIN WEITERMACHEN →
        </button>
      </div>
    </div>
  )
}
