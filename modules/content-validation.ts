import { defineNuxtModule } from 'nuxt/kit';
import { parse } from 'yaml';
import { schemas } from '../content.schemas';

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

// Frontmatter exactly as written. Nuxt Content's parsed page fills a
// missing title from the file name and turns dates into strings, so it
// can't show what the author left out. YAML 1.1 keeps dates as Date.
function frontmatter(source: string): unknown {
  const match = FRONTMATTER.exec(source);
  return match ? parse(match[1] ?? '', { schema: 'yaml-1.1' }) : {};
}

/**
 * Checks every content file against its collection's schema in
 * `content.schemas.ts`. Nuxt Content only uses schemas for types, so without
 * this a typo in a post or a data file ships as missing text. Blog posts are
 * checked as written; data files as parsed. Nuxt Content swallows errors
 * thrown while parsing (it drops the file with a warning), so problems are
 * collected and the build fails afterwards, listing every file and field.
 * In `bun run dev` they are only logged, so the dev server keeps running.
 */
export default defineNuxtModule({
  meta: {
    name: 'content-validation'
  },
  setup(_options, nuxt) {
    const problems: string[] = [];

    nuxt.hook('build:before', () => {
      if (problems.length > 0 && !nuxt.options.dev) {
        throw new Error(`Content doesn't match its schema:\n\n${problems.join('\n\n')}`);
      }
    });

    nuxt.hook('content:file:afterParse', ({ file, content, collection }) => {
      const schema = schemas[collection.name as keyof typeof schemas];
      if (!schema) {
        return;
      }
      const input = collection.type === 'page' ? frontmatter(file.body) : content;
      const result = schema.safeParse(input);
      if (result.success) {
        return;
      }
      const fields = result.error.issues
        .map(issue => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
        .join('\n');
      const path = file.path.replace(`${nuxt.options.rootDir}/`, '');
      const message = `${path} (${collection.name}):\n${fields}`;
      problems.push(message);
      if (nuxt.options.dev) {
        console.error(`Content doesn't match its schema: ${message}`);
      }
    });
  }
});
