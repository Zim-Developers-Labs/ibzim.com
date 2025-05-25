import { defineField } from "sanity";
import HandShakeIcon from "../../components/icons/handshake-icon";

export default defineField({
  name: "partnersCard.object",
  title: "Partners Card",
  type: "object",
  fields: [
    {
      name: "partners",
      type: "array",
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
              name: "image",
              title: "Image",
              type: "image",
            },
            {
              name: "imageRatio",
              title: "Image Ratio",
              type: "string",
              options: {
                layout: "radio",
                direction: "horizontal",
                list: ["1x1", "5x1"],
              },
            },
            {
              name: "startingPrice",
              title: "Starting Price",
              type: "string",
            },
            {
              name: "link",
              title: "Link",
              type: "url",
            },
            {
              name: "features",
              title: "Features",
              type: "array",
              of: [{ type: "string" }],
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      partners: "partners",
    },
    prepare(selection) {
      const { title, partners } = selection;
      return {
        title: `Partners for ${title}`,
        subtitle: `${partners.length} partners`,
        media: HandShakeIcon,
      };
    },
  },
});
