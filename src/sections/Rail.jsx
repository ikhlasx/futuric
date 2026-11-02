import { ventures } from '../lib/content'
import { scrollToId } from '../lib/motion'
import { useActiveSection } from '../lib/useActiveSection'

const selector = ventures.map((v) => `#${v.id}`).join(', ')
const middle = () => window.innerHeight / 2
const idOf = (el) => el.id

// Right-hand progress rail: shows which venture world the visitor is in.
export default function Rail() {
  const active = useActiveSection(selector, middle, idOf)

  return (
    <nav className={`rail${active ? ' on' : ''}`} aria-label="Ventures">
      {ventures.map((v, i) => (
        <button key={v.id} aria-current={active === v.id} onClick={() => scrollToId(v.id)}>
          {/* client-requested numbering, taste-skill-ignore */}
          <span className="label">{String(i + 1).padStart(2, '0')} {v.name}</span>
          <span className="bar" aria-hidden="true" />
        </button>
      ))}
    </nav>
  )
}
