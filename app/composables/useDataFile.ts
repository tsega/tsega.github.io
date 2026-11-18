import type { Collections } from '@nuxt/content';

/**
 * Loads one homepage data file from `content/data/<name>.yml`, typed by its
 * schema in `content.schemas.ts`. Sections that read the same file share one
 * async-data key, so it is fetched once per page. `data` is null only if
 * the file is missing; the build's schema check catches a malformed one.
 */
export async function useDataFile<T extends keyof Collections>(name: T) {
  const { data } = await useAsyncData(`data-${name}`, () => queryCollection(name).first());
  return { data };
}
