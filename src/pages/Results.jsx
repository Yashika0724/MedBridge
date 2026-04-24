import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import CategoryPills from '../components/CategoryPills'
import MedicineCard from '../components/MedicineCard'
import medicines from '../data/medicines.json'
import { searchMedicines } from '../lib/search'

export default function Results() {
  const [params, setParams] = useSearchParams()
  const initialQ = params.get('q') || ''
  const initialCat = params.get('category') || null

  const [q, setQ] = useState(initialQ)
  const [debounced, setDebounced] = useState(initialQ)
  const [category, setCategory] = useState(initialCat)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 180)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => {
    const next = new URLSearchParams()
    if (debounced) next.set('q', debounced)
    if (category) next.set('category', category)
    setParams(next, { replace: true })
  }, [debounced, category, setParams])

  const results = useMemo(
    () => searchMedicines(medicines, debounced, category),
    [debounced, category]
  )

  return (
    <section className="section-sm">
      <div className="container">
        <h1 className="section-title" style={{ fontSize: 28, marginTop: 24 }}>
          Find a cheaper equivalent
        </h1>
        <p className="section-sub">
          Start typing a brand name - results update as you go
        </p>

        <SearchBar value={q} onChange={setQ} onSubmit={() => {}} autoFocus />

        <CategoryPills active={category} onSelect={setCategory} />

        <div className="toolbar" style={{ marginTop: 28 }}>
          <div className="count">
            {results.length} {results.length === 1 ? 'match' : 'matches'}
            {category ? ` in ${category}` : ''}
            {debounced ? ` for "${debounced}"` : ''}
          </div>
          {(debounced || category) && (
            <button
              className="btn btn-ghost"
              onClick={() => { setQ(''); setCategory(null) }}
              type="button"
            >
              Clear filters
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="empty">
            <h3>No medicines found</h3>
            <p>Try a different spelling or browse categories above.</p>
          </div>
        ) : (
          <div className="grid">
            {results.map((m, i) => (
              <MedicineCard key={m.id} med={m} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
