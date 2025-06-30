import { UserIcon } from "@sanity/icons";
import { defineType } from "sanity";

export default defineType({
  name: "editor",
  title: "Editor",
  icon: UserIcon,
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
      type: "slug",
      title: "Slug",
      options: {
        source: "name",
        kMaxLength: 50,
      },
    },
    {
      name: "picture",
      title: "Picture",
      type: "image",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity.",
        },
      ],
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    },
    {
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 3,
    },
    {
      name: "location",
      title: "Location",
      type: "string",
      description: "City, Country",
    },
    {
      name: "links",
      title: "Links",
      type: "object",
      fields: [
        {
          name: "linkedin",
          title: "LinkedIn",
          type: "url",
        },
        {
          name: "website",
          title: "Website",
          type: "url",
        },
      ],
    },
    {
      name: "dateJoined",
      title: "Date Joined",
      type: "date",
      // readOnly: true,
    },
    {
      name: "postTitle",
      title: "Title",
      type: "string",
      // readOnly: true,
    },
  ],
  preview: {
    select: {
      name: "name",
      title: "postTitle",
      media: "picture",
    },
    prepare({ name, title, media }) {
      return { title: name, subtitle: title, media };
    },
  },
});
