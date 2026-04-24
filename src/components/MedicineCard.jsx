import { useNavigate } from 'react-router-dom'

export default function MedicineCard({ med, index = 0 }) {
  const navigate = useNavigate()
  const savings = Math.round(((med.brandedPrice - med.genericPrice) / med.brandedPrice) * 100)

  return (
    <article
      className="card fade-in"
      style={{ animationDelay: `${Math.min(index * 30, 240)}ms` }}
      onClick={() => navigate(`/medicine/${med.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/medicine/${med.id}`) }}
    >
      <div className="card-head">
        <div>
          <div className="card-title">{med.branded}</div>
          <div className="card-sub">by {med.brandCompany}</div>
        </div>
        <span className="badge-save">-{savings}%</span>
      </div>

      <div className="row">
        <span className="tag">{med.category}</span>
        <span className="card-sub">{med.unit}</span>
      </div>

      <div>
        <div className="card-sub" style={{ marginBottom: 4 }}>Generic equivalent</div>
        <div style={{ fontWeight: 500, color: 'var(--ink-900)' }}>{med.generic}</div>
      </div>

      <div className="price-row">
        <div className="price-item branded">
          <div className="lbl">Branded</div>
          <div className="val">₹{med.brandedPrice}</div>
        </div>
        <div className="price-item generic">
          <div className="lbl">Generic</div>
          <div className="val">₹{med.genericPrice}</div>
        </div>
      </div>
    </article>
  )
}
