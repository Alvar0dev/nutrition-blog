import { getPublishedPosts } from '../lib/posts.js';

const PUBLIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/servicios', priority: '0.9', changefreq: 'monthly' },
  { path: '/servicios/habitos', priority: '0.8', changefreq: 'monthly' },
  { path: '/servicios/objetivos', priority: '0.8', changefreq: 'monthly' },
  { path: '/servicios/composicion', priority: '0.8', changefreq: 'monthly' },
  { path: '/servicios/salud', priority: '0.8', changefreq: 'monthly' },
  { path: '/servicios/asesoramiento', priority: '0.8', changefreq: 'monthly' },
  { path: '/servicios/educacion', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/contacto', priority: '0.7', changefreq: 'monthly' },
];

export async function GET({ site }) {
  const baseUrl = site ? site.origin : 'https://nutricionalcoach.com';
  const defaultLastmod = new Date().toISOString().split('T')[0];
  const posts = await getPublishedPosts();

  const postRoutes = posts.map((post) => {
    const date = post.data.updatedDate ?? post.data.pubDate;
    return {
      path: `/blog/${post.id}`,
      lastmod: date.toISOString().split('T')[0],
      priority: '0.8',
      changefreq: 'monthly',
    };
  });

  const allRoutes = [
    ...PUBLIC_ROUTES.map((route) => ({ ...route, lastmod: defaultLastmod })),
    ...postRoutes,
  ];

  const urls = allRoutes
    .map(
      ({ path, lastmod, priority, changefreq }) => `  <url>
    <loc>${new URL(path, baseUrl).href}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
