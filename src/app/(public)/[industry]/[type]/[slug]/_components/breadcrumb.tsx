import Container from '@/components/container';
import Link from 'next/link';

export default function BreadCrumb({
  type,
  industry,
  name,
}: {
  type: string;
  industry: string;
  name: string;
}) {
  return (
    <div className="bg-primaryColor/10 w-full border-b border-b-gray-200">
      <Container className="line-clamp-1 max-w-screen-xl text-[.8rem] leading-8">
        <Link href="/articles" className="hover:text-primaryColor">
          Articles &nbsp;
        </Link>{' '}
        <span className="text-gray-400">/</span>
        &nbsp;&nbsp;
        <span className="capitalize">{industry}</span>{' '}
        <span className="text-gray-400">/</span>
        &nbsp;&nbsp;
        <span className="capitalize">{type}</span>{' '}
        <span className="text-gray-400">/</span>
        &nbsp;&nbsp;
        <span>{name}</span>
      </Container>
    </div>
  );
}

export function ProfileReviewsBreadCrumb({
  type,
  name,
}: {
  type: string;
  name: string;
}) {
  return (
    <div className="w-full border-b border-b-gray-200">
      <Container className="line-clamp-1 max-w-screen-xl text-[.8rem] leading-8">
        <Link href="/" className="hover:text-primaryColor">
          Home &nbsp;
        </Link>{' '}
        <span className="text-gray-400">/</span>
        &nbsp;&nbsp;
        <Link href="/profiles" className="hover:text-primaryColor">
          Profiles &nbsp;
        </Link>{' '}
        <span className="text-gray-400">/</span>
        &nbsp;&nbsp;
        <span className="capitalize">{type}</span>{' '}
        <span className="text-gray-400">/</span>
        &nbsp;&nbsp;
        <span>{name}</span>
        &nbsp;&nbsp;
        <span className="text-gray-400">/</span>
        &nbsp;&nbsp;
        <span>Reviews</span>
      </Container>
    </div>
  );
}
