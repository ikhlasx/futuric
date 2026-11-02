import { useEffect, useState } from 'react'
import { ScrollTrigger } from './motion'

// Returns the element in `selector` that covers the horizontal line `y` px from the top
// of the viewport (the innermost match wins). Measured from live rects on every scroll, so pins and jumps can't desync it.
export function useActiveSection(selector, y, pick) {
  const [value, setValue] = useState(null)

  useEffect(() => {
    const check = () => {
      const line = typeof y === 'function' ? y() : y
      const hit = [...document.querySelectorAll(selector)].findLast((el) => {
        const r = el.getBoundingClientRect()
        return r.top <= line && r.bottom > line
      })
      setValue(hit ? pick(hit) : null)
    }
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: check, onRefresh: check })
    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => {
      st.kill()
      window.removeEventListener('scroll', check)
    }
  }, [selector, y, pick])

  return value
}
