/**
 * The newest blog posts, newest first. Drafts are included in dev so they
 * can be previewed, and left out of the generated site.
 *
 * @param limit How many posts to return at most; fewer when fewer exist.
 */
export async function useLatestPosts(limit: number) {
  const { data: posts } = await useAsyncData(`latest-posts-${limit}`, () => {
    const query = queryCollection('blog')
      .order('date', 'DESC')
      .limit(limit);
    return import.meta.dev
      ? query.all()
      : query.where('draft', '=', false).all();
  });
  return { posts };
}
