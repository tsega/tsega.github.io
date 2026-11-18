# AGENTS.md

Rules for working on this codebase. They apply to people and to AI coding assistants.

## Project

The personal portfolio and blog of Tsegaselassie "Tsega" Tadesse, live at <https://tsega.dev>. It is a fully static site: a single-page portfolio ported from the reference design in `design/portfolio/index.dc.html`, plus a Markdown blog.

Work is tracked as GitHub issues in [`tsega/tsega.github.io`](https://github.com/tsega/tsega.github.io/issues), grouped by milestone.

## Stack

- Nuxt 4 (Vue) and TypeScript, generated as a static site (`nitro.preset: 'static'`)
- Nuxt Content 3 for blog posts and homepage data
- Tailwind CSS 4 with `@tailwindcss/typography`; design tokens live in `app/assets/css/main.css`
- `@nuxt/fonts` to self-host fonts at build time (Archivo, Pinyon Script)
- Bun as runtime, package manager and script runner
- GitHub Pages for hosting, deployed by `.github/workflows/deploy.yml`

## Layout

- `app/`: Vue pages, layouts, components, composables (Nuxt 4 app directory)
- `app/assets/css/main.css`: Tailwind entry point and design tokens
- `content/blog/`: blog posts, one Markdown file per post
- `content/data/`: homepage copy as YAML (experience, projects, skills and so on)
- `content.config.ts`: content collections; `content.schemas.ts`: their zod schemas
- `modules/`: local Nuxt modules, such as the content schema check
- `design/portfolio/`: the reference design exported from Claude Design; not deployed
- `eslint/`: our own lint rules
- `public/`: copied as-is to the site root (`CNAME`, favicon, images, `robots.txt`)

## Commands

```bash
bun install          # install dependencies
bun run dev          # start the dev server at http://localhost:3000
bun run lint         # check code style (ESLint)
bun run lint:fix     # fix what ESLint can fix automatically
bun run typecheck    # type check, including .vue files (vue-tsc)
bun run generate     # prerender the whole site to .output/public
bun run preview      # serve the generated site locally
```

There is no test runner yet. Never use `bun test`: it starts Bun's own test runner, which can't run Nuxt code. A change is done when `bun run lint`, `bun run typecheck` and `bun run generate` all succeed. `generate` also checks every post's frontmatter and every data file against `content.schemas.ts`, and fails on a mismatch.

## Workflow

- `master` is the default branch. Never commit directly to it.
- **Merging to `master` deploys to production** (GitHub Pages, tsega.dev) within a minute or two. There are no preview deploys, so check the generated site locally first. CI (`.github/workflows/deploy.yml`) runs lint, typecheck and the build on every pull request, and those checks must pass before merging.
- Work on a branch per issue, named `<type>/<issue>-<slug>`, for example `feature/2-app-shell` or `fix/14-rss-dates`. Branches created by Claude in cloud sessions start with `claude/`.
- Open a pull request into `master` that references its issue (`Closes #2`). Keep pull requests small and focused on one issue.
- All changes are reviewed by the project owner before they are committed. AI coding assistants leave changes uncommitted in the working tree and never commit automatically; they commit only when told to, after the review.
- AI coding assistants never open, close or merge pull requests, and never push, unless asked to in that moment.
- Pull `master` before starting new work.

## Commit messages

Every commit message follows this layout:

```text
<type>(<optional-scope>): <short-summary-in-imperative-mood>

- <change, described by its effect>
- <change, described by its effect>

<optional-footer>
```

- **Types:** `feat` (new feature), `fix` (bug fix), `refactor` (restructure without changing behavior), `docs` (documentation and Markdown only), `style` (formatting and whitespace), `test` (adding or changing tests), `chore` (builds, dependencies, configuration), `perf` (runtime performance), `ci` (pipelines and automation). Blog posts are Markdown only, so they use `docs(blog): ...`.
- **Subject:** imperative mood ("add", "fix", "refactor", never "added" or "fixes"). Lowercase after the type and scope. No trailing period. Aim for 50 characters, never more than 70. It must complete the sentence "If applied, this commit will ...".
- **Body:** one blank line after the subject, then a short bulleted list of the changes. Lead with the effect of each change (what is different for visitors, readers or the developer) rather than the code that changed. Skip the how; the diff shows it. Wrap lines at 72 characters.
- **Footer:** the issue reference (`Closes #5` when merging closes the issue, otherwise `Refs #5`) and any breaking change, such as `BREAKING CHANGE: <what breaks>`. Do not add `Co-Authored-By` lines or other AI attribution to commit messages or pull request descriptions.

## Design and user interface

- `design/portfolio/index.dc.html` is the source of truth for how the site looks. Match its layout, spacing, type and colours: 1200px content width, `clamp(20px, 4vw, 48px)` gutters, the 760px mobile breakpoint, Archivo for text, Pinyon Script for the hero name, flat surfaces with zero corner radius and strong 2px rules. Don't edit it as part of feature work; a design change is its own change.
- The design is a Claude Design export, not production code. It uses inline styles, `{{ }}` bindings, `<sc-if>`/`<sc-for>` and `<image-slot>` elements, and the list data (projects, skills, experience, links) lives in the `DCLogic` script at the bottom of the file. Translate it into Vue components, Tailwind utilities and content data; never copy the inline styles or the runtime scripts (`support.js`, `image-slot.js`).
- Its `_ds/` folder is the Modernist design system the layout was built on. Follow its structural rules (flat, 0 radius, 2px dividers, flush-left labels), but take colours from the page, not from `_ds/styles.css`: the page overrides its red palette with espresso and gold.
- The photos embedded in `.image-slots.state.json` are previews only. Production images come from the originals through `bun run image`.
- Use the design tokens through Tailwind utilities (`bg-bg`, `text-text-muted`, `border-border`, `text-accent` and so on). Never hard-code the palette's hex values in components. Switch a block to the green palette with `data-theme="forest"`.
- Style with Tailwind utility classes. Write custom CSS only for what utilities can't express (keyframes, layered gradients, blend modes), in `main.css` or a component's scoped `<style>`. No static inline styles.
- Do not add component libraries or UI kits. Shared pieces (buttons, chips, section heads) become components in `app/components/`.
- The site is prerendered: every piece of content must be in the generated HTML and readable without JavaScript. Animations (terminal typing, scroll reveals) are progressive enhancements that start from visible content.
- Every animation and transition respects `prefers-reduced-motion`.
- Accessibility is part of every user interface change, never a separate task. Meet WCAG 2.2 AA, and check each change with the keyboard, at desktop and phone widths, and with an automated checker such as axe-core. Fix what you find in the same change.
- Keep visible `:focus-visible` styles on every link and control; never remove focus outlines. Use semantic HTML first (`header`, `nav`, `main`, `footer`, lists for lists) and one `h1` per page. Give icon-only controls an accessible name.
- Vue components follow these rules, mostly enforced by ESLint: `<script setup lang="ts">` first, then the template, then the style; props and emits declared with types, with a docblock on each prop field; one attribute per line when there are several; no static inline styles; and no `v-html` (render Markdown with `<ContentRenderer>`).
- Move complex template expressions into computed properties. Name composables `useX`, return a plain object of refs, and clean up what they start (observers, timers, listeners) when the component unmounts.
- A component's filename includes its folder path, so its file and its auto-imported name match: `app/components/Home/HomeHero.vue` is `<HomeHero>`. Components have names of more than one word; pages and layouts may have one.

## Content rules

- Homepage copy lives in `content/data/` YAML files, not in templates.
- Blog posts live in `content/blog/<slug>.md`; the file name is the URL. Frontmatter must match the schema in `content.schemas.ts`.
- Facts about Tsega (roles, employers, dates, projects, metrics, certifications) come from the existing content or from Tsega. Never invent, round up or embellish them. When a fact looks wrong or inconsistent, flag it instead of fixing it silently.
- Don't write blog posts or homepage copy in Tsega's voice unless asked. Placeholder text is clearly marked as placeholder.
- Images are self-hosted under `public/images/`, never hotlinked. Never commit an original straight from a camera or phone: it carries metadata (EXIF, including GPS location, XMP and IPTC) and is far too large.
- Add photos with `bun run image <source> <name> <width...>`. It strips all metadata and writes the smallest AVIF and JPEG that reach a SSIMULACRA 2 score of 80 (no visible difference side by side) at each width. Generate the widths the image is actually shown at, at 1× and 2×, and serve them with `<picture>`, `srcset` and `sizes`: AVIF first, JPEG as the fallback. Don't hand-tune quality settings or add WebP; AVIF is about half the size of WebP at the same quality.
- Illustrations and placeholders are hand-written SVG in the palette's colours. Every image has meaningful alt text (or `alt=""` when decorative), and third-party photos credit the photographer.

## Code rules

- TypeScript for all new code.
- Add a TSDoc docblock to everything exported from `app/composables/`, `app/utils/` and `server/`, to each Vue prop field, and to private helpers whose behavior is surprising. Say what the signature can't: the purpose, edge cases and how it fails. Don't repeat the name or the types, and use `@param`, `@returns` and `@throws` only when they add information. ESLint requires the docblocks on exports and prop fields and rejects types in them; it can't judge quality. Whoever writes the code, including AI coding assistants, writes a docblock that says something useful.
- Code style is enforced by ESLint (`@nuxt/eslint`, configured in `eslint.config.mjs`): semicolons at the end of statements, single quotes and no trailing commas. Run `bun run lint:fix` before finishing; `bun run lint` must pass.
- Write code that reads top to bottom rather than left to right. ESLint enforces curly braces on every block, including one-line `if` and `for`; comments of at most 80 characters and code of at most 100; and one property per line in objects with two or more. Vue blocks are limited to 150 lines of script or template and 50 of style; split a component before it gets there. Prefer small functions to deep nesting.
- Comments use `//`. `/** */` is only for docblocks directly above a declaration, a class or interface member, or an object property. ESLint enforces this with our own rule (`eslint/comment-style.mjs`).
- Don't turn off a lint rule to get past it. When a rule really doesn't fit, disable it for that one line with a comment saying why, or change the config in its own change.
- Everything in this site is public: the whole build is shipped to the browser. Never put secrets, tokens or private data in the code, the content or `runtimeConfig`.
- Server routes (`server/`) exist only to be prerendered (RSS, sitemap). Add each one to `nitro.prerender.routes` or make sure the crawler reaches it.
- Commit `bun.lock`: it locks the exact version of every package. Version ranges (`^`) in `package.json` are fine.
- CI installs with `bun install --frozen-lockfile`.
- The Bun version lives in `.bun-version` and the Node major version in `.node-version`; CI reads both, so local and CI match. Change them on purpose, together with `engines` in `package.json` for Node, and check that CI passes.
- Update dependencies on purpose: run `bun update`, check that `bun run generate` still succeeds, and commit the updated lockfile as its own change.
- Before adding a package with native code, check it works on Bun and on the CI runner (`ubuntu-latest`).
- Never remove `public/CNAME`. Without it GitHub Pages drops the `tsega.dev` custom domain.

## Documentation

- `README.md` is the documentation for people. Update it when commands, layout, content formats or deployment change.
- Update this file when a new convention is agreed.
