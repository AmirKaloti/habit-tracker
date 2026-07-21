// Supabase-Client für Login (Magic Link) + Cloud-Speicherung.
// URL + Key kommen aus Umgebungsvariablen (siehe .env.example) — beide sind
// clientseitig sichtbar, das ist bei Supabase so vorgesehen. Der eigentliche
// Schutz kommt über Row-Level-Security in der Datenbank, nicht über Geheimhaltung.

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Cloud-Sync ist optional: ohne konfigurierte Umgebungsvariablen läuft die
// App weiterhin rein lokal (kein Login-Bildschirm, kein Fehler).
export const cloudEnabled = Boolean(url && anonKey)

export const supabase = cloudEnabled ? createClient(url, anonKey) : null
