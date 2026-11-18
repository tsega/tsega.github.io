import { defineCollection, defineContentConfig } from '@nuxt/content';
import type { z } from 'zod';
import { schemas } from './content.schemas';

// A data collection backed by one YAML file in content/data/.
function dataFile<T extends z.ZodTypeAny>(name: string, schema: T) {
  return defineCollection({
    type: 'data',
    source: `data/${name}.yml`,
    schema
  });
}

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: schemas.blog
    }),
    site: dataFile('site', schemas.site),
    links: dataFile('links', schemas.links),
    sections: dataFile('sections', schemas.sections),
    profile: dataFile('profile', schemas.profile),
    photos: dataFile('photos', schemas.photos),
    projects: dataFile('projects', schemas.projects),
    skills: dataFile('skills', schemas.skills),
    experience: dataFile('experience', schemas.experience),
    education: dataFile('education', schemas.education),
    community: dataFile('community', schemas.community)
  }
});
