// Writes the projects section of the profile README from repos.json (titles,
// taglines, tags) and profile.json (featured cards, groups, Laratta Labs).
// Only the text between the <!-- projects:start/end --> markers is replaced.
//
// Usage: pnpm readme        (run after `pnpm build` so every card.png exists)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const BRAND = path.dirname(fileURLToPath(import.meta.url))
const README = path.join(BRAND, '..', 'README.md')
const repos = JSON.parse(fs.readFileSync(path.join(BRAND, 'repos.json'), 'utf8'))
const profile = JSON.parse(fs.readFileSync(path.join(BRAND, 'profile.json'), 'utf8'))

const owner = (repo) => repos[repo]?.owner ?? 'nlaratta'
const gh = (repo) => `https://github.com/${owner(repo)}/${repo}`
const need = (repo) => {
  if (!repos[repo]) throw new Error(`profile.json lists "${repo}", which is missing from repos.json`)
  if (!fs.existsSync(path.join(BRAND, 'out', repo, 'card.png'))) throw new Error(`no card for "${repo}": run pnpm build ${repo}`)
  return repos[repo]
}

// Featured: a fixed 2×2 grid of cards.
const card = (repo) => {
  need(repo)
  const live = profile.live[repo]
  const links = [live && `<a href="${live}">Live</a>`, `<a href="${gh(repo)}">Code</a>`].filter(Boolean).join(' · ')
  return `    <td width="50%" valign="top">
      <a href="${gh(repo)}"><img src="brand/out/${repo}/card.png" alt="${repos[repo].title}" width="100%"></a>
      <p align="center">${links}</p>
    </td>`
}
const featured = profile.featured
const rows = []
for (let i = 0; i < featured.length; i += 2) rows.push(`  <tr>\n${featured.slice(i, i + 2).map(card).join('\n')}\n  </tr>`)

// Every repo, grouped, one line each.
const listed = new Set()
const groups = profile.categories.map(({ name, repos: list }) => {
  const lines = list.map((repo) => {
    const r = need(repo)
    listed.add(repo)
    const live = profile.live[repo] ? ` · [live](${profile.live[repo]})` : ''
    return `| [**${r.title}**](${gh(repo)})${live} | ${r.tagline} | ${r.tags.join(', ')} |`
  })
  return `**${name}**\n\n| Project | What it is | Stack |\n|---|---|---|\n${lines.join('\n')}`
})

// Studio (larattalabs) repos are listed under labs.openSource instead of a category.
for (const { repo } of profile.labs.openSource) {
  const [org, name] = repo.split('/')
  if (repos[name] && owner(name) === org) listed.add(name)
}
const missing = Object.keys(repos).filter((r) => r !== 'nlaratta' && !listed.has(r))
if (missing.length) throw new Error(`repos.json entries not placed in any profile.json category: ${missing.join(', ')}`)

const labs = profile.labs
const section = `## Featured

<table>
${rows.join('\n')}
</table>

## Shipped at Laratta Labs

${labs.products.map((p) => `- **${p.name}**: ${p.description} ${p.links.map((l) => `[${l.label}](${l.href})`).join(' · ')}`).join('\n')}

Open source from the studio:

${labs.openSource.map((o) => `- [**${o.name}**](https://github.com/${o.repo}): ${o.description}`).join('\n')}

## All projects

${groups.join('\n\n')}`

const src = fs.readFileSync(README, 'utf8')
const start = '<!-- projects:start -->'
const end = '<!-- projects:end -->'
if (!src.includes(start) || !src.includes(end)) throw new Error(`README.md needs ${start} and ${end} markers`)
const out = src.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n${section}\n${end}`)
fs.writeFileSync(README, out)
console.log(`README.md: ${featured.length} featured, ${listed.size} listed, ${labs.products.length + labs.openSource.length} Laratta Labs entries`)
