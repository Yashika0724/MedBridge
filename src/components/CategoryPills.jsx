const CATEGORIES = [
  'Pain & Fever',
  'Diabetes',
  'Heart & BP',
  'Antibiotics',
  'Gastric',
  'Vitamins',
  'Skin Care',
  'Mental Health',
]

export default function CategoryPills({ active, onSelect }) {
  return (
    <div className="pills">
      <button
        className={`pill ${!active ? 'active' : ''}`}
        onClick={() => onSelect(null)}
        type="button"
      >
        All
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c}
          className={`pill ${active === c ? 'active' : ''}`}
          onClick={() => onSelect(c)}
          type="button"
        >
          {c}
        </button>
      ))}
    </div>
  )
}

export { CATEGORIES }
