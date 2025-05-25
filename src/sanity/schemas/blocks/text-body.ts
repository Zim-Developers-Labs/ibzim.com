import { defineField } from "sanity";

export default defineField({
  name: "textBody",
  title: "Text",
  type: "array",
  of: [
    {
      type: "block",
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          {
            title: "Italic",
            value: "em",
          },
          {
            title: "Strong",
            value: "strong",
          },
          {
            title: "Underline",
            value: "underline",
          },
          {
            title: "Code",
            value: "code",
          },
        ],
        annotations: [
          {
            name: "annotationLink",
            type: "link.annotation",
          },
          {
            name: "annotationInternalLink",
            type: "internalLink.annotation",
          },
          {
            name: "annotationReference",
            type: "reference.annotation",
          },
          {
            name: "annotationChange",
            type: "change.annotation",
          },
        ],
      },
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Quote", value: "blockquote" },
      ],
    },
    // Custom blocks
  ],
});
