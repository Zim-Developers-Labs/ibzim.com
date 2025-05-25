import { ImageIcon, ImagesIcon } from "@sanity/icons";
import { defineField } from "sanity";

export default defineField({
  name: "imageCarousel.object",
  title: "Image Carousel",
  type: "object",
  icon: ImagesIcon,
  fields: [
    {
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "object",
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
              validation: (rule) => rule.required(),
              type: "string",
            },
          ],
        },
      ],
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
      images: "images",
    },
    prepare(selection) {
      const { images } = selection;

      return {
        media: ImagesIcon,
        subtitle: `Carousel of ${images.length} images`,
        title: "Image Carousel",
      };
    },
  },
});
