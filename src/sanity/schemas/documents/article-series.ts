import { RocketIcon } from "@sanity/icons";
import { defineType } from "sanity";

export default defineType({
  name: "article.series",
  title: "Article Series",
  icon: RocketIcon,
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
    },
    {
      name: "seo",
      type: "object",
      title: "SEO",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule) =>
            Rule.min(50)
              .max(60)
              .warning(
                "SEO Title should be in range of 50 to 60 characters long"
              ),
        },
        {
          name: "description",
          title: "Description",
          type: "text",
          rows: 2,
          validation: (Rule) =>
            Rule.min(140)
              .warning(
                "SEO Description should be more than 140 characters long"
              )
              .max(160)
              .warning(
                "SEO Description should be less than 160 characters long"
              ),
        },
        {
          name: "image",
          type: "image",
          description:
            "SEO Image must have a 1200px width and 675px height. Use originally created images with 0 to minimal text on it.",
          title: "Image",
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      media: "seo.image",
    },
    prepare({ title, media }) {
      return { title, media };
    },
  },
});
