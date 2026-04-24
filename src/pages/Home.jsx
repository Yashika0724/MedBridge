import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import CategoryPills from '../components/CategoryPills'
import MedicineCard from '../components/MedicineCard'
import medicines from '../data/medicines.json'
import { IconCamera, IconMic, IconStethoscope, IconSpark, IconArrowRight } from '../components/Icons'

const TRENDING = ['Crocin', 'Dolo 650', 'Augmentin', 'Telma', 'Pan D', 'Shelcal']

export default function Home() {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState(null)
  const navigate = useNavigate()

  const handleSearch = (value) => {
    const params = new URLSearchParams()
    if (value) params.set('q', value)
    navigate(`/search?${params.toString()}`)
  }

  const pickCategory = (c) => {
    setCategory(c)
    const params = new URLSearchParams()
    if (c) params.set('category', c)
    navigate(`/search?${params.toString()}`)
  }

  const featured = medicines
    .slice()
    .sort((a, b) => (b.brandedPrice - b.genericPrice) - (a.brandedPrice - a.genericPrice))
    .slice(0, 6)

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="eyebrow fade-in">
            <span className="dot" /> Powered by Jan Aushadhi data
          </div>
          <h1 className="fade-in fade-in-delay-1">
            Stop overpaying for <span className="accent">medicines</span>.
          </h1>
          <p className="sub fade-in fade-in-delay-2">
            Find affordable generic alternatives to branded medicines.
            Same molecule. Same quality. A fraction of the price.
          </p>

          <div className="fade-in fade-in-delay-3" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <SearchBar value={q} onChange={setQ} onSubmit={handleSearch} />
          </div>

          <div className="row" style={{ marginTop: 18, justifyContent: 'center' }}>
            <span style={{ color: 'var(--ink-400)', fontSize: 13 }}>Try:</span>
            {TRENDING.map((t) => (
              <button
                key={t}
                className="pill"
                style={{ padding: '6px 12px', fontSize: 13 }}
                onClick={() => handleSearch(t)}
                type="button"
              >
                {t}
              </button>
            ))}
          </div>

          <div className="stats">
            <div className="stat">
              <div className="value">2,000+</div>
              <div className="label">Medicines indexed across categories</div>
            </div>
            <div className="stat">
              <div className="value">Up to 90%</div>
              <div className="label">Savings on common prescriptions</div>
            </div>
            <div className="stat">
              <div className="value">CDSCO</div>
              <div className="label">Government-approved generics</div>
            </div>
            <div className="stat">
              <div className="value">16,000+</div>
              <div className="label">Jan Aushadhi stores across India</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="toolbar" style={{ marginBottom: 20 }}>
            <div>
              <h2 className="section-title" style={{ fontSize: 24 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <IconSpark size={20} /> New — AI-powered tools
                </span>
              </h2>
              <p className="section-sub" style={{ marginBottom: 0 }}>
                Four ways to find what you actually need.
              </p>
            </div>
          </div>
          <div className="ai-grid">
            <Link to="/scan" className="ai-card">
              <div className="ai-icon"><IconCamera size={22} /></div>
              <div className="ai-title">Scan prescription</div>
              <div className="ai-desc">Photograph a doctor's prescription — we read it and find generic equivalents.</div>
              <div className="ai-cta">Open scanner <IconArrowRight /></div>
            </Link>
            <Link to="/ask" className="ai-card">
              <div className="ai-icon"><IconStethoscope size={22} /></div>
              <div className="ai-title">Symptom → medicine</div>
              <div className="ai-desc">Describe a symptom and see the molecule class commonly prescribed for it.</div>
              <div className="ai-cta">Ask AI <IconArrowRight /></div>
            </Link>
            <div className="ai-card" onClick={() => document.querySelector('.search input')?.focus()} role="button" tabIndex={0}>
              <div className="ai-icon"><IconMic size={22} /></div>
              <div className="ai-title">Voice search</div>
              <div className="ai-desc">Tap the mic in the search bar. Speak in Hindi, English, or any Indian language.</div>
              <div className="ai-cta">Try it above <IconArrowRight /></div>
            </div>
            <div className="ai-card" onClick={() => handleSearch('crocine')} role="button" tabIndex={0}>
              <div className="ai-icon"><IconSpark size={22} /></div>
              <div className="ai-title">Smart search</div>
              <div className="ai-desc">Misspellings, regional names, and plain descriptions all work now.</div>
              <div className="ai-cta">See it in action <IconArrowRight /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Browse by category</h2>
          <p className="section-sub">Pick a condition to see cheaper equivalents for what you already buy.</p>
          <CategoryPills active={category} onSelect={pickCategory} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="toolbar">
            <div>
              <h2 className="section-title" style={{ fontSize: 24 }}>Biggest savings right now</h2>
              <p className="section-sub" style={{ marginBottom: 0 }}>Where switching to a generic makes the most difference.</p>
            </div>
            <button className="btn btn-ghost" onClick={() => navigate('/search')} type="button">
              View all medicines
            </button>
          </div>

          <div className="grid">
            {featured.map((m, i) => (
              <MedicineCard key={m.id} med={m} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
