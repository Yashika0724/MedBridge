import { useRef } from 'react'
import { IconSearch, IconArrowRight } from './Icons'

export default function SearchBar({ value, onChange, onSubmit, placeholder, autoFocus }) {
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(value)
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      <div className="search-box">
        <IconSearch />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Search any medicine... (e.g. Crocin, Dolo 650)'}
          autoFocus={autoFocus}
          spellCheck="false"
          autoComplete="off"
        />
        <button className="btn btn-primary" type="submit">
          Search <IconArrowRight />
        </button>
      </div>
    </form>
  )
}
