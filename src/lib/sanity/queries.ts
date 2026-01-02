import { defineQuery, groq } from 'next-sanity';

export const documentsForSearchQuery = groq`*[_type in ['profile', 'article']]{
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

export const notificationsQuery = groq`*[_type == 'notification' && isActive == true]{
  _id,
  _createdAt,
  description,
  icon,
  payloadForIcon,
  type,
  payloadForType,
}`;

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
  yearFounded,
  ibzimRating,
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

export const awardCategoriesQuery = groq`*[_type == "awardCategory"]{
  ...,
  categoryTitles[]->{ _id, title, slug }
}`;

export const awardCategoryBySlugQuery = groq`*[_type == "awardCategory" && slug.current == $slug][0]{
  ...,
  categoryTitles[]->{ _id, title, slug, description, withCustomImage, withExternalLink }

}`;

export const categoryTitlesBySlugsQuery = groq`*[_type == "awardCategory" && slug.current == $categorySlug][0]{
  categoryTitles[]->{
    _id,
    title,
    slug
  }
}`;

export const titleNomineesByTitleSlugQuery = groq`*[_type == "categoryTitle" && slug.current == $titleSlug][0]{
  nominees[] {
    ...,
    nomineeProfile-> {
      _id,
      name,
      slug,
      legalName,
      picture,
      entityType,
      industry-> { slug },
    }
  }
}`;

export const homeQuery = groq`*[_type == "home"][0]{
  seo,
  mainArticle,
  heroArticles,
  heroLists,
}`;

export const allArticlesQuery = groq`*[_type == "article"] | order(date desc, _createdAt desc){
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

export const allProfilesForListingQuery = groq`*[_type == "profile"]{
  name,
  picture,
  slug,
  intro,
  subTitle,
  entityType,
}`;

export const allAuthorsQuery: string = groq`*[_type == "author"]`;

export const articleBySlyugQuery = groq`*[_type == "article" && slug.current == $slug][0]{
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
  "relatedArticles": *[_type == "article" && references(^._id)] {
    name, 
    seo, 
    slug,
    "author": author->{name, picture},
     type,
    "industry": industry->{"slug": slug.current},
  },
  "author": author->{name, picture, bio, links, postTitle},
}`;

export const articleSlugAndTypeAndIndustryQuery: string = groq`*[_type == "article"] {
   "slug": slug.current,
   "type": type,
   "industry": industry->{"slug": slug.current},
}`;

export const profileBySlugQuery: string = groq`*[_type == "profile" && slug.current == $slug][0]{
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
  "relatedProfiles": *[_type == "profile" && references(^._id)] {
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

}`;

export const profileSlugsAndTypeQuery: string = groq`*[_type == "profile"] {
   _id,
   "slug": slug.current,
   "type": entityType,
   _updatedAt,
}`;

export const allNewsArticlesQuery: string = groq`*[_type == "zw.news" && defined(slug.current)] | order(date desc, _createdAt desc) {
  _id,
  name,
  title,
  slug,
  _updatedAt,
  _type,
  _createdAt,
  industry,
  seo,
  "author": author->{name, picture, bio, links, slug},
}`;

export const newsArticleBySlugQuery: string = groq`*[_type == "zw.news" && slug.current == $slug][0]{
  _id,
  _updatedAt,
  _createdAt,
  name,
  slug,
  title,
  industry,
  type,
  seo,
  intro,
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
          industry,
          type,
          name,
         },
      },
    }
  },
  "relatedArticles": *[_type == "zw.news" && references(^._id)] {
    name, 
    seo, 
    slug,
    "author": author->{name, picture},
     type,
    industry,
  },
  "author": author->{name, picture, bio, links, postTitle},
}`;

export const newsArticleSlugsAndIndustriesQuery: string = groq`*[_type == "zw.news"] {
  "slug": slug.current,
  industry
}`;

export const policySlugsQuery: string = groq`*[_type == "policy"] {
   "slug": slug.current,
}`;

export const policyBySlugQuery: string = groq`*[_type == "policy" && slug.current == $slug][0]`;
