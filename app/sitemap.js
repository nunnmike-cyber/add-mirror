import { ARTICLES } from '@/lib/articles';

export default function sitemap() {
  const articleUrls = ARTICLES.map((article) => ({
    url: `https://adhdmirror.com/articles/${article.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://adhdmirror.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://adhdmirror.com/articles',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...articleUrls,
    {
      url: 'https://adhdmirror.com/privacy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://adhdmirror.com/terms',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
