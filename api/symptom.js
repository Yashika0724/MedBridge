import { GROQ_MODELS, groqChat, extractJson } from './_groq.js'
import { toIndex, getMedicines } from './_medicines.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { symptom } = req.body || {}
    if (!symptom || typeof symptom !== 'string') {
      return res.status(400).json({ error: 'Missing "symptom".' })
    }

    const index = toIndex()

    const prompt = `You are an educational assistant on MedBridge — an Indian generic-medicine discovery tool.
The user describes a symptom or condition. You explain what MOLECULE CLASS is commonly prescribed,
and point them to relevant generics from the catalogue they can discuss with a doctor.

IMPORTANT RULES:
- You are NOT prescribing. Always include a short disclaimer in "disclaimer".
- Never recommend antibiotics or prescription-only drugs as "take this". Only describe the class.
- If the symptom sounds like an emergency (chest pain, severe breathlessness, stroke signs,
  severe bleeding, suicidal ideation), set "urgent": true and tell the user to seek care immediately.
- Keep "summary" under 60 words. Plain English. No markdown.

USER SYMPTOM: "${symptom.trim()}"

CATALOGUE (JSON array of {id, branded, generic, composition, category, uses}):
${JSON.stringify(index)}

Return STRICT JSON:
{
  "summary": "<plain-English explanation of what's commonly used and why>",
  "molecules": ["<molecule 1>", "<molecule 2>"],
  "ids": [<catalogue ids of relevant generic options, max 6>],
  "urgent": <true|false>,
  "disclaimer": "<one sentence reminder to consult a doctor/pharmacist>"
}`

    const completion = await groqChat({
      model: GROQ_MODELS.text,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 700,
    })

    const content = completion.choices?.[0]?.message?.content || ''
    const parsed = extractJson(content) || {}
    const ids = Array.isArray(parsed.ids) ? parsed.ids.filter((n) => Number.isInteger(n)) : []
    const byId = new Map(getMedicines().map((m) => [m.id, m]))
    const results = ids.map((id) => byId.get(id)).filter(Boolean)

    return res.status(200).json({
      summary: parsed.summary || '',
      molecules: Array.isArray(parsed.molecules) ? parsed.molecules : [],
      urgent: Boolean(parsed.urgent),
      disclaimer: parsed.disclaimer || 'This is educational information, not medical advice. Consult a doctor or pharmacist before taking any medicine.',
      results,
    })
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) })
  }
}
