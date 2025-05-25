import { MyCustomStringInput } from '@/sanity/components/customStringInput';
import { MyCustomTextArea } from '@/sanity/components/customTextInput';
import { defineField, defineType } from 'sanity';

/**
 * Post schema.  Define and edit the fields for the 'post' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export default defineType({
  name: 'zw.news',
  title: 'ZW News',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'seo',
      type: 'object',
      title: 'SEO',
      fields: [
        {
          name: 'title',
          title: 'Title',
          description: 'This should match the anticipated user search query',
          type: 'string',
          components: {
            input: MyCustomStringInput,
          },
          validation: (Rule) =>
            Rule.min(50)
              .max(60)
              .error(
                'SEO Title should be in range of 50 to 60 characters long (use character counter site)',
              ),
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          components: {
            input: MyCustomTextArea,
          },
          description:
            "This should clearly define what's to be found in the article and should also include anticipated user search query",
          rows: 3,
          validation: (Rule) =>
            Rule.min(140)
              .max(160)
              .error(
                'SEO Description should be 140 to 160 characters long (use character counter site)',
              ),
        },
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'A short summary of the article',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});
