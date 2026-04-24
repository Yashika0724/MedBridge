import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconSearch, IconArrowRight, IconMic, IconCamera, IconStop } from './Icons'

export default function SearchBar({ value, onChange, onSubmit, placeholder, autoFocus }) {
  const inputRef = useRef(null)
  const mediaRef = useRef(null)
  const chunksRef = useRef([])
  const [recording, setRecording] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(value)
  }

  async function startRecording() {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = (e) => e.data && e.data.size > 0 && chunksRef.current.push(e.data)
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' })
        await transcribe(blob)
      }
      mediaRef.current = mr
      mr.start()
      setRecording(true)
    } catch (err) {
      setError('Microphone permission denied or not available.')
    }
  }

  function stopRecording() {
    const mr = mediaRef.current
    if (mr && mr.state !== 'inactive') mr.stop()
    setRecording(false)
  }

  async function transcribe(blob) {
    setBusy(true)
    try {
      const base64 = await new Promise((resolve, reject) => {
        const r = new FileReader()
        r.onloadend = () => resolve(String(r.result))
        r.onerror = reject
        r.readAsDataURL(blob)
      })
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64, filename: 'voice.webm' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Transcription failed')
      const text = (data.text || '').trim()
      if (text) {
        onChange(text)
        onSubmit?.(text)
      } else {
        setError("Didn't catch that. Please try again.")
      }
    } catch (err) {
      setError(err.message || 'Transcription failed')
    } finally {
      setBusy(false)
    }
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

        <button
          type="button"
          className={`icon-btn ${recording ? 'recording' : ''}`}
          onClick={recording ? stopRecording : startRecording}
          disabled={busy}
          title={recording ? 'Stop recording' : 'Voice search (any language)'}
          aria-label={recording ? 'Stop recording' : 'Voice search'}
        >
          {busy ? <span className="spinner" /> : recording ? <IconStop /> : <IconMic />}
        </button>

        <button
          type="button"
          className="icon-btn"
          onClick={() => navigate('/scan')}
          title="Scan a prescription"
          aria-label="Scan a prescription"
        >
          <IconCamera />
        </button>

        <button className="btn btn-primary" type="submit">
          Search <IconArrowRight />
        </button>
      </div>
      {(error || recording) && (
        <div className="search-hint">
          {recording && <span className="rec-dot" />}
          {recording ? 'Listening… speak a medicine or condition' : error}
        </div>
      )}
    </form>
  )
}
