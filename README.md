# HABITRON — Habit Tracker

Ein minimalistischer Habit-Tracker im „Jarvis"-Stil (Dunkelblau, technisch).
Gebaut mit React + TypeScript + Vite. Daten werden lokal im Browser gespeichert
(localStorage) — kein Server, kein Account nötig.

## Features

- Neuen Habit anlegen
- Mit einem Klick den heutigen Tag abhaken
- Streak-Counter (ununterbrochene Tage) neben jedem Habit
- Habit bearbeiten: umbenennen
- Kalenderansicht pro Habit: grün = erledigt, rot = verpasst, heute markiert
- Habit löschen
- Daten bleiben nach dem Neuladen erhalten

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
npm run build    # fertige, optimierte Version nach dist/ bauen
npm run preview  # die gebaute Version lokal testen
```

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

- Tests mit Vitest für `lib/streak.ts` und `lib/date.ts`
- Mehrere Wochentage pro Habit als Ziel definieren
- Backend + Login für Sync über mehrere Geräte
- Deployment (z. B. Vercel oder Netlify)
