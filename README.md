# Master Your Habit — Habit Tracker

**🔗 Live-Demo:** https://habit-tracker-tau-ecru-29.vercel.app
**📦 Code:** https://github.com/AmirKaloti/habit-tracker

Ein minimalistischer Habit-Tracker im technischen „Orange/Black"-Stil.
Gebaut mit React + TypeScript + Vite. Installierbar als App auf dem Handy (PWA),
funktioniert offline. Daten werden lokal im Browser gespeichert (localStorage) —
kein Server, kein Account nötig.

## Features

- Neuen Habit anlegen
- Mit einem Klick den heutigen Tag abhaken
- Tage rückwirkend nachtragen (Kalender anklicken)
- Streak-Counter (ununterbrochene Tage) neben jedem Habit
- Aktivitäts-Heatmap pro Habit (52 Wochen, GitHub-Stil)
- Statistik-Seite mit Diagrammen (Completions pro Monat)
- Habit bearbeiten: umbenennen
- Kalenderansicht pro Habit: grün = erledigt, heute markiert
- Habit löschen
- Daten bleiben nach dem Neuladen erhalten
- Als App installierbar (PWA) + offline-fähig

## Starten

Voraussetzung: [Node.js](https://nodejs.org) ist installiert.

```bash
npm install      # einmalig: Abhängigkeiten installieren
npm run dev      # Entwicklungs-Server starten (http://localhost:5173)
```

Im Browser `http://localhost:5173` öffnen. Änderungen am Code erscheinen
dank Hot-Reload sofort.

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
│   └── storage.ts        Lesen/Schreiben in localStorage
├── hooks/
│   └── useHabits.ts      Zentraler State: add / toggle / rename / remove
└── components/          Jede Datei = ein UI-Baustein
    ├── Header.tsx        Logo, Datum, "New Habit"-Button
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

- Deployment auf Vercel oder Netlify (klickbarer Live-Link)
- Als PWA installierbar + offline-fähig machen
- Statistik-Dashboard mit Diagrammen und Aktivitäts-Heatmap
- Mehrere Wochentage pro Habit als Ziel definieren
- Backend + Login für Sync über mehrere Geräte
