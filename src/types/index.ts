import { Image, Slug } from 'sanity';

export type CardArticleType = {
  _id: string;
  title: string;
  name: string;
  _type: string;
  slug: {
    current: string;
  };
  _updatedAt: string;
  _createdAt: string;
  industry: {
    slug: string;
  };
  type: string;
  seo: {
    title: string;
    description: string;
    image: Image;
  };
  author: AuthorType;
  truthScore: number;
};

export type CardNewsArticleType = {
  _id: string;
  title: string;
  name: string;
  _type: string;
  slug: {
    current: string;
  };
  _updatedAt: string;
  _createdAt: string;
  industry: {
    slug: string;
  };
  type: string;
  seo: {
    title: string;
    description: string;
    image: Image;
  };
  author: AuthorType;
  truthScore: number;
};

export type AuthorType = {
  _id: string;
  name: string;
  slug: Slug;
  picture: {
    alt: string;
    asset: {
      _ref: string;
    };
  };
  location: string;
  bio: string;
  dateJoined: string;
  postTitle: string;
  links: {
    website?: string;
    linkedin?: string;
  };
};

export type PolicyType = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  name: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  title: string;
  seo: {
    title: string;
    description: string;
  };
  subHeadings: {
    title: string;
    type: string;
    _key: string;
  }[];

  body: any;
  relatedPolicies: {
    _key: string;
    _ref: string;
  }[];
};

export type PressArticleType = {
  _id: string;
  name: string;
  slug: Slug;
  _updatedAt: string;
  subHeadings?: {
    title: string;
    type: string;
    _key: string;
  }[];
  seo: {
    title: string;
    description: string;
    image: Image;
  };
  title: string;
  intro: string;
  body: any;
};

export type CardPressArticleType = {
  _id: string;
  name: string;
  slug: Slug;
  _updatedAt: string;
  seo: {
    title: string;
    description: string;
    image: Image;
  };
};

export type CardPolicyType = {
  slug: Slug;
  _updatedAt: string;
};

export type SearchDocumentType = {
  _id: string;
  _type: string;
  name: string;
  slug: Slug;
  seo: {
    title: string;
    description: string;
    image?: Image;
  };
  title: string;
  type?: string;
  entityType?: string;
  industry?: {
    slug: string;
  };
};

export type CardProfileType = {
  name: string;
  slug: Slug;
  picture: {
    asset: {
      _ref: string;
    };
  };
  intro: string;
  subTitle: string;
  entityType: string;
};

export type ArticleType = {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  tblContentsType: string;
  name: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  title: string;
  hasProductListing: boolean;
  products?: {
    name: string;
    bestFor: string;
    image: Image;
    link: {
      url: string;
      text: string;
      dofollow: boolean;
    };
  }[];
  truthScore: number;
  industry: {
    slug: string;
  };
  type: string;
  seo: {
    title: string;
    description: string;
    image: Image;
  };
  author: {
    name: string;
    picture: {
      alt: string;
      asset: {
        _ref: string;
      };
    };
    bio: string;
    links: {
      website?: string;
      linkedin?: string;
    };
    postTitle: string;
  };
  intro: string;
  subHeadings?: {
    title: string;
    type: string;
    _key: string;
  }[];
  body: any;
  socialMediaPostUrls: {
    instagramUrl?: string;
    facebookUrl?: string;
    twitterUrl?: string;
    youtubeUrl?: string;
    linkedinUrl?: string;
  };
  relatedArticles?: {
    name: string;
    slug: {
      _type: 'slug';
      current: string;
    };
    seo: {
      title: string;
      description: string;
      image: Image;
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
  }[];
};

export type NewsArticleType = {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  tblContentsType: string;
  name: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  title: string;
  hasProductListing: boolean;
  products?: {
    name: string;
    bestFor: string;
    image: Image;
    link: {
      url: string;
      text: string;
      dofollow: boolean;
    };
  }[];
  truthScore: number;
  industry: {
    slug: string;
  };
  type: string;
  seo: {
    title: string;
    description: string;
    image: Image;
  };
  author: {
    name: string;
    picture: {
      alt: string;
      asset: {
        _ref: string;
      };
    };
    bio: string;
    links: {
      website?: string;
      linkedin?: string;
    };
    postTitle: string;
  };
  intro: string;
  subHeadings?: {
    title: string;
    type: string;
    _key: string;
  }[];
  body: any;
  relatedArticles?: {
    name: string;
    slug: {
      _type: 'slug';
      current: string;
    };
    seo: {
      title: string;
      description: string;
      image: Image;
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
  }[];
};

export type RelatedNewsItem = {
  name: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  industry: {
    slug: string;
  };
  mainImage: Image;
};

export type ProfileType = {
  _id: string;
  name: string;
  legalName: string;
  truthScore: number;
  subTitle: string;
  tblContentsType?: string;
  slug: Slug;
  title: string;
  seo: {
    title: string;
    description: string;
  };
  socialLinks?: {
    name: string;
    link: string;
  }[];
  intro: string;
  body: any;
  picture: {
    ratio: '1:1' | '16:9';
    asset: {
      _ref: string;
    };
    alt: string;
    source: {
      url: string;
      name: string;
    };
  };
  subHeadings?: {
    title: string;
    type: string;
    _key: string;
  }[];
  yearFounded: number;
  entityType: 'company' | 'person' | 'school' | 'place' | 'day' | 'other';
  birthDate?: string;
  isBirthDateApproximate?: boolean;
  birthYear?: number;
  useBirthYearOnly?: boolean;
  additionalInfo?: {
    tableHeading: string;
    tableData: any;
  }[];
  relatedNews?: RelatedNewsItem[];
  relatedProfiles: {
    entityType: string;
    slug: Slug;
    picture: {
      asset: {
        _ref: string;
      };
    };
    name: string;
    description: string;
  }[];
  // schools
  level?:
    | 'pre-school'
    | 'primary-school'
    | 'high-school'
    | 'tertiary-institution';
  oLevelSchoolType?:
    | 'Boys Boarding'
    | 'Girls Boarding'
    | 'Mixed Boarding'
    | 'Day School';
  aLevelSchoolType?:
    | 'Boys Boarding'
    | 'Girls Boarding'
    | 'Mixed Boarding'
    | 'Day School';
  primarySchoolType?:
    | 'Boys Boarding'
    | 'Girls Boarding'
    | 'Mixed Boarding'
    | 'Day School';
  tertiaryInstitutionType?:
    | 'University'
    | 'Polytechnic College'
    | 'Teaching College'
    | 'Technical College'
    | 'Nursing School'
    | 'Vocational Training Centre'
    | 'Business School';
  province?:
    | 'Harare'
    | 'Bulawayo'
    | 'Manicaland'
    | 'Mashonaland Central'
    | 'Mashonaland East'
    | 'Mashonaland West'
    | 'Masvingo'
    | 'Midlands'
    | 'Matabeleland South'
    | 'Matabeleland North';
  churchAffiliation?:
    | 'Anglican'
    | 'Catholic'
    | 'Dutch'
    | 'Methodist'
    | 'Pentecostal'
    | 'Presbyterian'
    | 'Salvation Army'
    | 'Seventh-day'
    | 'Other';
  primarySchoolPassRates?: {
    year: number;
    passRate: number;
  }[];
  oLevelSchoolPassRates?: {
    year: number;
    passRate: number;
  }[];
  aLevelSchoolPassRates?: {
    year: number;
    passRate: number;
  }[];
};

export type HomeType = {
  seo: {
    title: string;
    description: string;
    image: {
      asset: {
        _ref: string;
      };
    };
  };
  mainArticle?: {
    _key: string;
    _ref: string;
  };
  heroArticles?: {
    _key: string;
    _ref: string;
  }[];
  heroLists?: {
    _key: string;
    _ref: string;
  }[];
};

export type SiteConfigType = {
  name: string;
  shortName: string;
  twitterUsername: string;
  url: {
    logo: string;
    web: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
    facebook?: string;
    banner: string;
  };
  popularArticleIds?: string[];
};

export type ArticlesForCountType = {
  author: {
    name: string;
  };
};

export type SchoolPickerProfilesType = {
  _id: string;
  name: string;
  slug: Slug;
  level: string;
  location: string;
  province: string;
  yearFounded?: number;
  ibzimRating: number;
  feesHistory: {
    feesStatus: 'Needs Confirmation' | 'Verified' | 'Custom';
    notes?: string;
    amount: number;
  }[];
  oLevelSchoolType?: string;
  aLevelSchoolType?: string;
  primarySchoolType?: string;
  primarySchoolPassRates?: {
    year: number;
    passRate: number;
  }[];
  oLevelSchoolPassRates?: {
    year: number;
    passRate: number;
  }[];
  aLevelSchoolPassRates?: {
    year: number;
    passRate: number;
  }[];
  churchAffiliation?: string;

  contacts?: {
    name: string;
    phone: string;
    role: string;
  }[];
  averageRating?: number;
  reviewsCount?: number;
};

export type NotificationType = {
  _id: string;
  _createdAt: string;
  description: string;
  icon:
    | 'info'
    | 'warning'
    | 'error'
    | 'success'
    | 'user'
    | 'users'
    | 'award'
    | 'ib'
    | 'article';
  payloadForIcon?: any[];
  type:
    | 'withButtonLink'
    | 'withSocialButtons'
    | 'globalGeneral'
    | 'userGeneral';
  payloadForType?: {
    buttonLinkText?: string;
    buttonLinkUrl?: string;
    facebookLink?: string;
    twitterLink?: string;
    instagramLink?: string;
    youTubeLink?: string;
  }[];
  isRead?: boolean;
  from?: 'neon' | 'sanity';
};

export type SanityAwardCategoryType = {
  _id: string;
  slug: Slug;
  title: string;
  description: string;
  votingState: string;
  categoryTitles: {
    _id: string;
    title: string;
    slug: Slug;
    description?: string;
    withCustomImage?: boolean;
    withExternalLink?: boolean;
  }[];
};

export type AwardMetadataType = {
  id: string;
  icon: any;
  color: string;
  iconColor: string;
};

export type AwardCategoryType = SanityAwardCategoryType &
  AwardMetadataType & {
    titles?: AwardTitleType[];
  };

export type AwardTitleType = {
  _id: string;
  title: string;
};

export type CategoryTitleType = {
  _id: string;
  title: string;
  slug: Slug;
};

export type NomineeType = {
  nomineeProfile?: ProfileType;
  customImage?: Image;
  externalLink?: {
    url: string;
    title: string;
  };
};
