import { MyCustomStringInput } from '@/sanity/components/customStringInput';
import { MyCustomTextArea } from '@/sanity/components/customTextInput';
import { NEWS_INDUSTRIES } from '@/sanity/constants';
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
      name: 'name',
      type: 'string',
      description:
        'This is the target keyword, Google it and if there is no potential to outrank the top 3 change the keyword. It should be something with search volume.',
      title: 'Name',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        maxLength: 50,
      },
    }),
    defineField({
      name: 'title',
      title: 'Title',
      description:
        'H1 title to be shown within the article (do not duplicate name or seo title here)',
      type: 'string',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'industry',
      type: 'string',
      title: 'Industry',
      options: {
        layout: 'dropdown',
        list: NEWS_INDUSTRIES,
      },
    }),
    defineField({
      name: 'type',
      type: 'string',
      title: 'Type',
      options: {
        layout: 'dropdown',
        list: [
          {
            title: 'Gossip',
            value: 'gossip',
          },
          {
            title: 'Verified',
            value: 'verified',
          },
        ],
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
        {
          name: 'image',
          type: 'image',
          description:
            'SEO Image must have a 1200px width and 675px height. Use originally created images with 0 to minimal text on it. Edit images first if found from external sources like Unsplash',
          title: 'Image',
        },
      ],
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      validation: (rule) =>
        rule
          .required()
          .min(160)
          .max(300)
          .error(
            'Intro must be at 160 to 300 characters long (use character counter site)',
          ),
      description:
        'Avoid using AI on introductions. Use personalized words like I, we, you and add a little humor.',
      type: 'text',
      rows: 3,
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
      type: 'body',
    }),
    defineField({
      name: 'relatedArticles',
      title: 'Related Articles',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'zw.news' }],
        },
      ],
      description:
        'These articles will be displayed at the hero so make sure they are related to the topic of this article',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      author: 'author.name',
      media: 'seo.image',
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});
