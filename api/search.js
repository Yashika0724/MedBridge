import { GROQ_MODELS, groqChat, extractJson } from './_groq.js'
import { toIndex, getMedicines } from './_medicines.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { query } = req.body || {}
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Missing "query".' })
    }

    const index = toIndex()
    const prompt = `You are matching a user's messy, possibly multilingual, possibly misspelled medicine query against a catalogue.

USER QUERY: "${query.trim()}"

CATALOGUE (JSON array, each item has id, branded, generic, composition, category, uses):
${JSON.stringify(index)}

Task: return up to 10 catalogue IDs that the user most likely means, ranked by relevance.
- Match on brand name, generic name, molecule/composition, OR condition described in "uses".
- Handle misspellings ("crocine" -> Crocin), phonetic Hindi/regional spellings, and descriptions ("blood pressure tablet", "sugar ki dawa", "bukhar ki dawa").
- If the query is a symptom/condition, include medicines whose "uses" or "category" match.
- If nothing plausibly matches, return an empty ids array.

Return STRICT JSON:
{ "ids": [<number>, ...], "reasoning": "<one short sentence>" }`

    const completion = await groqChat({
      model: GROQ_MODELS.text,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 400,
    })

    const content = completion.choices?.[0]?.message?.content || ''
    const parsed = extractJson(content) || { ids: [], reasoning: '' }
    const ids = Array.isArray(parsed.ids) ? parsed.ids.filter((n) => Number.isInteger(n)) : []
    const byId = new Map(getMedicines().map((m) => [m.id, m]))
    const results = ids.map((id) => byId.get(id)).filter(Boolean)

    return res.status(200).json({ results, reasoning: parsed.reasoning || '' })
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) })
  }
}
