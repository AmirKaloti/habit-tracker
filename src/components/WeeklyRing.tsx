// Kleiner Fortschritts-Ring für das Wochenziel (statt Text).
// Zeigt in der Mitte "erledigt/ziel" und füllt den Ring entsprechend.

interface WeeklyRingProps {
  done: number
  goal: number
  color: string
}

const R = 18
const CIRC = 2 * Math.PI * R

export function WeeklyRing({ done, goal, color }: WeeklyRingProps) {
  const ratio = Math.min(1, done / goal)
  const reached = done >= goal
  const stroke = reached ? 'var(--success)' : color

  return (
    <div className="week-ring-wrap">
      <div className="week-ring" title={`Wochenziel: ${done}/${goal} diese Woche`}>
        <svg viewBox="0 0 42 42" className="week-ring-svg">
          <circle className="week-ring-bg" cx="21" cy="21" r={R} />
          <circle
            className="week-ring-fg"
            cx="21"
            cy="21"
            r={R}
            style={{
              stroke,
              strokeDasharray: CIRC,
              strokeDashoffset: CIRC * (1 - ratio),
            }}
          />
        </svg>
        <span
          className="week-ring-num"
          style={{ color: reached ? 'var(--success)' : color }}
        >
          {done}/{goal}
        </span>
      </div>
      <div className="week-ring-lbl">WOCHE</div>
    </div>
  )
}
