import type { BlogCollectionItem } from '@nuxt/content';
import { queryCollection } from '@nuxt/content/server';
import type { H3Event } from 'h3';

// Drafts are left out even in dev, so the feed always matches what
// subscribers would get from the published site.
function publishedPosts(event: H3Event): Promise<BlogCollectionItem[]> {
  return queryCollection(event, 'blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all();
}

/**
 * The blog's RSS 2.0 feed at `/rss.xml`, prerendered to a static file.
 * Only published posts are included, in dev too. With no published posts
 * it is a valid feed with no items.
 *
 * @throws 500 when `site.yml` or `sections.yml` is missing, which only
 * happens when the content build is broken.
 */
export default defineEventHandler(async (event) => {
  const [site, sections, posts] = await Promise.all([
    queryCollection(event, 'site').first(),
    queryCollection(event, 'sections').first(),
    publishedPosts(event)
  ]);
  if (!site || !sections) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Site data is missing'
    });
  }

  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8');
  return renderRss({
    title: `${sections.blog.title} — ${site.fullName}`,
    link: `${site.url}/blog`,
    self: `${site.url}/rss.xml`,
    description: sections.blog.description,
    items: posts.map(post => ({
      title: post.title,
      link: `${site.url}${post.path}`,
      description: post.description,
      date: post.date,
      category: post.category
    }))
  });
});
