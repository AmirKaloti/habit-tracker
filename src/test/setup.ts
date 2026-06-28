// Wird vor jeder Testdatei geladen.
// Fügt zusätzliche Matcher hinzu, z. B. expect(...).toBeInTheDocument()
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Nach jedem Test das gerenderte DOM aufräumen, damit Tests sich nicht beeinflussen.
afterEach(() => {
  cleanup()
})
