# tsega.dev

Personal portfolio and blog of Tsegaselassie Tadesse, built as a fully static site.

- **Framework:** [Nuxt 4](https://nuxt.com) with static generation (`nitro.preset: 'static'`)
- **Content:** [Nuxt Content 3](https://content.nuxt.com) — Markdown blog posts in `content/`
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com) + `@tailwindcss/typography`
- **Fonts:** self-hosted at build time by `@nuxt/fonts` (Archivo, Pinyon Script)
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
  components/          # AppHeader, AppFooter and shared pieces (SectionHead, ...)
  layouts/default.vue  # header, main and footer around every page
  assets/css/main.css  # Tailwind entry + design tokens (@theme)
content/
  blog/*.md            # blog posts
  data/*.yml           # homepage and site copy, one file per section (see below)
content.config.ts      # content collections
content.schemas.ts     # their schemas, checked on every build
modules/               # local Nuxt modules (content schema check)
server/routes/         # prerendered server routes (rss.xml, sitemap.xml)
scripts/og-image.html  # source of the default social preview image
design/
  portfolio/           # reference design from Claude Design — source of truth for the UI port
public/                # copied as-is to the site root (CNAME, favicon, logo, og-image.png, robots.txt)
```

## Design tokens

The palette from the reference design lives in `app/assets/css/main.css` as Tailwind
theme variables, so utilities like `bg-bg`, `text-text-muted`, `border-border` and
`text-accent` work everywhere.

- **Espresso** (default): dark roast surfaces (`bg`, `bg-elevated`, `bg-sunken`,
  `bg-hover`), cream text (`text`, `heading`, `text-muted`), three rule weights
  (`border` for 2px dividers, `border-strong`, `border-subtle` for 1px rows) and the gold
  accent (`accent`, `accent-bright` on hover, `accent-pressed`).
- **Forest**: add `data-theme="forest"` to a wrapper to switch it to the green palette
  used by the Writing section.
- `md:` is the design's single breakpoint, 760px. `page-width` gives the 1200px content
  column with its fluid side gutters.

## Adding images

Keep original photos **outside** the repo. Camera and phone files carry metadata such as GPS
location, and anything in `public/` is published. Generate web versions with:

```bash
bun run image ~/Pictures/photo.jpg my-photo 400 800
```

This writes `public/images/my-photo-400.avif`, `my-photo-400.jpg` and so on. Each file is the
smallest one that still looks the same as the original: the script searches for the lowest
quality setting that reaches a [SSIMULACRA 2](https://github.com/cloudinary/ssimulacra2)
score of 80 (pass `--target=85` for more headroom). All metadata is removed, and widths
larger than the source are skipped rather than upscaled.

Crop to the shape the layout shows, so no hidden pixels are shipped:

| Option           | Effect                                                              |
| ---------------- | ------------------------------------------------------------------- |
| `--aspect=3:1`   | Crop to this aspect ratio before resizing                           |
| `--gravity=north`| Which part to keep: `center`, `north`, `south`, `east`, `west`, `attention` |
| `--focus=0.25`   | Exact crop position, 0 (top/left) to 1 (bottom/right)               |
| `--grayscale`    | Bake in black and white, for images the design always shows that way |

The images on the site were generated with:

```bash
P=../../resources/pictures
bun run image <headshot.jpg> tsega-headshot 320 480 640 --aspect=4:5 --grayscale
bun run image "$P/photo_2026-10-04 09.53.28.jpeg" band-acacia 768 960 --aspect=3:1
bun run image "$P/header_one.jpg" band-babogaya-lake 768 1280 1900
bun run image "$P/IMG_20190512_183517.jpg" band-almadies 768 1280 1920 2560 --aspect=3:1 --focus=0.25
bun run image "$P/IMG_20190515_131442.jpg" community-training 480 768 1080
```

It needs the `ssimulacra2` tool from libjxl: `brew install jpeg-xl`.

## Homepage copy

All homepage text lives in YAML files in `content/data/`, never in templates. Each file is
a Nuxt Content `data` collection with a schema in `content.schemas.ts`, read with
`queryCollection('<name>').first()`.

| File              | Holds                                                           |
| ----------------- | --------------------------------------------------------------- |
| `site.yml`        | Header nav and the contact footer copy                          |
| `links.yml`       | The contact links                                               |
| `sections.yml`    | Section eyebrows, headings and "Sheet" labels, and the `/blog` page |
| `profile.yml`     | Hero, stats, About (facts, highlights, headshot)                |
| `photos.yml`      | The four photo bands: image, alt text, captions                 |
| `projects.yml`    | Flagship systems and "Further work"                             |
| `skills.yml`      | Skill groups and the projects that used each skill              |
| `experience.yml`  | The experience timeline                                         |
| `education.yml`   | Education and certification                                     |
| `community.yml`   | Community statement, cards, photo and timeline                  |

## Writing a blog post

Create `content/blog/<slug>.md`. The file name becomes the URL (`/blog/<slug>`).

```md
---
title: My post title
description: One-sentence summary used in listings and meta tags.
date: 2026-11-21
category: Architecture             # kicker above the title
format: Long read                  # optional, shown beside the kicker
tags: [architecture, drupal]       # optional
cover: /images/blog/my-cover.jpg   # optional
coverAlt: What the cover shows     # optional; leave out if decorative
draft: true                        # optional; drafts only show in `bun run dev`
---

Post body in Markdown.
```

The newest post is featured in the homepage's Writing section and the next two
are listed beside it. Every post is listed, newest first, on `/blog`; its heading,
page title, description and empty-state text are the `blog` block in
`content/data/sections.yml`. With no published posts both places show
"First posts coming soon".

Each post is rendered at `/blog/<slug>` with its category, date, an estimated
reading time (220 words a minute, code not counted), tags, the optional cover,
and links to the newer and older posts. Fenced code blocks are highlighted by
Shiki with the `gruvbox-dark-medium` theme; the languages it loads are listed in
`content.build.markdown.highlight.langs` in `nuxt.config.ts`, so add a language
there before using it. Headings (h2 to h4) link to themselves. Put post images
in `public/images/blog/` and generate them with `bun run image`.

Published posts also go into the RSS feed at `/rss.xml` (`server/routes/rss.xml.ts`),
newest first, with each post's title, description, date and category. Drafts
are never in the feed, not even in `bun run dev`. Absolute links in the feed use `url` from
`content/data/site.yml`. The "Subscribe" button in the Writing section links to the feed.

`title`, `description`, `date` and `category` are required. The build fails if they're missing,
because `modules/content-validation.ts` checks every post and data file against
`content.schemas.ts`. The error names the file and each field that's wrong. In
`bun run dev` the same problems are printed in the terminal instead.

## Search and social previews

Each page sets its title, description, canonical URL and Open Graph / Twitter
tags with `usePageSeo` (`app/composables/usePageSeo.ts`). Titles get the
` · Tsega.dev` suffix except on the homepage, whose title and description are
`seo` in `content/data/site.yml`.

- **Social image:** `public/og-image.png` (1200×630) is used for every page
  without its own image. A post with a `cover` uses the cover instead, so make
  covers at least 1200×630. The PNG is a screenshot of `scripts/og-image.html`;
  the command to regenerate it is at the top of that file.
- **Structured data:** the homepage has a JSON-LD `Person` (name, role, headshot
  and the profile links from `links.yml`); each post has a `BlogPosting`.
- **Sitemap:** `/sitemap.xml` lists the homepage, `/blog` and every published
  post (`server/routes/sitemap.xml.ts`); `public/robots.txt` points to it.

## Deployment

The site is hosted on **GitHub Pages** at <https://tsega.dev>.

- Every pull request runs `.github/workflows/deploy.yml`: lint, typecheck and
  `bun run generate`.
- Every push to `master` runs the same checks, then publishes `.output/public`.
- `public/CNAME` sets the custom domain. Don't delete it, or Pages drops `tsega.dev`.
- Work on a branch and open a PR. Merging to `master` deploys immediately.
