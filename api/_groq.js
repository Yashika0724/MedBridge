// Thin wrapper around Groq's OpenAI-compatible endpoints.
// Models are kept here so swapping is one-line.

export const GROQ_MODELS = {
  text: 'llama-3.3-70b-versatile',
  vision: 'meta-llama/llama-4-scout-17b-16e-instruct',
  audio: 'whisper-large-v3',
}

const BASE = 'https://api.groq.com/openai/v1'

function key() {
  const k = process.env.GROQ_API_KEY
  if (!k) throw new Error('GROQ_API_KEY is not set. Add it to .env (local) or Vercel env vars.')
  return k
}

export async function groqChat({ model, messages, response_format, temperature = 0.2, max_tokens = 1024 }) {
  const r = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, response_format, temperature, max_tokens }),
  })
  if (!r.ok) {
    const t = await r.text()
    throw new Error(`Groq chat failed (${r.status}): ${t}`)
  }
  return r.json()
}

export async function groqTranscribe({ audioBuffer, filename = 'audio.webm', model, language }) {
  const form = new FormData()
  form.append('file', new Blob([audioBuffer]), filename)
  form.append('model', model || GROQ_MODELS.audio)
  if (language) form.append('language', language)
  form.append('response_format', 'verbose_json')

  const r = await fetch(`${BASE}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key()}` },
    body: form,
  })
  if (!r.ok) {
    const t = await r.text()
    throw new Error(`Groq transcribe failed (${r.status}): ${t}`)
  }
  return r.json()
}

// Extract first JSON object from a model reply (tolerant of ```json fences).
export function extractJson(text) {
  if (!text) return null
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenced ? fenced[1] : text
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1) return null
  try {
    return JSON.parse(candidate.slice(start, end + 1))
  } catch {
    return null
  }
}
