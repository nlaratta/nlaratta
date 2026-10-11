// Generates the shared look for every public nlaratta repo, using the same
// sage palette and Inter type as noahlaratta.com (scripts/generate-og.mjs there).
// Entries with "owner": "larattalabs" get the studio theme instead (ink, rust and
// iron, JetBrains Mono labels, the studio mark), per larattalabs/.github STANDARDS.md.
//
//   out/<repo>/banner.png  1280x400  README header (commit as .github/banner.png)
//   out/<repo>/social.png  1280x640  Settings → Social preview upload
//   out/<repo>/card.png     800x400  project card in the profile README grid
//
// Usage: pnpm build            (all repos in repos.json)
//        pnpm build <repo> ... (just those)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(ROOT, 'out')

const SAGE = '#2D6A4F'
const SAGE_LIGHT = '#52B788'
const SAGE_LIGHTER = '#D8F3DC'
const SAGE_DARK = '#1B4332'
const BG = '#FAFAF8'
const INK = '#1A1A1A'
const MUTED = '#6B7280'

const font = (name, pkg, weight) => ({
  name,
  data: fs.readFileSync(path.join(ROOT, `node_modules/@fontsource/${pkg}/files/${pkg}-latin-${weight}-normal.woff`)),
  weight,
  style: 'normal',
})
const fonts = [
  font('Inter', 'inter', 400),
  font('Inter', 'inter', 600),
  font('Inter', 'inter', 700),
  font('JetBrains Mono', 'jetbrains-mono', 600),
]

const dataUri = (file, type) => `data:${type};base64,${fs.readFileSync(path.join(ROOT, 'assets', file)).toString('base64')}`

// Personal theme (default) and the Laratta Labs studio theme, chosen by repos.json "owner".
const THEMES = {
  nlaratta: {
    bg: BG,
    ink: INK,
    muted: MUTED,
    accent: SAGE,
    bar: SAGE,
    rings: [[SAGE_LIGHTER, 1], [SAGE_LIGHT, 0.22]],
    chip: { color: SAGE_DARK, bg: SAGE_LIGHTER, font: 'Inter' },
    eyebrowFont: 'Inter',
    avatar: { src: dataUri('me.jpg', 'image/jpeg'), round: true, border: SAGE_LIGHT },
    name: 'Noah Laratta',
    footer: 'github.com/nlaratta · noahlaratta.com',
  },
  larattalabs: {
    bg: '#0F1419', // ink
    ink: '#F8F7F4', // cream
    muted: '#A3A9B3', // iron, lifted for contrast on ink
    accent: '#B7410E', // rust
    bar: '#B7410E',
    rings: [['#6B7280', 0.16], ['#B7410E', 0.22]],
    chip: { color: '#F8F7F4', bg: '#8A2F06', font: 'JetBrains Mono' }, // cream on rust deep
    eyebrowFont: 'JetBrains Mono',
    avatar: { src: dataUri('larattalabs.png', 'image/png'), round: false, border: '#6B7280' },
    name: 'Laratta Labs',
    footer: 'github.com/larattalabs · larattalabs.com',
  },
}
const themeOf = (spec) => {
  const owner = spec.owner ?? 'nlaratta'
  if (!THEMES[owner]) throw new Error(`unknown owner "${owner}" (expected ${Object.keys(THEMES).join(' or ')})`)
  return { owner, ...THEMES[owner] }
}

const h = (type, props = {}, ...children) => ({
  type,
  props: { ...props, children: children.length <= 1 ? children[0] : children },
})
const row = (style, ...children) => h('div', { style: { display: 'flex', ...style } }, ...children)

const chips = (t, tags, size) =>
  row(
    { gap: `${size * 0.5}px`, flexWrap: 'wrap' },
    ...tags.map((tag) =>
      row(
        {
          fontSize: `${size}px`,
          fontWeight: 600,
          fontFamily: t.chip.font,
          color: t.chip.color,
          backgroundColor: t.chip.bg,
          padding: `${size * 0.35}px ${size * 0.8}px`,
          borderRadius: `${size * 2}px`,
        },
        tag,
      ),
    ),
  )

// Decorative rings in the top-right corner, echoing the site's sage accents.
const rings = (t, scale) =>
  [520, 340].map((d, i) => [d, ...t.rings[i]]).map(([d, color, opacity]) =>
    h('div', {
      style: {
        position: 'absolute',
        display: 'flex',
        width: `${d * scale}px`,
        height: `${d * scale}px`,
        right: `${(-d / 2.6) * scale}px`,
        top: `${(-d / 2.6) * scale}px`,
        borderRadius: '50%',
        backgroundColor: color,
        opacity,
      },
    }),
  )

const frame = (t, w, hgt, pad, scale, ...children) =>
  h(
    'div',
    {
      style: {
        width: `${w}px`,
        height: `${hgt}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: pad,
        backgroundColor: t.bg,
        color: t.ink,
        fontFamily: 'Inter',
        position: 'relative',
        overflow: 'hidden',
      },
    },
    ...rings(t, scale),
    h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '16px', backgroundColor: t.bar, display: 'flex' } }),
    ...children,
  )

const eyebrow = (t, repo, size) =>
  row(
    { fontSize: `${size}px`, fontWeight: 600, fontFamily: t.eyebrowFont, letterSpacing: '2px', textTransform: 'uppercase', color: t.accent },
    `${t.owner} / ${repo}`,
  )

function social(repo, spec) {
  const { title, tagline, tags } = spec
  const t = themeOf(spec)
  return frame(
    t,
    1280,
    640,
    '72px 88px',
    1,
    eyebrow(t, repo, 26),
    row(
      { flexDirection: 'column', gap: '22px', maxWidth: '1000px' },
      row({ fontSize: title.length > 18 ? '76px' : '92px', fontWeight: 700, lineHeight: 1.05 }, title),
      row({ fontSize: '32px', color: t.muted, lineHeight: 1.3 }, tagline),
      row({ marginTop: '10px' }, chips(t, tags, 24)),
    ),
    row(
      { alignItems: 'center', gap: '18px' },
      h('img', {
        src: t.avatar.src,
        width: 64,
        height: 64,
        style: { borderRadius: t.avatar.round ? '32px' : '12px', border: `3px solid ${t.avatar.border}` },
      }),
      row(
        { flexDirection: 'column' },
        row({ fontSize: '26px', fontWeight: 600 }, t.name),
        row({ fontSize: '20px', color: t.muted }, t.footer),
      ),
    ),
  )
}

function banner(repo, spec) {
  const { title, tagline, tags } = spec
  const t = themeOf(spec)
  return frame(
    t,
    1280,
    400,
    '52px 88px',
    0.75,
    eyebrow(t, repo, 20),
    row(
      { flexDirection: 'column', gap: '14px', maxWidth: '1000px' },
      row({ fontSize: title.length > 18 ? '64px' : '76px', fontWeight: 700, lineHeight: 1.05 }, title),
      row({ fontSize: '28px', color: t.muted, lineHeight: 1.3 }, tagline),
    ),
    chips(t, tags, 20),
  )
}

// Compact project card for the profile README grid (no avatar footer).
function card(repo, spec) {
  const { title, tagline, tags } = spec
  const t = themeOf(spec)
  return frame(
    t,
    800,
    400,
    '40px 52px 40px 60px',
    0.6,
    eyebrow(t, repo, 16),
    row(
      { flexDirection: 'column', gap: '12px' },
      row({ fontSize: title.length > 16 ? '46px' : '54px', fontWeight: 700, lineHeight: 1.05 }, title),
      row({ fontSize: '22px', color: t.muted, lineHeight: 1.3 }, tagline),
    ),
    chips(t, tags, 16),
  )
}

async function render(tree, w, hgt, file) {
  const svg = await satori(tree, { width: w, height: hgt, fonts })
  fs.writeFileSync(file, new Resvg(svg, { fitTo: { mode: 'width', value: w } }).render().asPng())
}

const repos = JSON.parse(fs.readFileSync(path.join(ROOT, 'repos.json'), 'utf8'))
const only = process.argv.slice(2)
for (const [repo, spec] of Object.entries(repos)) {
  if (only.length && !only.includes(repo)) continue
  const dir = path.join(OUT, repo)
  fs.mkdirSync(dir, { recursive: true })
  await render(social(repo, spec), 1280, 640, path.join(dir, 'social.png'))
  await render(banner(repo, spec), 1280, 400, path.join(dir, 'banner.png'))
  await render(card(repo, spec), 800, 400, path.join(dir, 'card.png'))
  console.log(`  ${repo}: banner.png, social.png, card.png`)
}
