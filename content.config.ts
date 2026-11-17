import { defineCollection, defineContentConfig, z } from '@nuxt/content';

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

// A data collection backed by one YAML file in content/data/.
function dataFile<T extends z.ZodRawShape>(name: string, shape: T) {
  return defineCollection({
    type: 'data',
    source: `data/${name}.yml`,
    schema: z.object(shape)
  });
}

const site = dataFile('site', {
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

const links = dataFile('links', {
  links: z.array(z.object({
    title: z.string(),
    sub: z.string(),
    href: z.string()
  }))
});

const sections = dataFile('sections', {
  about: sectionHead,
  writing: sectionHead.extend({
    readMore: z.string(),
    subscribe: link.extend({
      text: z.string()
    })
  }),
  work: sectionHead,
  community: sectionHead,
  skills: sectionHead,
  experience: sectionHead
});

const profile = dataFile('profile', {
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

const photos = dataFile('photos', {
  bands: z.array(picture.extend({
    id: z.string(),
    caption: z.tuple([z.string(), z.string()])
  }))
});

const projects = dataFile('projects', {
  flagship: z.array(z.object({
    number: z.string(),
    context: z.string(),
    title: z.string(),
    tech: z.object({
      name: z.string(),
      logo: z.string()
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

const skills = dataFile('skills', {
  groups: z.array(z.object({
    title: z.string(),
    items: z.array(z.object({
      name: z.string(),
      used: z.string()
    }))
  }))
});

const experience = dataFile('experience', {
  items: z.array(timelineEntry.extend({
    desc: z.string()
  }))
});

const education = dataFile('education', {
  heading: z.string(),
  items: z.array(timelineEntry)
});

const community = dataFile('community', {
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
  }
});
