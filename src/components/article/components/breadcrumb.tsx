import Container from '@/components/container';

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
    <div className="w-full border-b border-b-gray-200">
      <Container className="line-clamp-1 max-w-screen-xl text-[.8rem] leading-8">
        <a href="/" className="hover:text-primaryColor">
          Home &nbsp;
        </a>{' '}
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

export function WikiBreadCrumb({ type, name }: { type: string; name: string }) {
  return (
    <div className="w-full border-b border-b-gray-200">
      <Container className="line-clamp-1 max-w-screen-xl text-[.8rem] leading-8">
        <a href="/" className="hover:text-primaryColor">
          Home &nbsp;
        </a>{' '}
        <span className="text-gray-400">/</span>
        &nbsp;&nbsp;
        <a href="/profiles" className="hover:text-primaryColor">
          Profiles &nbsp;
        </a>{' '}
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
