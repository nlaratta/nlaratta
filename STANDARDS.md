# Public repo standards

Every original public repo under `github.com/nlaratta` follows this checklist so they look and behave like one body of work. Forks are exempt.

Repos under `github.com/larattalabs` follow the org's own [Laratta Labs standards](https://github.com/larattalabs/.github/blob/main/STANDARDS.md), which build on this file (Laratta Labs copyright, studio branding, GitHub Packages releases).

## Checklist

- [ ] **Banner** at `.github/banner.png`, generated from [`brand/`](brand/) (`pnpm build <repo>`).
- [ ] **Social preview** set to `brand/out/<repo>/social.png` (Settings → General → Social preview; there is no API for this, so it's set by hand).
- [ ] **README** follows the template below. Its Quick start must work verbatim on a clean macOS or Linux machine.
- [ ] **CI** at `.github/workflows/ci.yml`, named `CI`, running on push and PR to `main`. It proves the project builds and runs, not just that it lints.
- [ ] **License:** MIT, `Copyright (c) <year> Noah Laratta`. The exception is the personal site (`noahlaratta`): its code is readable, but the content, photos and branding aren't licensed for reuse.
- [ ] **About sidebar:** a one-sentence description, 3–6 topics, and a homepage link if there's a live site or demo.
- [ ] **Profiles:** listed on the profile README(s) and noahlaratta.com, per [Profile READMEs](#profile-readmes).
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

- Use current major versions of actions: `actions/checkout@v7`, `actions/setup-node@v7`, `actions/setup-python@v7`, `actions/setup-java@v6`, `astral-sh/setup-uv@v10.3.0` (it publishes no floating major tag), and Pages via `configure-pages@v6`, `upload-pages-artifact@v5`, `deploy-pages@v5`.
- Use lockfile installs (`npm ci`, `uv pip sync` or a pinned `requirements.txt`).
- Static sites deploy with the GitHub Pages workflow, not by committing build output.

## Brand

Sage palette and Inter type, matching [noahlaratta.com](https://noahlaratta.com): `#2D6A4F` sage, `#52B788` light, `#D8F3DC` lighter, `#1B4332` dark, `#FAFAF8` background. Edit `brand/repos.json` to change a repo's title, tagline or tags, then regenerate.

## Profile READMEs

Two profile READMEs and a few related surfaces need to stay in step with the repos:

| Surface | Lives in | How it's maintained |
|---|---|---|
| github.com/nlaratta | `README.md` in this repo | The intro is hand-written. Everything between `<!-- projects:start -->` and `<!-- projects:end -->` is **generated**: edit `brand/repos.json` and `brand/profile.json`, then run `pnpm readme` in `brand/`. Never hand-edit the generated block. |
| github.com/larattalabs | `profile/README.md` in [larattalabs/.github](https://github.com/larattalabs/.github) | Hand-written: the intro, a Products list, and an "Open source" table. |
| Pins | github.com/nlaratta and github.com/larattalabs | Set by hand in the browser (6 max each). |
| noahlaratta.com | `lib/projects.ts` and `lib/experience.ts` in [noahlaratta](https://github.com/nlaratta/noahlaratta) | Project pages and experience. Merging deploys, so it needs Noah's OK. |

**Update them whenever one of these happens:**

| Event | nlaratta profile | larattalabs profile | Also |
|---|---|---|---|
| A personal repo goes public | Add it to `repos.json` and a category in `profile.json`, then `pnpm build <repo>` and `pnpm readme` | — | Add a site project page; consider a pin |
| An org repo goes public | Add it to `profile.json` → `labs.openSource` (plus `repos.json` with `"owner": "larattalabs"` if it gets a banner), then `pnpm readme` | Add a row to the "Open source" table | Add a site project page; consider an org pin |
| A repo is renamed | Rename its `repos.json` key, fix its `profile.json` references, regenerate (`pnpm build`, `pnpm readme`) | Update the table link | Update the site slug and leave a redirect page (FTP deploys don't delete); re-upload the social preview |
| A repo is archived, made private or deleted | Remove it from `repos.json` and `profile.json`, run `pnpm readme` | Remove its table row | Remove or mark its site page; unpin it |
| A product launches or changes (App Store, website) | Update `profile.json` → `labs.products` | Update the Products list | Update the site project and the Laratta Labs entries |
| Featured work changes | Rotate `profile.json` → `featured` (always 4) | — | Pins |
| Role, bio or location changes | Rewrite the hand-written intro | Rewrite the intro if the studio description changes | Update the GitHub profile fields (name, bio, company, links), `lib/experience.ts` and the site's About page |

`pnpm readme` fails if any `repos.json` entry isn't placed in a `profile.json` category, so a repo can't silently drop off the profile. Keep the two profiles' descriptions of shared projects consistent with each other and with noahlaratta.com.
