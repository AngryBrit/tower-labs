import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(join(fileURLToPath(import.meta.url), '..'))
const towerPath = join(root, 'src', 'data', 'tower-labs.json')
const fragPath = join(root, 'scripts', 'module-labs-tower-fragment.json')

const tower = JSON.parse(readFileSync(towerPath, 'utf8'))
const frag = JSON.parse(readFileSync(fragPath, 'utf8'))

for (const [k, v] of Object.entries(frag)) {
  tower[k] = v
}

writeFileSync(towerPath, JSON.stringify(tower, null, 2) + '\n', 'utf8')
console.log('Merged', Object.keys(frag).length, 'module labs into', towerPath)
