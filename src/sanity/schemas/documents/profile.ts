import { DatabaseIcon, UserIcon } from "@sanity/icons";
import { blockContentToPlainText } from "react-portable-text";
import { defineType } from "sanity";
import { MyCustomStringInput } from "../../components/customStringInput";
import { MyCustomTextArea } from "../../components/customTextInput";
import { SOCIAL_PROFILES } from "@/sanity/constants";

export default defineType({
  name: "profile",
  title: "Profile",
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
      name: "legalName",
      title: "Legal Name",
      type: "string",
    },
    {
      name: "entityType",
      title: "Entity Type",
      type: "string",
      options: {
        direction: "horizontal",
        layout: "radio",
        list: [
          { title: "Company", value: "company" },
          { title: "Person", value: "person" },
          { title: "School", value: "school" },
          { title: "Place", value: "place" },
          { title: "Day", value: "day" },
          { title: "Other", value: "other" },
        ],
      },
      initialValue: "person",
    },
    {
      name: "picture",
      title: "Picture",
      type: "image",
      description:
        "SEO Image must have a 1:1 ratio: 500px by 500px is recommended or 16:9: 1200px by 675px.",
      fields: [
        {
          name: "ratio",
          title: "Ration",
          type: "string",
          options: {
            direction: "horizontal",
            layout: "radio",
            list: [
              { title: "1:1", value: "1:1" },
              { title: "16:9", value: "16:9" },
            ],
          },
          initialValue: "person",
        },
        {
          name: "source",
          description:
            "Optional: only mention source if not acquired from entity profile like Instagram or entity website.",
          title: "Source",
          type: "object",
          fields: [
            {
              name: "name",
              type: "string",
              title: "Name",
            },
            {
              name: "url",
              type: "url",
              title: "URL",
            },
          ],
        },
        {
          name: "alt",
          type: "string",
          title: "Image Caption",
          description: "Describe the Image e.g [name] Logo/Potrait/Building.",
        },
      ],
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    },
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "subTitle",
      title: "Sub Title",
      type: "string",
      validation: (Rule) =>
        Rule.max(50).warning(
          "Longer Sub Titles may disorient structure of the page"
        ),
    },
    {
      name: "yearFounded",
      title: "Year Founded",
      type: "number",
      hidden: ({ parent }) =>
        parent.entityType == "person" || parent.entityType == "day",
    },
    {
      name: "birthDate",
      title: "Birth Date",
      type: "date",
      hidden: ({ parent }) => parent.entityType !== "person",
    },
    {
      name: "seo",
      type: "object",
      title: "SEO",
      fields: [
        {
          name: "title",
          title: "Title",
          description:
            "This should match the anticipated user search query. SEO title for profiles can be limited to Profile Name",
          type: "string",
          components: {
            input: MyCustomStringInput,
          },
          validation: (Rule) =>
            Rule.max(60).error(
              "SEO Title should not be more than 60 characters wrong (use character counter site)"
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
            "This should clearly define what's to be found in the profile and should also include anticipated user search query",
          rows: 3,
          validation: (Rule) =>
            Rule.min(140)
              .max(160)
              .error(
                "SEO Description should be 140 to 160 characters long (use character counter site)"
              ),
        },
      ],
    },
    {
      name: "additionalInfo",
      title: "Additional Table Information",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "tableHeading",
              title: "Table Heading",
              type: "string",
            },
            {
              name: "tableData",
              title: "Table Data",
              type: "textBody",
            },
          ],
          preview: {
            select: {
              heading: "tableHeading",
              data: "tableData",
            },
            prepare({ heading, data }) {
              return {
                title: `${heading} = ${blockContentToPlainText(data)}`,
                icon: DatabaseIcon,
              };
            },
          },
        },
      ],
    },
    {
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      validation: (Rule) =>
        Rule.max(5).warning(
          "More than 5 social link may not be displayed properly"
        ),
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Name",
              type: "string",
              options: {
                list: SOCIAL_PROFILES,
              },
            },
            {
              name: "link",
              title: "Link",
              type: "url",
            },
          ],
        },
      ],
    },
    {
      name: "intro",
      title: "Introduction",
      type: "text",
      components: {
        input: MyCustomTextArea,
      },
      validation: (rule) =>
        rule
          .required()
          .min(140)
          .max(170)
          .error(
            "Intro must be at 140 to 160 characters long (use character counter site)"
          ),
      description:
        "Avoid using AI on introductions. Describe the entity clearly in not more than 2 sentences.",
      rows: 3,
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
    {
      name: "relatedProfiles",
      title: "Related Profiles",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "profile" }],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "entityType",
      media: "picture",
    },
    prepare({ title, media, subtitle }) {
      return { title, subtitle, media };
    },
  },
});
