import { Link } from 'react-router-dom'
import { IconLogo } from './Icons'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="logo">
            <span className="logo-mark"><IconLogo size={18} /></span>
            MedBridge
          </div>
          <p className="desc">
            Compare branded medicines against their generic equivalents and find nearby
            Jan Aushadhi stores - so nobody has to overpay for the same molecule.
          </p>
        </div>

        <div>
          <h5>Explore</h5>
          <ul>
            <li><Link to="/search">Search medicines</Link></li>
            <li><Link to="/why-generics">Why generics?</Link></li>
            <li><Link to="/stores">Find a store</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>

        <div>
          <h5>Good to know</h5>
          <ul>
            <li>Data sourced from Jan Aushadhi (Government of India)</li>
            <li>Prices are representative MRPs and may vary</li>
            <li>Informational only - not a substitute for medical advice</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        © {new Date().getFullYear()} MedBridge. Always consult a qualified doctor or pharmacist before switching medicines.
      </div>
    </footer>
  )
}
