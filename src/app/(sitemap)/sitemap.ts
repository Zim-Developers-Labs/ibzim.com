import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';
import { CardArticleType } from '@/types';
import {
  getAllArticlesByBlog,
  getAllProfileSlugsAndTypeByBlog,
} from '@/sanity/lib/client';

export async function generateSitemaps() {
  // This will create three separate sitemaps
  return [{ id: 'misc' }, { id: 'articles' }, { id: 'profiles' }];
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  switch (id) {
    case 'misc':
      return await generateMiscSitemap();
    case 'articles':
      return await generateArticlesSitemap();
    case 'profiles':
      return await generateProfilesSitemap();
    default:
      return [];
  }
}

function generateMiscSitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.url.web}`,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${siteConfig.url.web}/articles`,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${siteConfig.url.web}/profiles`,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${siteConfig.url.web}/zimbabwe-peoples-choice-awards`,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${siteConfig.url.web}/chats`,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${siteConfig.url.web}/support`,
      lastModified: new Date(),
      priority: 1,
    },
  ];
}
// Temporary fix for schools listing articles
// These articles have been moved to the school picker tool
// This is a temporary fix until we can update the links in the articles
function getArticleHref(article: CardArticleType): string {
  if (article.slug.current === 'top-20-best-universities-in-zimbabwe') {
    return '/tools/school-picker/best-tertiary-institutions-in-zimbabwe';
  }

  if (article.slug.current === 'top-100-best-a-level-schools-in-zimbabwe') {
    return '/tools/school-picker/best-a-level-schools-in-zimbabwe';
  }

  if (article.slug.current === 'top-100-best-o-level-schools-in-zimbabwe') {
    return '/tools/school-picker/best-o-level-schools-in-zimbabwe';
  }

  if (article.slug.current === 'top-100-best-primary-schools-in-zimbabwe') {
    return '/tools/school-picker/best-primary-schools-in-zimbabwe';
  }

  // Return default href for all other articles
  return `/${article.industry.slug}/${article.type}/${article.slug.current}`;
}

async function generateArticlesSitemap(): Promise<MetadataRoute.Sitemap> {
  const articles: CardArticleType[] = await getAllArticlesByBlog(
    siteConfig.documentPrefix !== ''
      ? `${siteConfig.documentPrefix}.article`
      : 'article',
  );

  return articles
    .filter(({ slug = '' }) => slug)
    .map((article) => ({
      url: `${siteConfig.url.web}/${getArticleHref(article)}`,
      lastModified: new Date(article._updatedAt),
      priority: 0.9,
    }));
}

type ProfileType = {
  slug: string;
  type: string;
  _updatedAt?: string;
};

async function generateProfilesSitemap(): Promise<MetadataRoute.Sitemap> {
  const profiles: ProfileType[] = await getAllProfileSlugsAndTypeByBlog(
    siteConfig.documentPrefix !== ''
      ? `${siteConfig.documentPrefix}.profile`
      : 'profile',
  );

  return profiles
    .filter(({ slug = '' }) => slug)
    .map((profile) => ({
      url: `${siteConfig.url.web}/profiles/${profile.type}/${profile.slug}`,
      lastmod: new Date(profile._updatedAt!),
      priority: 0.9,
    }));
}
