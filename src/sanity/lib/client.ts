import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from './api';
import {
  ArticlesForCountType,
  ArticleType,
  AuthorType,
  CardArticleType,
  CardPolicyType,
  CardPressArticleType,
  CardProfileType,
  HomeType,
  PolicyType,
  PressArticleType,
  ProfileType,
  SchoolPickerProfilesType,
  SearchDocumentType,
} from '@/types';
import {
  allArticlesByBlogQuery,
  allArticlesQuery,
  allArticlesTruthScoresQuery,
  allAuthorsQuery,
  allFullArticlesQuery,
  allPoliciesQuery,
  allProfilesForListingByBlog,
  allProfilesTruthScoresQuery,
  allSchoolsByLevelQuery,
  articleBySlugAndBlogQuery,
  articlesByIdsQuery,
  articlesForCountQuery,
  articlesForSearchByBlogQuery,
  articleSlugAndTypeAndIndustryByBlogQuery,
  articleSlugsQueryByBlog,
  authorBySlugQuery,
  authorSlugsQuery,
  homeByBlogQuery,
  policyBySlugQuery,
  policySlugsQuery,
  pressArticleBySlugQuery,
  pressArticleSlugsQuery,
  pressArticlesQuery,
  profileBySlugAndBlogQuery,
  profileSlugsAndTypeByBlogQuery,
} from './queries';

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  perspective: 'published',
  useCdn: process.env.NODE_ENV === 'production',
});

export async function getArticlesByIds(
  articleIds: string[],
): Promise<CardArticleType[]> {
  if (client) {
    return (await client.fetch(articlesByIdsQuery, { articleIds })) || {};
  }
  return [];
}

export async function getPolicyBySlug(
  slug: string,
): Promise<PolicyType | null> {
  if (client) {
    const policy = await client.fetch(policyBySlugQuery, { slug });
    return policy || null;
  }
  return null;
}

export async function getPressArticleBySlug(
  slug: string,
): Promise<PressArticleType | null> {
  if (client) {
    const article = await client.fetch(pressArticleBySlugQuery, {
      slug,
    });
    return article || null;
  }
  return null;
}

export async function getAllPolicySlugs(): Promise<{ slug: string }[]> {
  if (client) {
    return (await client.fetch(policySlugsQuery)) || {};
  }
  return [];
}

export async function getAllPressArticleSlugs(): Promise<{ slug: string }[]> {
  if (client) {
    return (await client.fetch(pressArticleSlugsQuery)) || {};
  }
  return [];
}

export async function getAllPressArticles(): Promise<CardPressArticleType[]> {
  if (client) {
    return (await client.fetch(pressArticlesQuery)) || {};
  }
  return [];
}

export async function getAllPolicies(): Promise<CardPolicyType[]> {
  if (client) {
    return (await client.fetch(allPoliciesQuery)) || {};
  }
  return [];
}

export async function getAllArticlesForSearchByBlog(
  articleDocumentType: string,
  profileDocumentType: string,
): Promise<SearchDocumentType[]> {
  if (client) {
    return (
      (await client.fetch(articlesForSearchByBlogQuery, {
        articleDocumentType,
        profileDocumentType,
      })) || {}
    );
  }
  return [];
}

export async function getAllArticlesByBlog(
  articleDocumentType: string,
): Promise<CardArticleType[]> {
  if (client) {
    return (
      (await client.fetch(allArticlesByBlogQuery, { articleDocumentType })) ||
      {}
    );
  }
  return [];
}

export async function getAllArticles(): Promise<CardArticleType[]> {
  if (client) {
    return (await client.fetch(allArticlesQuery)) || {};
  }
  return [];
}

export async function getAllFullArticles(): Promise<ArticleType[]> {
  if (client) {
    return (await client.fetch(allFullArticlesQuery)) || {};
  }
  return [];
}

export async function getAllArticlesTruthScores(): Promise<
  { truthScore?: number }[]
> {
  if (client) {
    return (await client.fetch(allArticlesTruthScoresQuery)) || {};
  }
  return [];
}

export async function getAllProfilesTruthScores(): Promise<
  { truthScore?: number }[]
> {
  if (client) {
    return (await client.fetch(allProfilesTruthScoresQuery)) || {};
  }
  return [];
}

export async function getAllProfilesForListingByBlog(
  profileDocumentType: string,
): Promise<CardProfileType[]> {
  if (client) {
    return (
      (await client.fetch(allProfilesForListingByBlog, {
        profileDocumentType,
      })) || {}
    );
  }
  return [];
}

export async function getHome(homeDocumentType: string): Promise<HomeType[]> {
  if (client) {
    return (await client.fetch(homeByBlogQuery, { homeDocumentType })) || {};
  }
  return [];
}

export async function getAllAuthors(): Promise<AuthorType[]> {
  if (client) {
    return (await client.fetch(allAuthorsQuery)) || {};
  }
  return [];
}

export async function getAllAuthorSlugs(): Promise<{ slug: string }[]> {
  if (client) {
    return (await client.fetch(authorSlugsQuery)) || {};
  }
  return [];
}

export async function getAllProfileSlugsAndTypeByBlog(
  profileDocumentType: string,
): Promise<{ slug: string; type: string; _updatedAt?: string }[]> {
  if (client) {
    return (
      (await client.fetch(profileSlugsAndTypeByBlogQuery, {
        profileDocumentType,
      })) || {}
    );
  }
  return [];
}

export async function getAllArticleSlugsAndTypesAndIndustriesByBlog(
  articleDocumentType: string,
): Promise<
  {
    slug: string;
    type: string;
    industry: { slug: string };
  }[]
> {
  if (client) {
    return (
      (await client.fetch(articleSlugAndTypeAndIndustryByBlogQuery, {
        articleDocumentType,
      })) || {}
    );
  }
  return [];
}

export async function getArticlesForCount(): Promise<ArticlesForCountType[]> {
  if (client) {
    return (await client.fetch(articlesForCountQuery)) || {};
  }
  return [];
}

export async function getArticleBySlugAndBlog(
  slug: string,
  articleDocumentType: string,
): Promise<ArticleType[]> {
  if (client) {
    return (
      (await client.fetch(articleBySlugAndBlogQuery, {
        slug,
        articleDocumentType,
      })) || {}
    );
  }
  return [];
}

export async function getProfileBySlugAndBlog(
  slug: string,
  profileDocumentType: string,
): Promise<ProfileType | null> {
  if (client) {
    return (
      (await client.fetch(profileBySlugAndBlogQuery, {
        slug,
        profileDocumentType,
      })) || null
    );
  }
  return null;
}

export async function getAuthorBySlug(
  slug: string,
): Promise<AuthorType | null> {
  if (client) {
    const author = await client.fetch(authorBySlugQuery, { slug });
    return author || null;
  }
  return null;
}

export async function getArticleSlugsByIndustryAndTypeAndBlog(
  industryRef: string,
  type: string,
  articleDocumentType: string,
): Promise<ArticleType[]> {
  if (client) {
    return (
      (await client.fetch(articleSlugsQueryByBlog, {
        industryRef,
        type,
        articleDocumentType,
      })) || {}
    );
  }
  return [];
}

export async function getAllSchoolsByLevel(
  level: string,
): Promise<SchoolPickerProfilesType[]> {
  if (client) {
    return (await client.fetch(allSchoolsByLevelQuery, { level })) || [];
  }
  return [];
}
