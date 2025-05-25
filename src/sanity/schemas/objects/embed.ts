import { defineField } from "sanity";

export default defineField({
  name: "embed.object",
  title: "Embed",
  type: "object",
  fields: [
    defineField({
      title: "Items",
      name: "items",
      type: "array",
      of: [
        {
          name: "figure",
          title: "Figure Embed",
          type: "object",
          fields: [
            defineField({
              name: "figure",
              title: "Figure",
              type: "image",
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: "height",
                  title: "Height",
                  type: "number",
                }),
                defineField({
                  name: "width",
                  title: "Width",
                  type: "number",
                }),
                defineField({
                  name: "alt",
                  title: "Alt Text",
                  type: "string",
                }),
              ],
            }),
          ],
        },
        {
          name: "socialMedia",
          title: "Social Media Embed",
          type: "object",
          fields: [
            defineField({
              name: "displayName",
              title: "Display Name",
              type: "string",
            }),
            defineField({
              name: "subTitle",
              title: "Sub Title",
              type: "string",
            }),
            defineField({
              name: "displayPicture",
              title: "Display Picture",
              type: "image",
              fields: [
                defineField({
                  name: "figCaption",
                  title: "Figure Caption",
                  description: "Alt text will not be displayed",
                  type: "string",
                }),
              ],
            }),
            defineField({
              name: "figure",
              title: "Figure",
              type: "image",
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: "height",
                  title: "Height",
                  type: "number",
                }),
                defineField({
                  name: "width",
                  title: "Width",
                  type: "number",
                }),
                defineField({
                  name: "alt",
                  title: "Alt Text",
                  type: "string",
                }),
              ],
            }),
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Twitter", value: "twitter" },
                  { title: "Instagram", value: "instagram" },
                  { title: "Linkedin", value: "linkedin" },
                ],
              },
            }),
          ],
        },
        {
          name: "plainText",
          title: "Plain Text Embed",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "textBody",
    }),
  ],
});
