import Container from '@/components/container';
import { urlForImage } from '@/sanity/lib/image';

type RelatedArticleType = {
  name: string;
  seo: {
    title: string;
    description: string;
    image: any;
  };
  slug: {
    _type: 'slug';
    current: string;
  };
  industry: {
    slug: string;
  };
  type: string;
  author: {
    name: string;
    picture: {
      alt: string;
      asset: {
        _ref: string;
      };
    };
  };
};

const ArticleCard = ({ article }: { article: RelatedArticleType }) => {
  return (
    <a
      href={`/${article.industry.slug}/${article.type}/${article.slug.current}`}
      className="mb-4 flex flex-row gap-4 sm:flex-col"
    >
      <div className="mb-4 ml-4 h-20 w-32 min-w-32 overflow-hidden rounded-md md:ml-0 md:h-[112px] md:w-[200px] md:max-w-none">
        <img
          src={urlForImage(article.seo.image).height(112).width(200).url()}
          alt={article.seo.title}
          className="h-full w-full object-cover object-center transition-all group-hover:scale-125 group-hover:rotate-6"
          height={112}
          width={200}
        />
      </div>
      <div className="md:line-clamp-2">{article.name}</div>
    </a>
  );
};

export default function RelatedArticles({
  articles,
}: {
  articles: RelatedArticleType[];
}) {
  return (
    <div className="bg-teal-200">
      <Container className="max-w-screen-md py-10 md:py-20">
        <h2 className="mb-8 text-3xl md:text-4xl">Related Articles</h2>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3">
          {articles.map((article, i) => (
            <ArticleCard key={i} article={article} />
          ))}
        </div>
      </Container>
    </div>
  );
}
