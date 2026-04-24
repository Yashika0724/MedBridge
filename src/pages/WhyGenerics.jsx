import { Link } from 'react-router-dom'
import { IconShield, IconCheck, IconPill, IconSpark, IconArrowRight } from '../components/Icons'

export default function WhyGenerics() {
  return (
    <section className="section-sm">
      <div className="container">
        <span className="tag tag-blue" style={{ marginTop: 20 }}>Why generics</span>
        <h1 className="section-title" style={{ fontSize: 34, marginTop: 10 }}>
          The molecule is the medicine.
        </h1>
        <p className="section-sub" style={{ maxWidth: 720 }}>
          A generic medicine contains the exact same active ingredient, in the same
          dose, tested to the same standards as the branded version. What you're paying
          extra for on the branded version is the packaging, marketing and brand - not
          the chemistry that treats you.
        </p>

        <div className="feature-grid">
          <div className="feature">
            <div className="icon"><IconPill /></div>
            <h3>Same active ingredient</h3>
            <p>Every generic must match the branded drug's molecule, strength, dosage form and route of administration.</p>
          </div>
          <div className="feature">
            <div className="icon"><IconShield /></div>
            <h3>Regulated by CDSCO</h3>
            <p>India's Central Drugs Standard Control Organisation approves generics using the same quality framework as branded drugs.</p>
          </div>
          <div className="feature">
            <div className="icon"><IconCheck /></div>
            <h3>Bioequivalence tested</h3>
            <p>Generics must prove they release the same amount of medicine into the bloodstream at the same rate as the original.</p>
          </div>
          <div className="feature">
            <div className="icon"><IconSpark /></div>
            <h3>Used by AIIMS</h3>
            <p>All AIIMS and government hospitals prescribe generics by default - because the clinical outcome is the same.</p>
          </div>
          <div className="feature">
            <div className="icon"><IconShield /></div>
            <h3>Backed by WHO</h3>
            <p>The World Health Organization endorses generic medicines as a primary way to widen access to essential healthcare.</p>
          </div>
          <div className="feature">
            <div className="icon"><IconPill /></div>
            <h3>Jan Aushadhi network</h3>
            <p>The Government of India runs over 16,000 Pradhan Mantri Bhartiya Janaushadhi Kendras across the country.</p>
          </div>
        </div>

        <div className="big-stat">
          <div className="huge">₹30,000 crore+</div>
          <div className="cap">
            Estimated savings delivered to Indian families by the Jan Aushadhi scheme
            since its launch - money that stayed in households instead of pharmacy margins.
          </div>
          <div style={{ marginTop: 22 }}>
            <Link to="/search" className="btn btn-ghost" style={{ background: '#fff' }}>
              Find a cheaper equivalent <IconArrowRight />
            </Link>
          </div>
        </div>

        <div className="divider" />

        <div className="panel">
          <h4>Before you switch</h4>
          <p>
            If you're on long-term medication for a chronic condition, speak with your
            doctor or pharmacist before changing brands. Switching is usually fine, but
            a quick check takes a minute and gives you peace of mind.
          </p>
        </div>
      </div>
    </section>
  )
}
