/**
 * Loads the site-wide copy (navigation labels and the contact footer) from
 * `content/data/site.yml`. Every caller shares one async-data key, so the
 * file is read once per page. `site` stays null if the file is missing,
 * which only happens when the content build is broken.
 */
export async function useSite() {
  const { data: site } = await useAsyncData('site', () => queryCollection('site').first());
  return { site };
}
