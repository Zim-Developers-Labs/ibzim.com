import { BookIcon } from "@sanity/icons";
import { defineType } from "sanity";
import { format, parseISO } from "date-fns";
import { MyCustomStringInput } from "../../components/customStringInput";
import { MyCustomTextArea } from "../../components/customTextInput";

export default defineType({
  name: "press.article",
  title: "Press Article",
  type: "document",
  icon: BookIcon,
  fields: [
    {
      name: "name",
      type: "string",
      description: "Set a 3 - 5 word keyword as the name of your page",
      title: "Name",
    },
    {
      name: "slug",
      type: "slug",
      title: "Slug",
      description:
        "Don't manually write slugs. Generate from name! Slug shouldn't be changed once published",
      options: {
        source: "name",
        maxLength: 50,
      },
    },
    {
      name: "title",
      type: "string",
      description:
        "H1 title to be shown within the article (do not duplicate name or seo title here)",
      title: "Title",
    },
    {
      name: "seo",
      type: "object",
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
        },
        {
          name: "image",
          type: "image",
          description:
            "SEO Image must have a 1200px width and 675px height. Use originally created images with 0 to minimal text on it. Edit images first if found from external sources like Unsplash",
          title: "Image",
        },
      ],
    },
    {
      name: "intro",
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
    },
    {
      name: "hasProductListing",
      description: "Only use on listicle article with products",
      title: "Has Product Listing",
      type: "boolean",
      hidden: ({ parent }) => parent.type != "rankings",
      initialValue: false,
    },
    {
      name: "products",
      title: "Products",
      hidden: ({ parent }) =>
        !parent.hasProductListing || parent.type != "rankings",
      type: "array",
      validation: (rule) => rule.min(3),
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
            prepare({ title, subtitle, media }) {
              return {
                title: title,
                subtitle: subtitle,
                media: media,
              };
            },
          },
        },
      ],
    },
    {
      name: "subHeadings",
      title: "Sub Headings",
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
    },
    {
      name: "body",
      title: "Body",
      type: "body",
    },
  ],
  preview: {
    select: {
      title: "name",
      date: "_updatedAt",
      media: "seo.image",
    },
    prepare({ title, media, date }) {
      const subtitles = [
        date && `on ${format(parseISO(date), "LLL d, yyyy")}`,
      ].filter(Boolean);

      return { title, media, subtitle: subtitles.join(" ") };
    },
  },
});
