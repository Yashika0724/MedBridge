import { useEffect, useMemo, useState } from 'react'
import stores from '../data/stores.json'
import { distanceKm } from '../lib/geo'
import { IconPin, IconPhone } from '../components/Icons'

const CITIES = ['All cities', 'Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow']

export default function StoreLocator() {
  const [coords, setCoords] = useState(null)
  const [status, setStatus] = useState('idle')
  const [cityFilter, setCityFilter] = useState('All cities')

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported')
      return
    }
    setStatus('requesting')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setStatus('ok')
      },
      () => setStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Auto-prompt once when page opens. User can still click again if they denied.
  useEffect(() => {
    requestLocation()
  }, [])

  const list = useMemo(() => {
    let filtered = stores
    if (cityFilter && cityFilter !== 'All cities') {
      filtered = filtered.filter((s) => s.city === cityFilter)
    }
    if (coords) {
      filtered = filtered
        .map((s) => ({ ...s, km: distanceKm(coords.lat, coords.lng, s.lat, s.lng) }))
        .sort((a, b) => a.km - b.km)
    }
    return filtered
  }, [coords, cityFilter])

  return (
    <section className="section-sm">
      <div className="container">
        <div className="locator-head">
          <div>
            <h1 className="section-title" style={{ fontSize: 28, marginTop: 24 }}>
              Find a Jan Aushadhi store
            </h1>
            <p className="section-sub" style={{ marginBottom: 0 }}>
              Government-run kendras stocking affordable generics across India.
            </p>
          </div>
          <button className="btn btn-primary" onClick={requestLocation} type="button">
            <IconPin /> Use my location
          </button>
        </div>

        <div className="row" style={{ marginBottom: 14 }}>
          {CITIES.map((c) => (
            <button
              key={c}
              className={`pill ${cityFilter === c ? 'active' : ''}`}
              onClick={() => setCityFilter(c)}
              type="button"
            >
              {c}
            </button>
          ))}
        </div>

        {status === 'requesting' && (
          <div className="locator-status">Checking your location…</div>
        )}
        {status === 'denied' && (
          <div className="locator-status warn">
            Location access was blocked. Showing stores across major cities — tap a city above to filter.
          </div>
        )}
        {status === 'unsupported' && (
          <div className="locator-status warn">
            Your browser doesn't support geolocation. You can still browse stores below.
          </div>
        )}
        {status === 'ok' && coords && (
          <div className="locator-status ok">
            Sorted by distance from your current location.
          </div>
        )}

        <div style={{ display: 'grid', gap: 12 }}>
          {list.map((s, i) => (
            <div key={s.id} className="store-card fade-in" style={{ animationDelay: `${Math.min(i * 30, 240)}ms` }}>
              <div>
                <h4>{s.name}</h4>
                <div className="addr">{s.address}</div>
                <div className="meta">
                  <span><IconPin size={14} /> {s.city}</span>
                  <span><IconPhone /> <a href={`tel:${s.phone.replace(/\D/g, '')}`}>{s.phone}</a></span>
                </div>
              </div>
              {typeof s.km === 'number' && (
                <div className="distance-chip">{s.km < 1 ? `${(s.km * 1000).toFixed(0)} m` : `${s.km.toFixed(1)} km`}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
