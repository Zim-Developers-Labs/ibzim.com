import { defineField } from "sanity";

export default defineField({
  name: "buttonCta.object",
  title: "CTA Button",
  type: "object",
  fields: [
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          { title: 'Single', value: 'single' },
          { title: 'Two Button', value: 'twoButton' },
        ],
      },
    },
    {
      name: 'text',
      title: 'Display Text',
      type: "string"
    },
    {
      name: 'linkUrl',
      title: "Link Url",
      type: 'url'
    }
  ]
})
