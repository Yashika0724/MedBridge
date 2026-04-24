import { useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import medicines from '../data/medicines.json'
import { IconArrowLeft, IconArrowRight, IconPin, IconShield, IconCheck } from '../components/Icons'

export default function MedicineDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const med = useMemo(() => medicines.find((m) => String(m.id) === String(id)), [id])
  const [stripsPerMonth, setStripsPerMonth] = useState(2)

  if (!med) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty">
            <h3>Medicine not found</h3>
            <p>That medicine isn't in our dataset yet.</p>
            <div style={{ marginTop: 14 }}>
              <Link to="/search" className="btn btn-primary">Back to search</Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const saveAbs = +(med.brandedPrice - med.genericPrice).toFixed(2)
  const savePct = Math.round(((med.brandedPrice - med.genericPrice) / med.brandedPrice) * 100)
  const yearly = +(saveAbs * stripsPerMonth * 12).toFixed(2)

  const highlight = (text, needle) => {
    if (!needle) return text
    const idx = text.toLowerCase().indexOf(needle.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <mark>{text.slice(idx, idx + needle.length)}</mark>
        {text.slice(idx + needle.length)}
      </>
    )
  }

  const sharedMolecule = med.composition.split(/[+,]/)[0].trim().split(' ')[0]

  return (
    <section className="section-sm">
      <div className="container">
        <div className="breadcrumb" onClick={() => navigate(-1)}>
          <IconArrowLeft size={14} /> Back to results
        </div>

        <div className="detail">
          <div>
            <h1 className="section-title" style={{ fontSize: 30 }}>{med.branded}</h1>
            <p className="section-sub" style={{ marginBottom: 14 }}>
              <span className="tag">{med.category}</span>{' '}
              <span style={{ marginLeft: 6 }}>Used for: {med.uses}</span>
            </p>

            <div className="compare">
              <div className="compare-col branded">
                <h4>Branded</h4>
                <div className="name">{med.branded}</div>
                <div className="company">by {med.brandCompany}</div>
                <div className="price">₹{med.brandedPrice}</div>
                <div className="unit">per {med.unit}</div>
                <div className="molecule">
                  <div className="lbl">Composition</div>
                  <div className="val">{highlight(med.composition, sharedMolecule)}</div>
                </div>
              </div>

              <div className="compare-col generic">
                <h4>Generic equivalent</h4>
                <div className="name">{med.generic}</div>
                <div className="company">Jan Aushadhi &middot; CDSCO approved</div>
                <div className="price">₹{med.genericPrice}</div>
                <div className="unit">per {med.unit}</div>
                <div className="molecule">
                  <div className="lbl">Composition</div>
                  <div className="val">{highlight(med.composition, sharedMolecule)}</div>
                </div>
              </div>
            </div>

            <div className="savings-callout">
              <div className="big">You save ₹{saveAbs} per strip</div>
              <div className="sm">
                That's {savePct}% less than the branded version, for the exact same molecule.
              </div>
            </div>
          </div>

          <aside className="side-panel">
            <div className="panel">
              <h4>Estimate yearly savings</h4>
              <p>How many strips do you buy every month?</p>
              <div className="calc-row">
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={stripsPerMonth}
                  onChange={(e) => setStripsPerMonth(Math.max(0, Number(e.target.value) || 0))}
                />
                <span style={{ color: 'var(--ink-500)', fontSize: 14 }}>strips per month</span>
              </div>
              <div className="calc-out">
                <strong>₹{yearly.toLocaleString('en-IN')}</strong>
                saved every year if you switch to the generic.
              </div>
            </div>

            <div className="panel">
              <h4><IconShield size={18} /> Why this is safe</h4>
              <p>
                Both medicines contain the same active ingredient and are approved by the
                CDSCO - India's drug regulator. Generic manufacturers must pass the
                same quality and bioequivalence tests as branded ones.
              </p>
              <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                <div className="row" style={{ fontSize: 14 }}>
                  <span style={{ color: 'var(--green-700)' }}><IconCheck /></span>
                  Identical active molecule and dosage
                </div>
                <div className="row" style={{ fontSize: 14 }}>
                  <span style={{ color: 'var(--green-700)' }}><IconCheck /></span>
                  Manufactured under the same GMP standards
                </div>
                <div className="row" style={{ fontSize: 14 }}>
                  <span style={{ color: 'var(--green-700)' }}><IconCheck /></span>
                  Used in AIIMS and government hospitals
                </div>
              </div>
            </div>

            <div className="panel">
              <h4><IconPin size={18} /> Where to buy the generic</h4>
              <p>Generics are stocked at any Jan Aushadhi Kendra across India.</p>
              <div style={{ marginTop: 12 }}>
                <Link to="/stores" className="btn btn-primary" style={{ width: '100%' }}>
                  Find nearest Jan Aushadhi store <IconArrowRight />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
