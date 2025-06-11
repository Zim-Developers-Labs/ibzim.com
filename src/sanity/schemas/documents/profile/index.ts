import { DatabaseIcon } from '@sanity/icons';
import { blockContentToPlainText } from 'react-portable-text';
import { MyCustomStringInput } from '../../../components/customStringInput';
import { MyCustomTextArea } from '../../../components/customTextInput';
import { defineField } from 'sanity';
import { INPUT_GROUP, SOCIAL_PROFILES } from '@/sanity/constants';

export const ProfileFields = [
  defineField({
    name: 'name',
    title: 'Name',
    description:
      "This is the target keyword, Google it and if there is no potential to outrank the top 3 change the keyword. It should be something with search volume. Targeting plain entity name keyword is usually a bad idea so try doing keyword research for keyword e.g we cant rank for Tino Mazorodze because he already has his own website which google will see most appropriate. instead consider saying Tino Mazorodze Biography / Overview / About (unless he already has an about page). This is very crucial so seek help if you don't know how to do keyword research.",
    type: 'string',
    validation: (rule: { required: () => any }) => rule.required(),
    group: INPUT_GROUP.CONFIG,
  }),
  defineField({
    name: 'slug',
    type: 'slug',
    description:
      'generate from name but make sure to keep it short and something that a real person would search for. this is the exact target keyword we aim to rank for.',
    title: 'Slug',
    options: {
      source: 'name',
      maxLength: 50,
    },
    group: INPUT_GROUP.CONFIG,
  }),
  defineField({
    name: 'legalName',
    title: 'Legal Name',
    description:
      'Simply Search `[Entity Name] legal name` on google and write it here',
    type: 'string',
    group: INPUT_GROUP.EDITORIAL,
  }),
  defineField({
    name: 'entityType',
    title: 'Entity Type',
    type: 'string',
    options: {
      direction: 'horizontal',
      layout: 'radio',
      list: [
        { title: 'Company', value: 'company' },
        { title: 'Person', value: 'person' },
        { title: 'School', value: 'school' },
        { title: 'Place', value: 'place' },
        { title: 'Day', value: 'day' },
        { title: 'Other', value: 'other' },
      ],
    },
    initialValue: 'person',
    group: INPUT_GROUP.CONFIG,
  }),
  defineField({
    name: 'picture',
    title: 'Picture',
    group: INPUT_GROUP.EDITORIAL,
    type: 'image',
    description:
      "SEO Image must have a 1:1 ratio: 500px by 500px is recommended or 16:9: 1200px by 675px. If not a logo be sure to edit it to avoid duplication of already indexed images on google. Google search the entity > go to images > click on tools > change size to large > select and download the most suitable image > if just a logo take it to figma and place it in a 500x500px frame with and export / if a potrait of an entity remove the background using photoshop and put it in a frame with a fitting background or the default in figma. If you don't understand seek help this is crucial is it may lead to copyright issues.",
    fields: [
      {
        name: 'ratio',
        title: 'Ration',
        type: 'string',
        options: {
          direction: 'horizontal',
          layout: 'radio',
          list: [
            { title: '1:1', value: '1:1' },
            { title: '16:9', value: '16:9' },
          ],
        },
        initialValue: '1:1',
      },
      {
        name: 'source',
        description:
          'Optional: only mention source if not acquired from entity profile like Instagram or entity website.',
        title: 'Source',
        type: 'object',
        fields: [
          {
            name: 'name',
            type: 'string',
            title: 'Name',
          },
          {
            name: 'url',
            type: 'url',
            title: 'URL',
          },
        ],
      },
      {
        name: 'alt',
        type: 'string',
        title: 'Image Caption',
        description:
          'Describe the Image e.g [entity name] Logo/Potrait/Building.',
      },
    ],
    options: { hotspot: true },
    validation: (rule: { required: () => any }) => rule.required(),
  }),
  defineField({
    name: 'title',
    title: 'Title',
    group: INPUT_GROUP.EDITORIAL,
    description:
      'Profile Title here. Can also include other aliases e.g Tino Mazorodze (AKA TechTinoe) Biography. This will be the H1 also make it include the target keyword.',
    type: 'string',
  }),
  defineField({
    name: 'subTitle',
    group: INPUT_GROUP.EDITORIAL,
    description:
      'a very short describing title e.g Zimbabwean Musician or Financial Services Company',
    title: 'Sub Title',
    type: 'string',
    validation: (Rule) =>
      Rule.max(50).warning(
        'Longer Sub Titles may disorient structure of the page',
      ),
  }),
  defineField({
    name: 'yearFounded',
    title: 'Year Founded',
    group: INPUT_GROUP.EDITORIAL,
    type: 'number',
    hidden: ({ parent }) =>
      parent.entityType == 'person' || parent.entityType == 'day',
  }),
  defineField({
    name: 'birthDate',
    title: 'Birth Date',
    group: INPUT_GROUP.EDITORIAL,
    type: 'date',
    hidden: ({ parent }) => parent.entityType !== 'person',
  }),
  defineField({
    name: 'isBirthDateApproximate',
    group: INPUT_GROUP.EDITORIAL,
    description:
      'Check this if the birth date is not exact, e.g. if it is an estimated date.',
    title: 'Is Birth Date Approximate?',
    hidden: ({ parent }) => parent.entityType !== 'person',
    type: 'boolean',
    initialValue: false,
  }),
  defineField({
    name: 'seo',
    type: 'object',
    group: INPUT_GROUP.SEO,
    title: 'SEO',
    fields: [
      {
        name: 'title',
        title: 'Title',
        description:
          'This should match the anticipated user search query. SEO title for profiles can be limited to Profile Name',
        type: 'string',
        components: {
          input: MyCustomStringInput,
        },
        validation: (Rule) =>
          Rule.max(60).error(
            'SEO Title should not be more than 60 characters wrong (use character counter site)',
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
          'Start with answering the question what is [entity]. Basically say [entity] is [what you said on subtitle here] and maybe state where entity is based if length permits. Next write what is to be found in the profile article e.g in this article are details on [entity] history, products and services/career etc.',
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
    name: 'additionalInfo',
    group: INPUT_GROUP.EDITORIAL,
    title: 'Additional Table Information',
    description:
      'Check other exisiting similar profiles if you are not sure what to add this section',
    type: 'array',
    of: [
      {
        type: 'object',
        fields: [
          {
            name: 'tableHeading',
            title: 'Table Heading',
            type: 'string',
          },
          {
            name: 'tableData',
            title: 'Table Data',
            type: 'textBody',
          },
        ],
        preview: {
          select: {
            heading: 'tableHeading',
            data: 'tableData',
          },
          prepare({ heading, data }) {
            return {
              title: `${heading} = ${blockContentToPlainText(data)}`,
              icon: DatabaseIcon,
            };
          },
        },
      },
    ],
  }),
  defineField({
    name: 'socialLinks',
    group: INPUT_GROUP.EDITORIAL,
    title: 'Social Links',
    type: 'array',
    validation: (Rule) =>
      Rule.max(5).warning(
        'More than 5 social link may not be displayed properly',
      ),
    of: [
      {
        type: 'object',
        fields: [
          {
            name: 'name',
            title: 'Name',
            type: 'string',
            options: {
              list: SOCIAL_PROFILES,
            },
          },
          {
            name: 'link',
            title: 'Link',
            type: 'url',
          },
        ],
      },
    ],
  }),
  defineField({
    name: 'intro',
    title: 'Introduction',
    group: INPUT_GROUP.EDITORIAL,
    description:
      'write a precise description of {entity name} which answers the question What is {entity name} without sounding like you are promoting the {entity type e.g company, person}. you can use this command in an AI tool.',
    type: 'text',
    components: {
      input: MyCustomTextArea,
    },
    validation: (rule) =>
      rule
        .required()
        .min(140)
        .max(180)
        .error(
          'Intro must be at 140 to 180 characters long (use character counter site)',
        ),
    rows: 3,
  }),
  defineField({
    name: 'tblContentsType',
    title: 'Table of Contents Type',
    group: INPUT_GROUP.CONFIG,
    type: 'string',
    options: {
      direction: 'horizontal',
      layout: 'radio',
      list: [
        { title: 'Disabled', value: 'disabled' },
        { title: 'Automatic', value: 'auto' },
        { title: 'Manual', value: 'manual' },
      ],
    },
    initialValue: 'disabled',
  }),
  defineField({
    name: 'subHeadings',
    title: 'Sub Headings',
    group: INPUT_GROUP.EDITORIAL,
    hidden: ({ parent }) => parent.tblContentsType != 'manual',

    description:
      '(for very long articles only) Write your h2 and h3 sub headings exactly as they appear in the article body',
    type: 'array',
    of: [
      {
        type: 'object',
        fields: [
          {
            name: 'title',
            title: 'Title',
            type: 'string',
          },
          {
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
              list: [
                { title: 'h2', value: 'h2' },
                { title: 'h3', value: 'h3' },
                { title: 'h4', value: 'h4' },
              ],
            },
          },
        ],
      },
    ],
  }),
  defineField({
    name: 'body',
    description:
      'Come up with an outline (outline should include titles which have search traffic) and always the entity history is the first title. Come up with these through keyword research) and ask AI to write a bio from that outline without sounding like it is promoting the entity. This is very crucial be sure to edit out statements which sound promotional. Paragraphs should not be too long to improve readablity. NB: Only do this in profile articles and remember to order titles correctly starting from h2.',
    group: INPUT_GROUP.EDITORIAL,
    title: 'Body',
    type: 'body',
  }),
  defineField({
    name: 'hasCanonical',
    group: INPUT_GROUP.CONFIG,
    description:
      'Only use when this aticle is blocking the ranking of another article',
    title: 'Originated from another article?',
    type: 'boolean',
    initialValue: false,
  }),
  defineField({
    name: 'canonical',
    group: INPUT_GROUP.CONFIG,
    title: 'Canonical URL',
    hidden: ({ parent }) => !parent.hasCanonical,
    type: 'url',
  }),
  defineField({
    name: 'truthScore',
    group: INPUT_GROUP.CONFIG,
    title: 'Truth Score Percentage',
    description: 'Do not edit this field',
    type: 'number',
    validation: (rule) => rule.min(0).max(100),
    initialValue: 10,
  }),
];
