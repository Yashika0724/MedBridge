import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconCamera, IconUpload, IconArrowRight } from '../components/Icons'

export default function ScanPrescription() {
  const fileRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleFile(file) {
    if (!file) return
    setError('')
    setResult(null)
    if (file.size > 8 * 1024 * 1024) {
      setError('Image too large. Please use under 8 MB.')
      return
    }
    const dataUrl = await new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onloadend = () => resolve(String(r.result))
      r.onerror = reject
      r.readAsDataURL(file)
    })
    setPreview(dataUrl)
    setBusy(true)
    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'OCR failed')
      setResult(data)
    } catch (e) {
      setError(e.message || 'Could not read the prescription.')
    } finally {
      setBusy(false)
    }
  }

  function searchFor(name) {
    const q = (name || '').split(/[,( ]/)[0] || name
    navigate(`/search?q=${encodeURIComponent(q)}&ai=1`)
  }

  return (
    <section className="section-sm">
      <div className="container" style={{ maxWidth: 820 }}>
        <div className="eyebrow" style={{ marginTop: 24 }}>
          <span className="dot" /> AI prescription reader
        </div>
        <h1 className="section-title" style={{ fontSize: 32 }}>
          Snap a prescription, get generics instantly
        </h1>
        <p className="section-sub">
          Upload a photo of your doctor's prescription. We'll read it and help you find cheaper
          generic equivalents for each medicine.
        </p>

        <div className="upload-card">
          {!preview && (
            <>
              <div className="upload-icon"><IconCamera size={26} /></div>
              <div style={{ fontWeight: 600, fontSize: 17 }}>Upload or take a photo</div>
              <div className="card-sub" style={{ marginBottom: 18 }}>
                JPG or PNG · under 8 MB · handwritten prescriptions supported
              </div>
              <div className="row" style={{ justifyContent: 'center', gap: 10 }}>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => fileRef.current?.click()}
                >
                  <IconUpload /> Choose image
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => {
                    fileRef.current?.setAttribute('capture', 'environment')
                    fileRef.current?.click()
                  }}
                >
                  <IconCamera /> Use camera
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </>
          )}

          {preview && (
            <>
              <img src={preview} alt="prescription" className="scan-preview" />
              <div className="row" style={{ justifyContent: 'center', marginTop: 14 }}>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => { setPreview(null); setResult(null); setError('') }}
                >
                  Upload another
                </button>
              </div>
            </>
          )}
        </div>

        {busy && (
          <div className="ai-status">
            <span className="spinner" /> Reading your prescription…
          </div>
        )}

        {error && <div className="error-box">{error}</div>}

        {result && (
          <div style={{ marginTop: 28 }}>
            <h2 className="section-title" style={{ fontSize: 22 }}>Detected medicines</h2>
            {result.medicines?.length ? (
              <div className="rx-list">
                {result.medicines.map((m, i) => (
                  <div key={i} className="rx-item">
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{m.name}</div>
                      <div className="card-sub">
                        {[m.dosage, m.frequency, m.duration].filter(Boolean).join(' · ') || '—'}
                      </div>
                    </div>
                    <span className={`conf conf-${m.confidence || 'medium'}`}>{m.confidence || 'medium'}</span>
                    <button className="btn btn-soft" type="button" onClick={() => searchFor(m.name)}>
                      Find generic <IconArrowRight />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty"><h3>No medicines detected</h3><p>Try a clearer photo or better lighting.</p></div>
            )}
            {result.notes && (
              <div className="note-box">
                <strong>Notes:</strong> {result.notes}
              </div>
            )}
            <div className="disclaimer">
              This is an automated read. Always verify with your doctor or pharmacist before acting on it.
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
