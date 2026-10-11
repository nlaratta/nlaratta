# brand

Generates the README banner and GitHub social preview for each public repo, in the same sage and Inter style as noahlaratta.com.

```bash
cd brand
corepack pnpm install
corepack pnpm build                      # every repo in repos.json
corepack pnpm build wordle-solver        # just one
```

Output goes to `out/<repo>/banner.png` (1280×400; commit it as `.github/banner.png` in the repo) and `out/<repo>/social.png` (1280×640; upload it under Settings → General → Social preview). Edit `repos.json` to change a title, tagline or tags.

An entry with `"owner": "larattalabs"` is a Laratta Labs repo: it renders in the studio theme (ink, rust and iron, JetBrains Mono labels, the studio mark from `assets/larattalabs.png`), its eyebrow reads `larattalabs / <repo>`, and `pnpm readme` expects it under `profile.json` → `labs.openSource` instead of a category. See [larattalabs/.github STANDARDS.md](https://github.com/larattalabs/.github/blob/main/STANDARDS.md).
