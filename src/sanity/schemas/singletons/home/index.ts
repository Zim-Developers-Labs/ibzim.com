export const HomeFields = [
  {
    name: "seo",
    type: "object",
    title: "SEO",
    fields: [
      {
        name: "title",
        title: "Title",
        type: "string",
        validation: (Rule: {
          max: (arg0: number) => {
            (): any;
            new (): any;
            warning: { (arg0: string): any; new (): any };
          };
        }) =>
          Rule.max(70).warning(
            "Longer titles may be truncated by search engines"
          ),
      },
      {
        name: "description",
        title: "Description",
        type: "text",
        rows: 2,
        validation: (Rule: {
          max: (arg0: number) => {
            (): any;
            new (): any;
            warning: { (arg0: string): any; new (): any };
          };
        }) =>
          Rule.max(160).warning(
            "Longer descriptions may be truncated by search engines"
          ),
      },
      {
        name: "image",
        type: "image",
        title: "Image",
      },
    ],
  },
  {
    name: "mainArticle",
    title: "Main Article",
    type: "reference",
    to: [{ type: "article" }],
  },
  {
    name: "heroArticles",
    title: "Pinned Hero Articles as Card",
    type: "array",
    validation: (Rule: { length: (arg0: number) => any }) => Rule.length(4),
    of: [{ type: "reference", to: [{ type: "article" }] }],
  },
  {
    name: "heroLists",
    title: "Pinned Hero Articles as Text",
    validation: (Rule: { length: (arg0: number) => any }) => Rule.length(5),
    type: "array",
    of: [
      {
        type: "reference",
        to: [{ type: "article" }],
        options: {
          filter: "type == $articleType",
          filterParams: { articleType: "rankings" },
        },
      },
    ],
    description: "These articles will be pinned as text only on the hero",
  },
];
