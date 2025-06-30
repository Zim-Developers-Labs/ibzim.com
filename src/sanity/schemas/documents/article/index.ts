import { MyCustomStringInput } from "../../../components/customStringInput";
import { MyCustomTextArea } from "../../../components/customTextInput";
import { ARTICLE_TYPES, INPUT_GROUP } from "../../../constants";
import { defineField } from "sanity";

export const ArticleFields = [
  defineField({
    name: "name",
    type: "string",
    description:
      "This is the target keyword, Google it and if there is no potential to outrank the top 3 change the keyword. It should be something with search volume.",
    title: "Name",
    group: INPUT_GROUP.CONFIG,
  }),
  defineField({
    name: "slug",
    type: "slug",
    title: "Slug",
    description:
      "Don't manually write slugs. Generate from name! Slug shouldn't be changed once published",
    options: {
      source: "name",
      maxLength: 50,
    },
    group: INPUT_GROUP.CONFIG,
  }),
  defineField({
    name: "title",
    type: "string",
    group: INPUT_GROUP.EDITORIAL,
    description:
      "H1 title to be shown within the article (do not duplicate name or seo title here)",
    title: "Title",
  }),
  defineField({
    name: "author",
    title: "Author",
    group: INPUT_GROUP.CONFIG,
    type: "reference",
    to: [{ type: "author" }],
  }),
  defineField({
    name: "seriesArticle",
    group: INPUT_GROUP.CONFIG,
    title: "Is Part of an article series",
    description:
      "Clear industry and Type fields before turning this into a series article",
    type: "boolean",
    initialValue: false,
  }),
  defineField({
    name: "industry",
    title: "Industry",
    group: INPUT_GROUP.CONFIG,
    type: "reference",
    to: [{ type: "article.industry" }],
  }),
  defineField({
    name: "type",
    type: "string",
    group: INPUT_GROUP.CONFIG,
    title: "Type",
    options: {
      layout: "dropdown",
      list: ARTICLE_TYPES,
    },
  }),
  defineField({
    name: "seo",
    type: "object",
    group: INPUT_GROUP.SEO,
    title: "SEO",
    fields: [
      {
        name: "title",
        title: "Title",
        description: "This should match the anticipated user search query",
        type: "string",
        components: {
          input: MyCustomStringInput,
        },
        validation: (Rule) =>
          Rule.min(50)
            .max(60)
            .error(
              "SEO Title should be in range of 50 to 60 characters long (use character counter site)"
            ),
      },
      {
        name: "description",
        title: "Description",
        type: "text",
        components: {
          input: MyCustomTextArea,
        },
        description:
          "This should clearly define what's to be found in the article and should also include anticipated user search query",
        rows: 3,
        validation: (Rule) =>
          Rule.min(140)
            .max(160)
            .error(
              "SEO Description should be 140 to 160 characters long (use character counter site)"
            ),
      },
      {
        name: "image",
        type: "image",
        description:
          "SEO Image must have a 1200px width and 675px height. Use originally created images with 0 to minimal text on it. Edit images first if found from external sources like Unsplash",
        title: "Image",
      },
    ],
  }),
  defineField({
    name: "intro",
    group: INPUT_GROUP.EDITORIAL,
    title: "Intro",
    validation: (rule) =>
      rule
        .required()
        .min(160)
        .max(300)
        .error(
          "Intro must be at 160 to 300 characters long (use character counter site)"
        ),
    description:
      "Avoid using AI on introductions. Use personalized words like I, we, you and add a little humor.",
    type: "text",
    rows: 3,
  }),
  defineField({
    name: "hasProductListing",
    group: INPUT_GROUP.CONFIG,
    description: "Only use on listicle article with products",
    title: "Has Product Listing",
    type: "boolean",
    hidden: ({ parent }) => parent.type != "rankings",
    initialValue: false,
  }),
  defineField({
    name: "products",
    group: INPUT_GROUP.EDITORIAL,
    title: "Products",
    hidden: ({ parent }: any) =>
      !parent.hasProductListing || parent.type != "rankings",
    type: "array",
    validation: (rule: { min: (arg0: number) => any }) => rule.min(3),
    of: [
      {
        type: "object",
        fields: [
          {
            name: "name",
            title: "Name",
            type: "string",
          },
          {
            name: "bestFor",
            title: "Best for",
            type: "string",
          },
          {
            name: "image",
            title: "Image",
            type: "image",
          },
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              {
                name: "text",
                title: "Text",
                type: "string",
              },
              {
                name: "url",
                title: "URL",
                type: "url",
              },
              {
                name: "dofollow",
                title: "Dofollow",
                type: "boolean",
              },
            ],
          },
        ],
        preview: {
          select: {
            title: "name",
            subtitle: "description",
            media: "image",
          },
          prepare({ title, subtitle, media }: any) {
            return {
              title: title,
              subtitle: subtitle,
              media: media,
            };
          },
        },
      },
    ],
  }),
  defineField({
    name: "tblContentsType",
    title: "Table of Contents Type",
    group: INPUT_GROUP.CONFIG,
    type: "string",
    options: {
      direction: "horizontal",
      layout: "radio",
      list: [
        { title: "Disabled", value: "disabled" },
        { title: "Automatic", value: "auto" },
        { title: "Manual", value: "manual" },
      ],
    },
    initialValue: "disabled",
  }),
  defineField({
    name: "subHeadings",
    title: "Sub Headings",
    group: INPUT_GROUP.EDITORIAL,
    hidden: ({ parent }: any) => parent.tblContentsType != "manual",
    description:
      "(for very long articles only) Write your h2 and h3 sub headings exactly as they appear in the article body",
    type: "array",
    of: [
      {
        type: "object",
        fields: [
          {
            name: "title",
            title: "Title",
            type: "string",
          },
          {
            name: "type",
            title: "Type",
            type: "string",
            options: {
              list: [
                { title: "h2", value: "h2" },
                { title: "h3", value: "h3" },
                { title: "h4", value: "h4" },
              ],
            },
          },
        ],
      },
    ],
  }),
  defineField({
    name: "body",
    group: INPUT_GROUP.EDITORIAL,
    title: "Body",
    type: "body",
  }),
  defineField({
    name: "hasCanonical",
    group: INPUT_GROUP.CONFIG,
    description:
      "Only use when this aticle is blocking the ranking of another article",
    title: "Originated from another article?",
    type: "boolean",
    initialValue: false,
  }),
  defineField({
    name: "canonical",
    group: INPUT_GROUP.CONFIG,
    title: "Canonical URL",
    hidden: ({ parent }: any) => !parent.hasCanonical,
    type: "url",
  }),
  defineField({
    name: "truthScore",
    title: "Truth Score",
    group: INPUT_GROUP.CONFIG,
    type: "number",
    validation: (rule) => rule.min(0).max(100),
    initialValue: 10,
  }),
];
