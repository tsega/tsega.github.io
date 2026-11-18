/** One `<url>` in the sitemap. */
export interface SitemapEntry {
  /** Absolute URL of the page. */
  loc: string;
  /** When the page last changed; left out when unknown. */
  lastmod?: string | Date;
}

/**
 * Renders a sitemap.org XML sitemap. `lastmod` is written as a plain
 * `YYYY-MM-DD` date; entries without one simply have no `<lastmod>`.
 */
export function renderSitemap(entries: SitemapEntry[]): string {
  const urls = entries.map((entry) => {
    const lastmod = entry.lastmod
      ? `\n    <lastmod>${new Date(entry.lastmod).toISOString().slice(0, 10)}</lastmod>`
      : '';
    return `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>${lastmod}\n  </url>`;
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    ''
  ].join('\n');
}
