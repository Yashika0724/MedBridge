import { groqTranscribe } from './_groq.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { audio, filename, language } = req.body || {}
    if (!audio || typeof audio !== 'string') {
      return res.status(400).json({ error: 'Missing "audio" (base64 string).' })
    }
    const b64 = audio.includes(',') ? audio.split(',')[1] : audio
    const buffer = Buffer.from(b64, 'base64')

    const result = await groqTranscribe({
      audioBuffer: buffer,
      filename: filename || 'audio.webm',
      language: language || undefined,
    })

    return res.status(200).json({
      text: result.text || '',
      language: result.language || null,
      duration: result.duration || null,
    })
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) })
  }
}
