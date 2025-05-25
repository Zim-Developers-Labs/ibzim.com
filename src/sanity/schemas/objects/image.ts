import { ImageIcon } from "@sanity/icons";
import { defineField } from "sanity";

export default defineField({
  name: "image.object",
  title: "Image",
  type: "object",
  icon: ImageIcon,
  fields: [
    {
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      icon: ImageIcon,
    },
    {
      name: "alt",
      title: "Alt Text",
      type: "string",
      validation: (rule) => rule.required(),
    },
    {
      name: "withCustomHeight",
      title: "Has custom height?",
      type: "boolean",
      description: "(Optional) Use if image height is more than 720px",
      initialValue: false,
    },
    {
      name: "imageHeight",
      title: "Image Height",
      type: "number",
      hidden: ({ parent }) => !parent.withCustomHeight,
    },
    {
      name: "withImageCredits",
      title: "Include Image Credits?",
      type: "boolean",
      description:
        "(Optional) Add name or reference to the photographer or image source",
      initialValue: false,
    },
    {
      name: "imageCredits",
      title: "Image Credits To:",
      type: "string",
      hidden: ({ parent }) => !parent.withImageCredits,
    },
    {
      name: "imageCreditsLink",
      type: "url",
      title: "(optional) Image Credits Link",
      description: "insert link on content relavancy basis",
      hidden: ({ parent }) => !parent.withImageCredits,
    },
  ],
  preview: {
    select: {
      fileName: "image.asset.originalFilename",
      image: "image",
    },

    prepare(selection) {
      const { fileName, image } = selection;

      return {
        media: image,
        subtitle: "Image",
        title: fileName,
      };
    },
  },
});
