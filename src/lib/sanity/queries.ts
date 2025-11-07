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
  categoryTitles[]->{ _id, title, slug }
}`;
