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
    ratio: string;
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
  entityType: string;
  birthDate?: string;
  isBirthDateApproximate?: boolean;
  additionalInfo?: {
    tableHeading: string;
    tableData: any;
  }[];
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
  isNew: boolean;
  shortName: string;
  twitterUsername: string;
  vercelProjectName: string;
  country: string;
  documentPrefix?: string;
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
