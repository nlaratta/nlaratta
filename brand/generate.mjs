// Generates the shared look for every public nlaratta repo, using the same
// sage palette and Inter type as noahlaratta.com (scripts/generate-og.mjs there).
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
const FONT_DIR = path.join(ROOT, 'node_modules/@fontsource/inter/files')

const SAGE = '#2D6A4F'
const SAGE_LIGHT = '#52B788'
const SAGE_LIGHTER = '#D8F3DC'
const SAGE_DARK = '#1B4332'
const BG = '#FAFAF8'
const INK = '#1A1A1A'
const MUTED = '#6B7280'

const font = (weight) => ({
  name: 'Inter',
  data: fs.readFileSync(path.join(FONT_DIR, `inter-latin-${weight}-normal.woff`)),
  weight,
  style: 'normal',
})
const fonts = [font(400), font(600), font(700)]

const avatar = `data:image/jpeg;base64,${fs.readFileSync(path.join(ROOT, 'assets/me.jpg')).toString('base64')}`

const h = (type, props = {}, ...children) => ({
  type,
  props: { ...props, children: children.length <= 1 ? children[0] : children },
})
const row = (style, ...children) => h('div', { style: { display: 'flex', ...style } }, ...children)

const chips = (tags, size) =>
  row(
    { gap: `${size * 0.5}px`, flexWrap: 'wrap' },
    ...tags.map((t) =>
      row(
        {
          fontSize: `${size}px`,
          fontWeight: 600,
          color: SAGE_DARK,
          backgroundColor: SAGE_LIGHTER,
          padding: `${size * 0.35}px ${size * 0.8}px`,
          borderRadius: `${size * 2}px`,
        },
        t,
      ),
    ),
  )

// Decorative rings in the top-right corner, echoing the site's sage accents.
const rings = (scale) =>
  [
    [520, SAGE_LIGHTER, 1],
    [340, SAGE_LIGHT, 0.22],
  ].map(([d, color, opacity]) =>
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

const frame = (w, hgt, pad, scale, ...children) =>
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
        backgroundColor: BG,
        color: INK,
        fontFamily: 'Inter',
        position: 'relative',
        overflow: 'hidden',
      },
    },
    ...rings(scale),
    h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '16px', backgroundColor: SAGE, display: 'flex' } }),
    ...children,
  )

const eyebrow = (repo, size) =>
  row({ fontSize: `${size}px`, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: SAGE }, `nlaratta / ${repo}`)

function social(repo, { title, tagline, tags }) {
  return frame(
    1280,
    640,
    '72px 88px',
    1,
    eyebrow(repo, 26),
    row(
      { flexDirection: 'column', gap: '22px', maxWidth: '1000px' },
      row({ fontSize: title.length > 18 ? '76px' : '92px', fontWeight: 700, lineHeight: 1.05 }, title),
      row({ fontSize: '32px', color: MUTED, lineHeight: 1.3 }, tagline),
      row({ marginTop: '10px' }, chips(tags, 24)),
    ),
    row(
      { alignItems: 'center', gap: '18px' },
      h('img', { src: avatar, width: 64, height: 64, style: { borderRadius: '32px', border: `3px solid ${SAGE_LIGHT}` } }),
      row(
        { flexDirection: 'column' },
        row({ fontSize: '26px', fontWeight: 600 }, 'Noah Laratta'),
        row({ fontSize: '20px', color: MUTED }, 'github.com/nlaratta · noahlaratta.com'),
      ),
    ),
  )
}

function banner(repo, { title, tagline, tags }) {
  return frame(
    1280,
    400,
    '52px 88px',
    0.75,
    eyebrow(repo, 20),
    row(
      { flexDirection: 'column', gap: '14px', maxWidth: '1000px' },
      row({ fontSize: title.length > 18 ? '64px' : '76px', fontWeight: 700, lineHeight: 1.05 }, title),
      row({ fontSize: '28px', color: MUTED, lineHeight: 1.3 }, tagline),
    ),
    chips(tags, 20),
  )
}

// Compact project card for the profile README grid (no avatar footer).
function card(repo, { title, tagline, tags }) {
  return frame(
    800,
    400,
    '40px 52px 40px 60px',
    0.6,
    eyebrow(repo, 16),
    row(
      { flexDirection: 'column', gap: '12px' },
      row({ fontSize: title.length > 16 ? '46px' : '54px', fontWeight: 700, lineHeight: 1.05 }, title),
      row({ fontSize: '22px', color: MUTED, lineHeight: 1.3 }, tagline),
    ),
    chips(tags, 16),
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
