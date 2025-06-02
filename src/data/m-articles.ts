// Data for article tracking and management

import { Url } from "url";

export type MArticleType = {
  articleId: string;
  status:
    | "pending"
    | "in-progress"
    | "in-review"
    | "published"
    | "deleted";
  desktopRank: {
    jan?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    feb?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    "mar"?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    apr?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    may?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    jun?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    jul?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    aug?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    sep?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    oct?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    nov?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    dec?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
  };
  mobileRank: {
    jan?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    feb?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    mar?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    apr?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    may?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    jun?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    jul?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    aug?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    sep?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    oct?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    nov?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
    dec?: {
      previousYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
      currentYear?: "N/A" | "Top 10" | "Top 6" | "Top 3";
    };
  };
  // get from google ads keyword planner
  keywordSearchVolumeRange: {
    low: number;
    high: number;
  };
  articleTraffic?: {
    jan?: {
      previousYear?: number;
      currentYear?: number;
    };
    feb?: {
      previousYear?: number;
      currentYear?: number;
    };
    mar?: {
      previousYear?: number;
      currentYear?: number;
    };
    apr?: {
      previousYear?: number;
      currentYear?: number;
    };
    may?: {
      previousYear?: number;
      currentYear?: number;
    };
    jun?: {
      previousYear?: number;
      currentYear?: number;
    };
    jul?: {
      previousYear?: number;
      currentYear?: number;
    };
    aug?: {
      previousYear?: number;
      currentYear?: number;
    };
    sep?: {
      previousYear?: number;
      currentYear?: number;
    };
    oct?: {
      previousYear?: number;
      currentYear?: number;
    };
    nov?: {
      previousYear?: number;
      currentYear?: number;
    };
    dec?: {
      previousYear?: number;
      currentYear?: number;
    };
  };
  keywordDifficulty: "very easy" | "easy" | "possible" | "hard";

  // for competitor research
  imageCount?: number;
  pageBackLinks: number;

  competitors?: {
    domain: string;
    pageBackLinks: number;
    slug: string;
    domainAuthority: number;
    rank: {
      lastChecked: Date;
      desktop: "Top 10" | "Top 6" | "Top 3" | "Top 1";
      mobile: "Top 10" | "Top 6" | "Top 3" | "Top 1";
    };
    imageCount: number;
    wordCount: number;
    features: string[];
  }[];

  // calculate keyword difficulty from serp data

  // To Collect from article through mapping sanity articles
  name?: string;
  lastUpdated?: Date;
  url?: Url;
  seriesArticleIds?: string[];
  author?: string;
  type?:
    | "listicle"
    | "event"
    | "review"
    | "informative"
    | "comparison"
    | "how-to";
  industry?: string;
  truthScore?: number;
};

export const MArticlesData = [
  {
    articleId: "9f3599a3-1906-4324-80b0-5d93e742a1ca",
    pageBackLinks: 0,
    keywordDifficulty: "easy",
    keywordSearchVolumeRange: {
      low: 100,
      high: 1000,
    },
    articleTraffic: {
      mar: {
        currentYear: 1200,
      },
    },
    desktopRank: {
      mar: {
        currentYear: "Top 3",
      }
    },
    mobileRank: {
      mar: {
        currentYear: "Top 3",
      }
    },
    status: "published",
  },
] satisfies MArticleType[];
