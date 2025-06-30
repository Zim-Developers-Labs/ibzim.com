/**
 * Annotations are ways of marking up text in the block content editor.
 *
 * Read more: https://www.sanity.io/docs/customization#f924645007e1
 */
import { LinkIcon } from "@sanity/icons";
import { defineField } from "sanity";

export default defineField({
  title: "Internal Link",
  name: "internalLink.annotation",
  type: "object",
  icon: LinkIcon,
  components: {
    annotation: (props) => (
      <span>
        <LinkIcon
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
      name: "internalPage",
      type: "reference",
      validation: (Rule) => Rule.required(),
      to: [{ type: "article" }, { type: "profile" }],
    },
  ],
});
