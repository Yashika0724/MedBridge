import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_PATH = path.resolve(__dirname, '..', 'src', 'data', 'medicines.json')

let cache = null
export function getMedicines() {
  if (!cache) cache = JSON.parse(readFileSync(DATA_PATH, 'utf8'))
  return cache
}

// Compact projection used in prompts (keeps tokens small).
export function toIndex() {
  return getMedicines().map((m) => ({
    id: m.id,
    branded: m.branded,
    generic: m.generic,
    composition: m.composition,
    category: m.category,
    uses: m.uses,
  }))
}
