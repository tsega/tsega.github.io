import type { BlogCollectionItem } from '@nuxt/content';
import { queryCollection } from '@nuxt/content/server';
import type { H3Event } from 'h3';

// Drafts never reach the generated site, so they never belong here.
function publishedPosts(event: H3Event): Promise<BlogCollectionItem[]> {
  return queryCollection(event, 'blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all();
}

/**
 * `/sitemap.xml` for search engines, prerendered to a static file. Lists
 * the homepage, the blog index and every published post; each post's
 * `lastmod` is its date, and the index takes the newest post's date.
 *
 * @throws 500 when `site.yml` is missing, which only happens when the
 * content build is broken.
 */
export default defineEventHandler(async (event) => {
  const [site, posts] = await Promise.all([
    queryCollection(event, 'site').first(),
    publishedPosts(event)
  ]);
  if (!site) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Site data is missing'
    });
  }

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  return renderSitemap([
    { loc: `${site.url}/` },
    {
      loc: `${site.url}/blog`,
      lastmod: posts[0]?.date
    },
    ...posts.map(post => ({
      loc: `${site.url}${post.path}`,
      lastmod: post.date
    }))
  ]);
});
