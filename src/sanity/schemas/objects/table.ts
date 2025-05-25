import { ThListIcon } from "@sanity/icons";
import { defineField } from "sanity";

export default defineField({
  name: "table.object",
  title: "Table",
  type: "object",
  fields: [
    {
      name: "hasSorting",
      description: "Only use on tables with multiple key numerical fields",
      title: "Sorted Table",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "rows",
      title: "Rows",
      description:
        "Each row is a string array of the same length as the header e.g.  1 | 2 | 3",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
  preview: {
    select: {
      rows: "rows",
    },
    prepare(selection) {
      const { rows } = selection;
      const columnCount = rows[0].split("|").length;
      return {
        title: "Table",
        subtitle: `${rows.length} rows with ${columnCount} columns each`,
        media: ThListIcon,
      };
    },
  },
});
