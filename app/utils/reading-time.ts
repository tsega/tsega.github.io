import type { MinimarkNode, MinimarkTree } from '@nuxt/content';

// Average adult reading speed for technical prose.
const WORDS_PER_MINUTE = 220;

// Code is skimmed, not read word by word, so it doesn't count.
const SKIPPED_TAGS = new Set(['pre', 'code', 'style', 'script']);

function countWords(node: MinimarkNode): number {
  if (typeof node === 'string') {
    return node.split(/\s+/).filter(Boolean).length;
  }
  const [tag, , ...children] = node;
  if (SKIPPED_TAGS.has(tag)) {
    return 0;
  }
  return children.reduce((sum, child) => sum + countWords(child), 0);
}

/**
 * Estimated minutes to read a post, from the words in its parsed body at
 * 220 words a minute. Code blocks and inline code are left out. Never less
 * than one minute, so even a short note reads "1 min read".
 *
 * @param body A post's `body` from the blog collection.
 */
export function readingMinutes(body: MinimarkTree): number {
  const words = body.value.reduce((sum, node) => sum + countWords(node), 0);
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
