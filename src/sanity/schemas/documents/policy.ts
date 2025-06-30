import { EnvelopeIcon } from "@sanity/icons";
import { defineType } from "sanity";
import { format, parseISO } from "date-fns";

export default defineType({
  name: "policy",
  title: "Policy",
  type: "document",
  icon: EnvelopeIcon,
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
      options: {
        source: "name",
        maxLength: 200,
      },
    },
    {
      name: "title",
      type: "string",
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
          type: "string",
          validation: (Rule) =>
            Rule.max(70).warning(
              "Longer titles may be truncated by search engines"
            ),
        },
        {
          name: "description",
          title: "Description",
          type: "text",
          rows: 2,
          validation: (Rule) =>
            Rule.max(160).warning(
              "Longer descriptions may be truncated by search engines"
            ),
        },
      ],
    },
    {
      name: "subHeadings",
      title: "Sub Headings",
      description:
        "Write your h2 and h3 sub headings exactly as they appear in the article body",
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
      title: "title",
      date: "_updatedAt",
    },
    prepare({ title, date }) {
      return {
        title,
        media: EnvelopeIcon,
        subtitle: format(parseISO(date), "LLL d, yyyy"),
      };
    },
  },
});
