import { defineField } from "sanity";

export default defineField({
  name: "question",
  title: "FAQ Question",
  type: "object",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "answers",
      title: "Answers",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
});
