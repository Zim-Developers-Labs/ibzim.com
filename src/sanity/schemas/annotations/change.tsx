/**
 * Annotations are ways of marking up text in the block content editor.
 *
 * Read more: https://www.sanity.io/docs/customization#f924645007e1
 */

import { ChartUpwardIcon } from "@sanity/icons";
import { defineField } from "sanity";

export default defineField({
  title: "Change",
  name: "change.annotation",
  type: "object",
  icon: ChartUpwardIcon,
  components: {
    annotation: (props) => (
      <span>
        <ChartUpwardIcon
          style={{
            marginLeft: "0.05em",
            marginRight: "0.1em",
            width: "0.75em",
          }}
        />
        {props.renderDefault(props)}
      </span>
    ),
  },
  fields: [
    {
      name: "changeType",
      title: "Change Type",
      type: "string",
      options: {
        list: [
          { title: "Stable", value: "isStable" },
          { title: "Rising", value: "isRising" },
          { title: "Dropping", value: "isDropping" },
        ],
      },
    },
  ],
});
