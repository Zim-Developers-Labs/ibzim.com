/**
 * Annotations are ways of marking up text in the block content editor.
 *
 * Read more: https://www.sanity.io/docs/customization#f924645007e1
 */
import { defineField } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

export default defineField({
  title: "External Link",
  name: "link.annotation",
  type: "object",
  icon: EarthGlobeIcon,
  components: {
    annotation: (props) => (
      <span>
        <EarthGlobeIcon
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
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
    },
    {
      title: "Dofollow Link? (NB: Might Affect Rankings)",
      name: "dofollow",
      type: "boolean",
      initialValue: false,
    },
  ],
});
