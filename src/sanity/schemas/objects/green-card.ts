import { InfoOutlineIcon } from "@sanity/icons";
import { defineField } from "sanity";

export default defineField({
  name: "greenCard.object",
  title: "Green Card",
  type: "object",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          title: "Block",
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: title || "No Title",
        media: InfoOutlineIcon,
      };
    },
  },
});
