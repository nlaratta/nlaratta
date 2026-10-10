# Public repo standards

Every original public repo under `github.com/nlaratta` follows this checklist so they look and behave like one body of work. Forks are exempt.

## Checklist

- [ ] **Banner** at `.github/banner.png`, generated from [`brand/`](brand/) (`pnpm build <repo>`).
- [ ] **Social preview** set to `brand/out/<repo>/social.png` (Settings → General → Social preview; there is no API for this, so it's set by hand).
- [ ] **README** follows the template below. Its Quick start must work verbatim on a clean macOS or Linux machine.
- [ ] **CI** at `.github/workflows/ci.yml`, named `CI`, running on push and PR to `main`. It proves the project builds and runs, not just that it lints.
- [ ] **License:** MIT, `Copyright (c) <year> Noah Laratta`. The exception is the personal site (`noahlaratta`): its code is readable, but the content, photos and branding aren't licensed for reuse.
- [ ] **About sidebar:** a one-sentence description, 3–6 topics, and a homepage link if there's a live site or demo.
- [ ] **Hygiene:** no secrets, no generated or local-only files (dumps, lock/temp files, `node_modules`, venvs), and a `.gitignore` that matches the stack.

## README template

```markdown
<p align="center">
  <img src=".github/banner.png" alt="<Title>" width="100%">
</p>

<p align="center">
  <a href="https://github.com/nlaratta/<repo>/actions/workflows/ci.yml"><img src="https://github.com/nlaratta/<repo>/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-2D6A4F" alt="MIT license"></a>
  <!-- optional: <a href="<demo url>"><img src="https://img.shields.io/badge/demo-live-52B788" alt="Live demo"></a> -->
</p>

<One or two sentences: what it is and why it exists.>

<!-- optional: a screenshot or GIF -->

## Quick start

<The exact commands, copy-pasteable, that get it running from a fresh clone.>

## How it works

<Features or design. Short bullets or a few paragraphs.>

## Project structure   <!-- optional; include when there are more than a handful of files -->

## License

[MIT](LICENSE) © Noah Laratta
```

Keep READMEs honest and brief. Leave a section out rather than pad it, and never claim features the code doesn't have.

## CI conventions

- Use current major versions of actions: `actions/checkout@v7`, `actions/setup-node@v7`, `actions/setup-python@v7`, `actions/setup-java@v6`, `astral-sh/setup-uv@v10`, and Pages via `configure-pages@v6`, `upload-pages-artifact@v5`, `deploy-pages@v5`.
- Use lockfile installs (`npm ci`, `uv pip sync` or a pinned `requirements.txt`).
- Static sites deploy with the GitHub Pages workflow, not by committing build output.

## Brand

Sage palette and Inter type, matching [noahlaratta.com](https://noahlaratta.com): `#2D6A4F` sage, `#52B788` light, `#D8F3DC` lighter, `#1B4332` dark, `#FAFAF8` background. Edit `brand/repos.json` to change a repo's title, tagline or tags, then regenerate.
