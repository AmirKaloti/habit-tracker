# Master Your Habit — Habit Tracker

**🔗 Live-Demo:** https://habit-tracker-tau-ecru-29.vercel.app
**📦 Code:** https://github.com/AmirKaloti/habit-tracker

Ein minimalistischer Habit-Tracker im technischen „Orange/Black"-Stil.
Gebaut mit React + TypeScript + Vite. Installierbar als App auf dem Handy (PWA),
funktioniert offline. Daten werden lokal im Browser gespeichert (localStorage) —
optional zusätzlich in der Cloud (Supabase), wenn man sich per Magic Link einloggt.
Login ist nie Pflicht: "Ohne Login weitermachen" funktioniert genau wie bisher.

## Features

- Neuen Habit anlegen
- Mit einem Klick den heutigen Tag abhaken
- Tage rückwirkend nachtragen (Kalender anklicken)
- Streak-Counter (ununterbrochene Tage) neben jedem Habit
- Completion-Rate pro Habit (z. B. „27/30 in den letzten 30 Tagen") mit Motivations-Text
- Aktivitäts-Heatmap pro Habit (52 Wochen, GitHub-Stil)
- Statistik-Seite mit Diagrammen (Completions pro Monat)
- Drei Bereiche: ACTIVE (aktive Habits), STATS (Statistiken), DRAFTS (Ideen-Speicher)
- Habit-Ideen als Entwürfe sammeln und später aktivieren
- Habit bearbeiten: umbenennen
- Kalenderansicht pro Habit: grün = erledigt, heute markiert
- Habit löschen
- Daten bleiben nach dem Neuladen erhalten
- Als App installierbar (PWA) + offline-fähig
- Kategorien (aufklappbare Gruppen), Wochenziele, Drag & Drop zum Sortieren/Umkategorisieren
- Export/Import als JSON-Datei (Backup)
- Optionaler Login (Magic Link) für Cloud-Sync über mehrere Geräte hinweg

## Starten

Voraussetzung: [Node.js](https://nodejs.org) ist installiert.

```bash
npm install      # einmalig: Abhängigkeiten installieren
npm run dev      # Entwicklungs-Server starten (http://localhost:5173)
```

Im Browser `http://localhost:5173` öffnen. Änderungen am Code erscheinen
dank Hot-Reload sofort.

## Cloud-Sync einrichten (optional)

Ohne weitere Schritte läuft die App komplett lokal (wie bisher). Für Login +
Sync über mehrere Geräte:

1. Kostenloses Projekt auf [supabase.com](https://supabase.com) anlegen.
2. Im SQL-Editor des Projekts folgendes einfügen und ausführen:
   ```sql
   create table habit_data (
     user_id uuid primary key references auth.users(id) on delete cascade,
     habits jsonb not null default '[]',
     updated_at timestamptz not null default now()
   );
   alter table habit_data enable row level security;
   create policy "user reads own data" on habit_data for select using (auth.uid() = user_id);
   create policy "user writes own data" on habit_data for all using (auth.uid() = user_id);
   ```
3. Unter **Project Settings → API** die **Project URL** und den **anon public
   key** kopieren.
4. `.env.example` zu `.env.local` kopieren und beide Werte eintragen.
5. Dev-Server neu starten (`npm run dev`) — jetzt erscheint beim Start ein
   Login-Bildschirm (Magic Link per E-Mail).
6. Für die Produktion (Vercel): dieselben zwei Werte unter _Project Settings →
   Environment Variables_ eintragen, und in Supabase unter _Auth → URL
   Configuration_ die Vercel-Domain als erlaubte Redirect-URL hinzufügen.

## Weitere Befehle

```bash
npm run build         # fertige, optimierte Version nach dist/ bauen
npm run preview       # die gebaute Version lokal testen

npm test              # Tests im Watch-Modus (Vitest)
npm run test:run      # Tests einmal durchlaufen
npm run coverage      # Tests + Coverage-Report (Ordner coverage/)

npm run lint          # Code auf Fehler prüfen (oxlint)
npm run format        # Code automatisch formatieren (Prettier)
npm run typecheck     # nur die Typen prüfen, ohne zu bauen
```

## Qualitätssicherung & Tooling

Dieses Projekt nutzt denselben Prozess wie professionelle Teams:

- **Tests (Vitest):** Die Logik in `src/lib/` (Streak-Berechnung, Datums-Helfer,
  Speicherung) und die Komponenten sind durch automatische Tests abgesichert.
  Zeit-abhängige Tests „frieren" das Datum ein (`vi.setSystemTime`), damit sie
  reproduzierbar sind.
- **TypeScript strict:** Maximale Typsicherheit — viele Fehler werden schon vor
  dem Start abgefangen.
- **oxlint:** Schneller Linter, der typische Fehlerquellen aufspürt.
- **Prettier:** Einheitliche Code-Formatierung, automatisch.
- **Pre-commit-Hook (Husky + lint-staged):** Vor jedem Commit werden geänderte
  Dateien automatisch formatiert und gelintet — so kommt nie unsauberer Code ins
  Repository.
- **CI-Pipeline (GitHub Actions):** Bei jedem Push laufen automatisch Lint,
  Format-Check, Typprüfung, Tests und Build (`.github/workflows/ci.yml`).

## Projektstruktur

```
src/
├── main.tsx              React-Einstiegspunkt
├── App.tsx               Haupt-Layout, verteilt den State an die Komponenten
├── index.css            Globale Styles + Jarvis-Theme (Farben als CSS-Variablen)
├── types/
│   └── habit.ts          Die zentrale Datenstruktur (Habit)
├── lib/                  Reine Logik, ohne React — leicht testbar
│   ├── date.ts           Datums-Helfer (Schlüssel, Wochentage, Monate)
│   ├── streak.ts         Streak-Berechnung
│   ├── storage.ts        Lesen/Schreiben in localStorage (+ Sicherheitsnetz-Backup)
│   ├── cloudStorage.ts   Lesen/Schreiben in Supabase (eine Zeile pro Nutzer)
│   └── supabase.ts       Supabase-Client (aus Umgebungsvariablen)
├── hooks/
│   ├── useHabits.ts      Zentraler State: add / toggle / rename / remove / Cloud-Sync
│   └── useAuth.ts        Login-Status (Magic Link), signIn/signOut
└── components/          Jede Datei = ein UI-Baustein
    ├── Header.tsx        Logo, Datum, "New Habit"-Button, Login/Logout
    ├── LoginScreen.tsx   Login-Bildschirm (Magic Link)
    ├── StatsBar.tsx      Kennzahlen oben
    ├── NewHabitForm.tsx  Eingabe für neuen Habit
    ├── HabitList.tsx     Liste + Leerzustand
    ├── HabitCard.tsx     Eine Habit-Zeile
    ├── EditModal.tsx     Bearbeiten-Dialog
    └── Calendar.tsx      Monats-Kalender
```

### Grundprinzip

Logik (`lib/`) ist von der Darstellung (`components/`) getrennt. Den gesamten
Zustand verwaltet ein einziger Hook (`useHabits`) — das ist die „eine Quelle der
Wahrheit". Komponenten bekommen Daten und Funktionen als Props übergeben.

## Mögliche nächste Schritte

- Tägliche Erinnerung (Browser-Push)
- Jahres-Rückblick ("Year in Pixels")
- Habit-Vorlagen beim Anlegen
- Kleine Einblicke (z. B. stärkster Wochentag)
- Theme-Umschalter (hell/dunkel)
