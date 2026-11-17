# tsega.dev

Personal portfolio and blog of Tsegaselassie Tadesse, built as a fully static site.

- **Framework:** [Nuxt 4](https://nuxt.com) with static generation (`nitro.preset: 'static'`)
- **Content:** [Nuxt Content 3](https://content.nuxt.com) — Markdown blog posts in `content/`
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com) + `@tailwindcss/typography`
- **Fonts:** self-hosted at build time by `@nuxt/fonts` (Fraunces, Karla, JetBrains Mono, Pinyon Script)
- **Package manager / runtime:** [Bun](https://bun.sh)

## Getting started

```bash
bun install
bun run dev        # http://localhost:3000
```

| Command            | What it does                                              |
| ------------------ | --------------------------------------------------------- |
| `bun run dev`      | Dev server with hot reload                                |
| `bun run lint`     | Check code style with ESLint (`lint:fix` to auto-fix)     |
| `bun run typecheck`| Type check, including `.vue` files                        |
| `bun run generate` | Prerender the whole site to `.output/public`              |
| `bun run preview`  | Serve the generated output locally                        |

## Project layout

```
app/
  app.vue              # root component
  assets/css/main.css  # Tailwind entry + design tokens (@theme)
content/
  blog/*.md            # blog posts
content.config.ts      # content collections + frontmatter schema
design/
  portfolio.html       # reference design — source of truth for the UI port
public/                # copied as-is to the site root (CNAME, favicon, logo, robots.txt)
```

## Design tokens

The palette from `design/portfolio.html` lives in `app/assets/css/main.css` as Tailwind
theme variables, so utilities like `bg-bg`, `text-text-muted`, `border-border` and
`text-accent` work everywhere.

- **Espresso** (default): dark roast backgrounds, cream text, gold accent.
- **Forest**: add `data-theme="forest"` to any wrapper to switch it to the green palette
  used by the contact footer and blog call-to-action.

## Writing a blog post

Create `content/blog/<slug>.md`. The file name becomes the URL (`/blog/<slug>`).

```md
---
title: My post title
description: One-sentence summary used in listings and meta tags.
date: 2026-11-21
tags: [architecture, drupal]
cover: /images/blog/my-cover.jpg   # optional
---

Post body in Markdown.
```

`title`, `description` and `date` are required. The build fails if they're missing,
because `content.config.ts` validates them.

## Deployment

The site is hosted on **GitHub Pages** at <https://tsega.dev>.

- Every pull request runs `.github/workflows/deploy.yml`: lint, typecheck and
  `bun run generate`.
- Every push to `master` runs the same checks, then publishes `.output/public`.
- `public/CNAME` sets the custom domain. Don't delete it, or Pages drops `tsega.dev`.
- Work on a branch and open a PR. Merging to `master` deploys immediately.
