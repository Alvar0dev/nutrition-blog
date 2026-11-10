import { getCollection } from 'astro:content';

const WORDS_PER_MINUTE = 200;

/**
 * Published blog posts sorted from newest to oldest.
 * Single source of truth for the catalog, the dynamic routes and the sitemap,
 * so a draft can never leak into one of them while being hidden in another.
 */
export async function getPublishedPosts() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Formats a date in Spanish, e.g. "14 de marzo de 2026". */
export function formatDate(date) {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** Estimated reading time in minutes from the raw Markdown body. */
export function getReadingTime(body = '') {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
