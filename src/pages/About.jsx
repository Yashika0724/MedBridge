import { Link } from 'react-router-dom'
import { IconArrowRight } from '../components/Icons'

export default function About() {
  return (
    <section className="section-sm">
      <div className="container">
        <span className="tag">About</span>
        <h1 className="section-title" style={{ fontSize: 34, marginTop: 10 }}>
          A simpler way to check what you're paying for.
        </h1>

        <div className="about-grid" style={{ marginTop: 24 }}>
          <div>
            <p style={{ color: 'var(--ink-500)', fontSize: 17, marginBottom: 14 }}>
              Millions of Indians pay several times the fair price for medicines every
              month - not because the generic doesn't exist, but because nobody told
              them it did. MedBridge is a small attempt to close that gap.
            </p>
            <p style={{ color: 'var(--ink-500)', fontSize: 17, marginBottom: 14 }}>
              Type in a branded medicine you recognise, see the generic equivalent
              beside it, check the composition, estimate your yearly savings, and find
              the nearest Jan Aushadhi Kendra to pick it up. That's it.
            </p>
            <p style={{ color: 'var(--ink-500)', fontSize: 17 }}>
              All prices are representative MRPs based on publicly available Jan
              Aushadhi product lists and common retail listings. Treat MedBridge as a
              reference - your pharmacist or doctor is still the final word.
            </p>

            <div style={{ marginTop: 22, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="/search" className="btn btn-primary">Start a search <IconArrowRight /></Link>
              <Link to="/why-generics" className="btn btn-ghost">Read about generics</Link>
            </div>
          </div>

          <aside className="panel">
            <h4>A quick disclaimer</h4>
            <p style={{ fontSize: 14 }}>
              MedBridge is an informational tool. It doesn't prescribe, dispense or
              verify the availability of any specific medicine. Always consult a
              qualified doctor or pharmacist before changing your prescription.
            </p>
            <div className="divider" />
            <h4>Data sources</h4>
            <p style={{ fontSize: 14 }}>
              Branded MRPs are drawn from common retail listings. Generic prices are
              based on the Jan Aushadhi product catalogue maintained by the Pharmaceuticals
              &amp; Medical Devices Bureau of India.
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
