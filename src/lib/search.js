// Lightweight fuzzy-ish search: splits query into tokens and requires
// every token to appear as a substring somewhere in the medicine's text.
export function searchMedicines(list, query, category) {
  let results = list

  if (category) {
    results = results.filter((m) => m.category === category)
  }

  const q = (query || '').trim().toLowerCase()
  if (!q) return results

  const tokens = q.split(/\s+/).filter(Boolean)

  const scored = results
    .map((m) => {
      const haystack = [
        m.branded,
        m.generic,
        m.composition,
        m.brandCompany,
        m.uses,
        m.category,
      ]
        .join(' ')
        .toLowerCase()

      const everyMatch = tokens.every((t) => haystack.includes(t))
      if (!everyMatch) return null

      // Score: prioritize matches against the branded name, then generic, then rest.
      let score = 0
      const branded = m.branded.toLowerCase()
      const generic = m.generic.toLowerCase()
      if (branded.startsWith(q)) score += 100
      if (branded.includes(q)) score += 40
      if (generic.includes(q)) score += 20
      tokens.forEach((t) => {
        if (branded.includes(t)) score += 10
        if (generic.includes(t)) score += 5
      })
      return { m, score }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)

  return scored.map((s) => s.m)
}

export function useDebounced(value, delay = 180) {
  // Not a hook — just a simple helper. Actual debouncing uses useEffect in caller.
  return value
}
