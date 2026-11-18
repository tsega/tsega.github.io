import type { SiteCollectionItem } from '@nuxt/content';

/** What a page tells search engines and social previews about itself. */
export interface PageSeo {
  /** Page title; the `%s · Tsega.dev` template is added unless `fullTitle`. */
  title: string;
  /** One or two sentences for search results and link previews. */
  description: string;
  /** Use `title` as is, without the site template (the homepage). */
  fullTitle?: boolean;
  /** Root-relative image path; defaults to the site's social image. */
  image?: string;
  /** Alt text for `image`. */
  imageAlt?: string;
  /** `article` for blog posts, `website` for everything else. */
  type?: 'website' | 'article';
}

/**
 * Sets the title, description, canonical URL, Open Graph and Twitter card
 * tags for the current page. Absolute URLs are built from `url` in
 * `content/data/site.yml`, so they point at tsega.dev even in dev.
 *
 * @param seo A getter, so the tags follow data that loads asynchronously;
 * nothing beyond the defaults in `nuxt.config.ts` is set while it returns
 * null or undefined.
 */
export async function usePageSeo(seo: () => PageSeo | null | undefined) {
  // Every head call must come before the first await, or Nuxt loses the
  // component they belong to. This reads the same cache entry as useSite.
  const route = useRoute();
  const { data: site } = useNuxtData<SiteCollectionItem | null>('site');

  const absolute = (path: string) => `${site.value?.url ?? ''}${path}`;
  const canonical = computed(() => absolute(route.path));
  const image = computed(() => absolute(seo()?.image ?? site.value?.seo.image ?? ''));
  const imageAlt = computed(() => seo()?.imageAlt ?? site.value?.seo.imageAlt);

  useHead({
    titleTemplate: () => (seo()?.fullTitle ? '%s' : '%s · Tsega.dev'),
    link: [{
      rel: 'canonical',
      href: canonical
    }]
  });

  useSeoMeta({
    title: () => seo()?.title,
    description: () => seo()?.description,
    ogTitle: () => seo()?.title,
    ogDescription: () => seo()?.description,
    ogType: () => seo()?.type ?? 'website',
    ogUrl: canonical,
    ogSiteName: () => site.value?.fullName,
    ogImage: image,
    ogImageAlt: imageAlt,
    twitterCard: 'summary_large_image',
    twitterImageAlt: imageAlt
  });

  await useSite();
}
