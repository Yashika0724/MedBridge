import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { IconLogo, IconMenu } from './Icons'

export default function Header() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo" onClick={close}>
          <span className="logo-mark"><IconLogo size={18} /></span>
          MedBridge
        </Link>

        <nav className={`nav ${open ? 'open' : ''}`}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/search" onClick={close}>Search</NavLink>
          <NavLink to="/scan" onClick={close}>Scan Rx</NavLink>
          <NavLink to="/ask" onClick={close}>Ask AI</NavLink>
          <NavLink to="/why-generics" onClick={close}>Why Generics?</NavLink>
          <NavLink to="/stores" onClick={close}>Find Store</NavLink>
          <NavLink to="/about" onClick={close}>About</NavLink>
        </nav>

        <button className="mobile-toggle" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
          <IconMenu />
        </button>
      </div>
    </header>
  )
}
