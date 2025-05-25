import { defineField } from "sanity";

export default defineField({
  name: "productSummary.object",
  title: "Product Summary",
  type: "object",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "image",
      title: "Image",
      type: "image",
    },
    {
      name: "award",
      title: "Best For Award",
      type: "string",
    },
    {
      name: "tagline",
      title: "Tagline",
      type: "string",
    },
    {
      name: "rating",
      title: "Rating",
      type: "number",
    },
    {
      name: "why",
      title: "Why We Picked It",
      type: "array",
      of: [{ type: "text", rows: 3 }],
    },
    {
      name: "pros",
      title: "Pros",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "cons",
      title: "Cons",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "details",
      title: "Details",
      type: "array",
      of: [{ type: "text", rows: 3 }],
    },
    {
      name: "link",
      title: "Link",
      type: "object",
      fields: [
        {
          name: "url",
          title: "URL",
          type: "url",
        },
        {
          name: "text",
          title: "Text",
          type: "string",
        },
        {
          name: "dofollow",
          title: "Do Follow",
          type: "boolean",
        }
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subTitle: 'subTitle',
      rating: 'rating',
      media: 'image',
    },
    prepare(selection) {
      const { title, subTitle, rating, media } = selection;
      return {
        title: title || 'No Title',
        subtitle: `${subTitle || ''} ${rating ? `(${rating.toFixed(1)} stars)` : ''}`,
        media: media,
      };
    },
  },
})
