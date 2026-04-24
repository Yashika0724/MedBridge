import { GROQ_MODELS, groqChat, extractJson } from './_groq.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { image } = req.body || {}
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'Missing "image" (base64 data URL).' })
    }

    const dataUrl = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`

    const prompt = `You are a pharmacist's assistant reading a photographed doctor's prescription from India.

Extract every medicine you can see. For each one, return:
- "name": the medicine name as written (brand or generic, preserve spelling)
- "dosage": strength if visible (e.g. "500mg", "10mg"), else null
- "frequency": how often to take if visible (e.g. "1-0-1", "twice daily"), else null
- "duration": for how long if visible (e.g. "5 days"), else null
- "confidence": one of "high" | "medium" | "low"

Return STRICT JSON with shape:
{ "medicines": [ { "name": "...", "dosage": "...", "frequency": "...", "duration": "...", "confidence": "..." } ], "notes": "any relevant patient notes the user should see, plain text, <=30 words" }

If the image is not a prescription, return { "medicines": [], "notes": "Not a prescription." }.
If handwriting is unreadable in places, set confidence:"low" and do your best — but NEVER invent medicines.`

    const completion = await groqChat({
      model: GROQ_MODELS.vision,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 1200,
    })

    const content = completion.choices?.[0]?.message?.content || ''
    const parsed = extractJson(content) || { medicines: [], notes: 'Could not parse model response.' }
    return res.status(200).json(parsed)
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) })
  }
}
