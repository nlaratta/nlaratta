# brand

Generates the README banner and GitHub social preview for each public repo, in the same sage and Inter style as noahlaratta.com.

```bash
cd brand
corepack pnpm install
corepack pnpm build                      # every repo in repos.json
corepack pnpm build wordle-solver        # just one
```

Output goes to `out/<repo>/banner.png` (1280×400; commit it as `.github/banner.png` in the repo) and `out/<repo>/social.png` (1280×640; upload it under Settings → General → Social preview). Edit `repos.json` to change a title, tagline or tags.
