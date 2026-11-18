const XML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&apos;'
};

/**
 * Escapes text for use inside an XML element or attribute value.
 */
export function escapeXml(text: string): string {
  return text.replace(/[&<>"']/g, char => XML_ESCAPES[char] ?? char);
}

/** One `<item>` in the feed. */
export interface RssItem {
  /** Post title. */
  title: string;
  /** Absolute URL of the post; also used as its permanent guid. */
  link: string;
  /** One-sentence summary shown by feed readers. */
  description: string;
  /** Publication date, as an ISO string or Date from the content. */
  date: string | Date;
  /** The post's category kicker. */
  category: string;
}

/** The `<channel>` of the feed. */
export interface RssChannel {
  /** Feed title shown in readers. */
  title: string;
  /** Absolute URL of the blog index. */
  link: string;
  /** Absolute URL of the feed itself, for the `atom:link rel="self"`. */
  self: string;
  /** What the feed is about. */
  description: string;
  /** Items, newest first. */
  items: RssItem[];
}

function renderItem(item: RssItem): string {
  return [
    '    <item>',
    `      <title>${escapeXml(item.title)}</title>`,
    `      <link>${escapeXml(item.link)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(item.link)}</guid>`,
    `      <pubDate>${new Date(item.date).toUTCString()}</pubDate>`,
    `      <category>${escapeXml(item.category)}</category>`,
    `      <description>${escapeXml(item.description)}</description>`,
    '    </item>'
  ].join('\n');
}

/**
 * Renders an RSS 2.0 document. `lastBuildDate` is the newest item's date
 * rather than the build time, so rebuilding without new posts leaves the
 * feed byte-for-byte unchanged; it is left out when there are no items.
 */
export function renderRss(channel: RssChannel): string {
  const newest = channel.items[0];
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(channel.title)}</title>`,
    `    <link>${escapeXml(channel.link)}</link>`,
    `    <description>${escapeXml(channel.description)}</description>`,
    '    <language>en</language>',
    `    <atom:link href="${escapeXml(channel.self)}" rel="self" type="application/rss+xml"/>`
  ];
  if (newest) {
    lines.push(`    <lastBuildDate>${new Date(newest.date).toUTCString()}</lastBuildDate>`);
  }
  lines.push(...channel.items.map(renderItem), '  </channel>', '</rss>', '');
  return lines.join('\n');
}
