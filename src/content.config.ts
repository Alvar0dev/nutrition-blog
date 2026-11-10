import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Blog collection (Astro 7 Content Layer API).
 *
 * Each Markdown file in `src/content/blog/` becomes one entry whose `id` is the
 * file name without extension, used as the public slug: `/blog/<id>`.
 * Frontmatter is validated at build time, so a malformed post fails the build
 * instead of shipping a broken page.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(80),
    description: z.string().max(180),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    /** Remote image URL (domain must be allowed in `astro.config.mjs` → `image.domains`). */
    image: z.url(),
    imageAlt: z.string(),
    author: z.string().default('Álvaro Aguilar'),
    tags: z.array(z.string()).default([]),
    /** Drafts are excluded from the catalog, the dynamic routes and the sitemap. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
