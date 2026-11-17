import { defineCollection, defineContentConfig, z } from '@nuxt/content';

const navLink = z.object({
  label: z.string(),
  href: z.string()
});

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        cover: z.string().optional(),
        tags: z.array(z.string()).optional()
      })
    }),
    site: defineCollection({
      type: 'data',
      source: 'data/site.yml',
      schema: z.object({
        name: z.string(),
        fullName: z.string(),
        logoAlt: z.string(),
        nav: z.array(navLink),
        contact: navLink.extend({
          eyebrow: z.string(),
          heading: z.string(),
          highlight: z.string(),
          place: z.string(),
          sheet: z.string()
        })
      })
    }),
    links: defineCollection({
      type: 'data',
      source: 'data/links.yml',
      schema: z.object({
        links: z.array(z.object({
          title: z.string(),
          sub: z.string(),
          href: z.string()
        }))
      })
    })
  }
});
