import { defineQuery, groq } from 'next-sanity';

export const queryHomePageData =
  defineQuery(/* groq */ `*[_type == $documentType && _id == $documentId][0]{
    _id,
    _type,
   seo,
  mainArticle,
  heroArticles,
  heroLists,
  }`);

export const articlesByBlogQuery: string = groq`*[_type == $articleDocumentType] | order(date desc, _createdAt desc) {
  _id,
  name,
  title,
  slug,
  _updatedAt,
  _type,
  _createdAt,
  "industry": industry->{"slug": slug.current},
  type,
  seo,
  "author": author->{name, picture, bio, links, slug},
}`;

export const allFullArticlesQuery: string = groq`*[_type match "*article"] | order(date desc, _createdAt desc){
  ...,
  "industry": industry->{"slug": slug.current},
  "author": author->{name, picture, bio, links, slug},
}`;

export const allArticlesTruthScoresQuery: string = groq`*[_type match "*article"]{
  truthScore,
}`;

export const allProfilesTruthScoresQuery: string = groq`*[_type match "*profile"]{
  truthScore,
}`;

export const allArticlesQuery: string = groq`*[_type match "*article"] | order(date desc, _createdAt desc) {
  _id,
  name,
  title,
  slug,
  _updatedAt,
  _type,
  _createdAt,
  "industry": industry->{"slug": slug.current},
  type,
  seo,
  truthScore,
  "author": author->{name, picture, bio, links, slug},
}`;

export const queryAllArticlesByBlog = defineQuery(/* groq */ `
  *[_type == $documentId]{
    _id,
    name,
    title,
    slug,
    _updatedAt,
    _type,
    _createdAt,
    "industry": industry->{"slug": slug.current},
    type,
    seo,
    "author": author->{name, picture, bio, links, slug},
  }
  `);

export const articlesForCountQuery: string = groq`*[_type match "*article"] {
  _id,
  "author": author->{name},
}`;

export const articlesByIdsQuery: string = groq`*[_id in $articleIds] | order(date desc, _createdAt desc) {
  _id,
  name,
  title,
  slug,
  _updatedAt,
  _createdAt,
  "industry": industry->{"slug": slug.current},
  type,
  seo,
  "author": author->{name, picture, bio, links},
}`;

export const policyBySlugQuery: string = groq`*[_type == "policy" && slug.current == $slug][0]`;

export const pressArticleBySlugQuery: string = groq`*[_type == "press.article" && slug.current == $slug][0]`;

export const policySlugsQuery: string = groq`*[_type == "policy"] {
   "slug": slug.current,
}`;

export const allPoliciesQuery: string = groq`*[_type == "policy"] {
   slug,
   _updatedAt,
}`;

export const pressArticleSlugsQuery: string = groq`*[_type == "press.article"] {
   "slug": slug.current,
}`;

export const pressArticlesQuery: string = groq`*[_type == "press.article"] {
  _id,
  name,
  slug,
  _updatedAt,
  seo,
}`;

export const articlesForSearchByBlogQuery = groq`*[_type in [$articleDocumentType, $profileDocumentType]]{
    _id,
    name,
    slug,
    seo,
    title,
    type, 
    _type,
    entityType,
    "industry": industry->{"slug": slug.current},
  }`;

const articleFields = groq`
  _id,
  _updatedAt,
  _createdAt,
  name,
  slug,
  tblContentsType,
  title,
  hasProductListing,
  truthScore,
  products,
  "industry": industry->{"slug": slug.current},
  type,
  seo,
  intro,
  subHeadings,
  body[] {
    ...,
    markDefs[] {
      ...,
      _type == "annotationInternalLink" => {
        "internalPage": internalPage -> { 
          seo,
          picture,
          entityType,
          _type,
          slug,
          "industry": industry->{"slug": slug.current},
          type,
          name,
         },
      },
    }
  },
  "relatedArticles": *[_type == $articleDocumentType && references(^._id)] {
    name, 
    seo, 
    slug,
    "author": author->{name, picture},
     type,
    "industry": industry->{"slug": slug.current},
  },
  "author": author->{name, picture, bio, links, postTitle},
`;

const profileFields = groq`
  _id,
  _updatedAt,
  _createdAt,
  name,
  slug,
  tblContentsType,
  truthScore,
  title,
  subTitle,
  seo,
  entityType,
  body[] {
    ...,
    markDefs[] {
      ...,
      _type == "annotationInternalLink" => {
        "internalPage": internalPage -> { 
          seo,
          picture,
          _type,
          slug,
          "industry": industry->{"slug": slug.current},
          type,
          name,
         },
      },
    }
  },
  intro,
  picture,
  subHeadings,
  legalName,
  birthDate,
  birthYear,
  useBirthYearOnly,
  isBirthDateApproximate,
  yearFounded,
  additionalInfo[] {
    ...,
    tableData[] {
      ...,
      markDefs[] {
        ...,
        _type == "annotationInternalLink" => {
          "internalPage": internalPage -> { 
            seo,
            picture,
            _type,
            slug,
            "industry": industry->{"slug": slug.current},
            type,
            name,
           },
        },
      }
    }
  },
  socialLinks,
  relatedProfiles,
  "relatedProfiles": *[_type == $profileDocumentType && references(^._id)] {
    name, 
    slug,
    "description": seo.description,
    picture,
    entityType,
  },
  level,
  oLevelSchoolType,
  aLevelSchoolType,
  primarySchoolType,
  location,
  province,
  feesHistory,
  churchAffiliation,
  primarySchoolPassRates,
  oLevelSchoolPassRates,
  aLevelSchoolPassRates,
  contacts[] {
    name,
    phone,
    role
  }
`;

export const homeByBlogQuery: string = groq`*[_type == $homeDocumentType]{
  seo,
  mainArticle,
  heroArticles,
  heroLists,
}`;

export const articleBySlugAndBlogQuery: string = groq`*[_type == $articleDocumentType && slug.current == $slug]{
  ${articleFields}
}`;

export const profileBySlugAndBlogQuery: string = groq`*[_type == $profileDocumentType && slug.current == $slug][0]{
  ${profileFields}
}`;

export const allProfilesForListingByBlog: string = groq`*[_type == $profileDocumentType]{
  name,
  picture,
  slug,
  intro,
  subTitle,
  entityType,
}`;

export const allAuthorsQuery: string = groq`*[_type == "author"]`;

export const authorByNameQuery: string = groq`*[_type == "author" && name == $authorName][0]`;

export const authorBySlugQuery: string = groq`*[_type == "author" && slug.current == $slug][0]`;

export const articleSlugsQueryByBlog: string = groq`*[_type == $articleDocumentType && industry._ref == $industryRef && type == $type ] {
  slug
}`;

export const authorSlugsQuery: string = groq`*[_type == "author"] {
   "slug": slug.current,
}`;

export const profileSlugsAndTypeByBlogQuery: string = groq`*[_type == $profileDocumentType] {
   _id,
   "slug": slug.current,
   "type": entityType,
   _updatedAt,
}`;

export const articleSlugAndTypeAndIndustryByBlogQuery: string = groq`*[_type == $articleDocumentType] {
   "slug": slug.current,
   "type": type,
   "industry": industry->{"slug": slug.current},
}`;

export const allArticlesByBlogQuery: string = groq`*[_type == $articleDocumentType && !(_id in path('drafts.**'))] | order(date desc, _createdAt desc) {
  _id,
  name,
  title,
  slug,
  _updatedAt,
  _createdAt,
  "industry": industry->{"slug": slug.current},
  type,
  seo,
  "author": author->{name, picture, bio, links},
}`;

export const allArticlesByAuthorSlugQuery: string = groq`
*[_type == "author" && slug.current == $slug][0] {
  "articles": *[_type in ["article", "*.article"] && author._ref == ^._id] | order(date desc, _createdAt desc) {
    seo,
    industry,
    type,
    slug,
    title,
    name,
    _updatedAt,
    _createdAt,
  }
}
`;

export const allSchoolsByLevelQuery: string = groq`*[_type == "profile" && entityType == "school" && level == $level && defined(province)] {
  _id,
  name,
  slug,
  level,
  oLevelSchoolType,
  aLevelSchoolType,
  primarySchoolType,
  location,
  province,
  feesHistory,
  churchAffiliation,
  primarySchoolPassRates,
  oLevelSchoolPassRates,
  aLevelSchoolPassRates,
  contacts[] {
    name,
    phone,
    role
  }
}
`;
