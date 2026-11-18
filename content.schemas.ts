// Schemas for every content collection. Kept apart from content.config.ts
// so the build check in modules/content-validation.ts can import them
// without loading Nuxt Content.
import { z } from 'zod';

const link = z.object({
  label: z.string(),
  href: z.string()
});

const labelled = z.object({
  label: z.string(),
  value: z.string()
});

// An image made by `bun run image`, or a placeholder file ending in .svg.
const picture = z.object({
  image: z.string(),
  widths: z.array(z.number().int()
    .positive()).optional(),
  alt: z.string()
});

const sectionHead = z.object({
  eyebrow: z.string(),
  heading: z.string().optional(),
  sheet: z.string()
});

const timelineEntry = z.object({
  date: z.string(),
  role: z.string(),
  org: z.string()
});

const blog = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  // Kicker shown above the title, e.g. "Architecture".
  category: z.string(),
  // Optional label beside the kicker, e.g. "Long read".
  format: z.string().optional(),
  // Drafts are listed in dev and left out of the production build.
  draft: z.boolean().default(false),
  cover: z.string().optional(),
  // Describes the cover; leave it out when the cover is decorative.
  coverAlt: z.string().optional(),
  tags: z.array(z.string()).optional()
});

const site = z.object({
  name: z.string(),
  fullName: z.string(),
  logoAlt: z.string(),
  nav: z.array(link),
  contact: link.extend({
    eyebrow: z.string(),
    heading: z.string(),
    highlight: z.string(),
    place: z.string(),
    sheet: z.string()
  })
});

const links = z.object({
  links: z.array(z.object({
    title: z.string(),
    sub: z.string(),
    href: z.string()
  }))
});

const sections = z.object({
  about: sectionHead,
  writing: sectionHead.extend({
    readMore: z.string(),
    empty: z.string(),
    subscribe: link.extend({
      text: z.string()
    })
  }),
  work: sectionHead,
  community: sectionHead,
  skills: sectionHead,
  experience: sectionHead,
  // The /blog index page, not a homepage section.
  blog: sectionHead.extend({
    title: z.string(),
    description: z.string(),
    empty: z.string(),
    // Labels on each post page.
    post: z.object({
      back: z.string(),
      minutes: z.string(),
      newer: z.string(),
      older: z.string(),
      tags: z.string()
    })
  })
});

const profile = z.object({
  hero: z.object({
    code: z.string(),
    role: z.string(),
    name: z.string(),
    motto: z.array(z.string()),
    sub: z.string(),
    primary: link,
    secondary: link,
    card: z.array(labelled.extend({
      href: z.string().optional()
    }))
  }),
  stats: z.array(labelled),
  about: z.object({
    intro: z.string(),
    facts: z.array(labelled),
    highlights: z.array(z.object({
      value: z.string(),
      title: z.string(),
      detail: z.string()
    })),
    headshot: picture.extend({
      caption: z.tuple([z.string(), z.string()])
    })
  })
});

const photos = z.object({
  bands: z.array(picture.extend({
    id: z.string(),
    width: z.number().int()
      .positive(),
    height: z.number().int()
      .positive(),
    theme: z.enum(['forest']).optional(),
    caption: z.tuple([z.string(), z.string()])
  }))
});

const projects = z.object({
  flagship: z.array(z.object({
    number: z.string(),
    context: z.string(),
    title: z.string(),
    tech: z.object({
      name: z.string(),
      logo: z.enum(['drupal', 'dotnet', 'rubyonrails'])
    }),
    metric: z.string(),
    brief: z.string(),
    structure: z.string(),
    result: z.string(),
    stack: z.array(z.string())
  })),
  furtherWork: z.object({
    heading: z.string(),
    label: z.string(),
    items: z.array(z.object({
      name: z.string(),
      desc: z.string(),
      metric: z.string()
    }))
  })
});

const skills = z.object({
  groups: z.array(z.object({
    title: z.string(),
    items: z.array(z.object({
      name: z.string(),
      used: z.string()
    }))
  }))
});

const experience = z.object({
  items: z.array(timelineEntry.extend({
    desc: z.string()
  }))
});

const education = z.object({
  heading: z.string(),
  items: z.array(timelineEntry)
});

const community = z.object({
  statement: z.string(),
  cards: z.array(z.object({
    kicker: z.string(),
    title: z.string(),
    text: z.string()
  })),
  photo: picture,
  timeline: z.array(z.object({
    year: z.string(),
    text: z.string()
  }))
});

/**
 * Every collection's schema, by collection name. Nuxt Content only uses
 * schemas for types, so `modules/content-validation.ts` checks each file
 * against these and fails the build on a mismatch.
 */
export const schemas = {
  blog,
  site,
  links,
  sections,
  profile,
  photos,
  projects,
  skills,
  experience,
  education,
  community
};
