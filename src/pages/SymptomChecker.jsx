import { useState } from 'react'
import MedicineCard from '../components/MedicineCard'
import { IconStethoscope, IconSpark } from '../components/Icons'

const EXAMPLES = [
  'mild fever and body ache',
  'acidity and burning after meals',
  'high blood pressure',
  'seasonal cold and runny nose',
  'sugar ki dawa chahiye',
]

export default function SymptomChecker() {
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  async function ask(symptom) {
    const q = (symptom ?? input).trim()
    if (!q) return
    setError('')
    setBusy(true)
    setData(null)
    try {
      const res = await fetch('/api/symptom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptom: q }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Request failed')
      setData(d)
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="section-sm">
      <div className="container" style={{ maxWidth: 820 }}>
        <div className="eyebrow" style={{ marginTop: 24 }}>
          <span className="dot" /> AI symptom → medicine class
        </div>
        <h1 className="section-title" style={{ fontSize: 32 }}>
          Describe what's wrong. See what's commonly prescribed.
        </h1>
        <p className="section-sub">
          Type your symptom in any way — English, Hinglish, or Hindi. We'll explain the common
          molecule class and show generic options so you can talk to a doctor informed.
        </p>

        <form
          className="symptom-form"
          onSubmit={(e) => { e.preventDefault(); ask() }}
        >
          <IconStethoscope size={20} />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. persistent acidity, mild fever, BP issues…"
            autoFocus
          />
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? <span className="spinner" /> : <><IconSpark /> Ask</>}
          </button>
        </form>

        <div className="row" style={{ marginTop: 14, flexWrap: 'wrap', gap: 8 }}>
          <span style={{ color: 'var(--ink-400)', fontSize: 13 }}>Try:</span>
          {EXAMPLES.map((s) => (
            <button
              key={s}
              className="pill"
              type="button"
              style={{ padding: '6px 12px', fontSize: 13 }}
              onClick={() => { setInput(s); ask(s) }}
            >
              {s}
            </button>
          ))}
        </div>

        {error && <div className="error-box" style={{ marginTop: 20 }}>{error}</div>}

        {data && (
          <div style={{ marginTop: 32 }}>
            {data.urgent && (
              <div className="urgent-box">
                This may need urgent medical attention. Please contact a doctor or emergency
                services right away.
              </div>
            )}

            {data.summary && (
              <div className="ai-summary">
                <div className="ai-summary-head">
                  <IconSpark size={16} /> <span>What's commonly prescribed</span>
                </div>
                <p>{data.summary}</p>
                {data.molecules?.length > 0 && (
                  <div className="row" style={{ marginTop: 10, flexWrap: 'wrap' }}>
                    {data.molecules.map((m) => (
                      <span key={m} className="tag">{m}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {data.results?.length > 0 && (
              <>
                <h2 className="section-title" style={{ fontSize: 22, marginTop: 28 }}>
                  Generic options in our catalogue
                </h2>
                <div className="grid">
                  {data.results.map((m, i) => <MedicineCard key={m.id} med={m} index={i} />)}
                </div>
              </>
            )}

            <div className="disclaimer">{data.disclaimer}</div>
          </div>
        )}
      </div>
    </section>
  )
}
