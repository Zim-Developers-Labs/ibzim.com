/**
 * Annotations are ways of marking up text in the block content editor.
 *
 * Read more: https://www.sanity.io/docs/customization#f924645007e1
 */

import { EqualIcon } from "@sanity/icons";
import { defineField } from "sanity";

export default defineField({
  title: "Reference",
  name: "reference.annotation",
  type: "object",
  icon: EqualIcon,
  fieldsets: [
    {
      name: "group1",
      title: "Group 1",
      options: {
        collapsible: true, // Makes the whole fieldset collapsible
        collapsed: true, // Defines if the fieldset should be collapsed by default or not
        columns: 3, // Defines a grid for the fields and how many columns it should have
        modal: { type: "popover" }, //Makes the modal type a popover
      },
    },
    {
      name: "group2",
      title: "Group 2",
      options: {
        collapsible: true, // Makes the whole fieldset collapsible
        collapsed: true, // Defines if the fieldset should be collapsed by default or not
        columns: 3, // Defines a grid for the fields and how many columns it should have
        modal: { type: "popover" }, //Makes the modal type a popover
      },
    },
  ],
  components: {
    annotation: (props) => (
      <span>
        <EqualIcon
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
    defineField({
      name: "number",
      type: "number",
      title: "Reference Number",
      fieldset: "group1",
    }),
    defineField({
      name: "url",
      type: "url",
      title: "URL",
      fieldset: "group1",
    }),
    defineField({
      name: "linkText",
      type: "string",
      title: "Link Text",
      fieldset: "group1",
    }),
    defineField({
      name: "sourceTitle",
      type: "string",
      title: "Source Title",
      fieldset: "group2",
    }),
    defineField({
      name: "datePublished",
      type: "date",
      title: "Date Published",
      fieldset: "group2",
    }),
  ],
});
