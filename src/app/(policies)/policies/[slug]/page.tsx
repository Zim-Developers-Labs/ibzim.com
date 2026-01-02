import { prepareArticleMetadata } from '@/lib/article-metadata';
import { getAllPolicySlugs, getPolicyBySlug } from '@/lib/sanity/client';
import { PolicyType } from '@/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PolicyLayout from './component';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [policy]: [PolicyType | null] = await Promise.all([
    getPolicyBySlug((await params).slug),
  ]);

  return prepareArticleMetadata({
    title: policy?.seo.title,
    description: policy?.seo.description,
    pageUrl: `/policies/${(await params).slug}`,
    ogImage: {
      url: '/banner.webp',
      height: 675,
      width: 1200,
    },
  });
}

export async function generateStaticParams() {
  const policies = await getAllPolicySlugs();

  return policies.map((policy) => ({
    slug: policy.slug,
  }));
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params;
  const [policy]: [PolicyType | null] = await Promise.all([
    getPolicyBySlug(slug),
  ]);

  if (!policy?._id) {
    return notFound();
  }

  return <PolicyLayout policy={policy} />;
}
