import type { BlogCollectionItem } from '@nuxt/content';

/** A schema.org object, rendered as JSON-LD. */
export type JsonLd = Record<string, unknown>;

/**
 * A `<script type="application/ld+json">` entry for `useHead`. Every `<`
 * is escaped, so text from the content can never close the script tag.
 */
export function jsonLdScript(data: JsonLd) {
  return {
    type: 'application/ld+json' as const,
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      ...data
    }).replace(/</g, '\\u003c')
  };
}

/** The facts about Tsega that `personLd` needs, all from the content. */
export interface PersonFacts {
  /** Full name, e.g. "Tsegaselassie Tadesse". */
  name: string;
  /** Short name, e.g. "Tsega Tadesse". */
  alternateName: string;
  /** Current role, from the hero. */
  jobTitle: string;
  /** Site origin. */
  url: string;
  /** Absolute URL of the headshot. */
  image: string;
  /** Profile URLs elsewhere (LinkedIn, GitHub and so on). */
  sameAs: string[];
}

/**
 * schema.org `Person` for the homepage.
 */
export function personLd(facts: PersonFacts): JsonLd {
  return {
    '@type': 'Person',
    ...facts
  };
}

/**
 * schema.org `BlogPosting` for a post page. Posts have no "updated" date
 * yet, so `dateModified` repeats the publication date, as Google expects
 * one of the two to be present and treats them alike.
 *
 * @param post The post, from the blog collection.
 * @param url Absolute URL of the post.
 * @param image Absolute URL of the post's image (its cover or the default).
 * @param author The author's `Person`, without the `@context`.
 */
export function blogPostingLd(
  post: BlogCollectionItem,
  url: string,
  image: string,
  author: JsonLd
): JsonLd {
  return {
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.description,
    'datePublished': isoDate(post.date),
    'dateModified': isoDate(post.date),
    'articleSection': post.category,
    'keywords': post.tags?.join(', '),
    url,
    image,
    author,
    'mainEntityOfPage': url
  };
}
