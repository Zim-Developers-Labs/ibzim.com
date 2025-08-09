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
    description: 'Write the full name of the entity (school, company, person).',
    type: 'string',
    validation: (rule: { required: () => any }) => rule.required(),
    group: INPUT_GROUP.EDITORIAL,
  }),
  defineField({
    name: 'slug',
    type: 'slug',
    description: "Don't type in this field just click the generate button.",
    title: 'Slug',
    options: {
      source: 'name',
      maxLength: 50,
    },
    group: INPUT_GROUP.EDITORIAL,
  }),
  defineField({
    name: 'legalName',
    title: 'Legal Name',
    description:
      'Write the actual full legal name of the entity (school, company, person).',
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
    group: INPUT_GROUP.EDITORIAL,
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
      'Write the name of the entity as it is commonly known. Use the format `Entity Name Biography` e.g. `Winky D Biography` or `Harare Primary School Biography`.',
    type: 'string',
  }),
  defineField({
    name: 'subTitle',
    group: INPUT_GROUP.EDITORIAL,
    description:
      'A very short describing title e.g Zimbabwean Musician or Financial Services Company or Boarding Primary School',
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
    description: 'Optional leave empty if not known',
    type: 'number',
    hidden: ({ parent }) =>
      parent.entityType == 'person' || parent.entityType == 'day',
  }),
  defineField({
    name: 'birthDate',
    title: 'Birth Date',
    group: INPUT_GROUP.EDITORIAL,
    description: 'Optional leave empty if not known',
    type: 'date',
    hidden: ({ parent }) =>
      parent.entityType !== 'person' || parent.useBirthYearOnly,
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
    name: 'useBirthYearOnly',
    group: INPUT_GROUP.EDITORIAL,
    description:
      'Dont know the exact date? Use birth year only if known and confirmed.',
    title: 'Use Birth Year Only',
    hidden: ({ parent }) => parent.entityType !== 'person',
    type: 'boolean',
    initialValue: false,
  }),
  defineField({
    name: 'birthYear',
    title: 'Birth Year',
    group: INPUT_GROUP.EDITORIAL,
    type: 'number',
    hidden: ({ parent }) => !parent.useBirthYearOnly,
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
          'The name of the entity as it is commonly known. Use the format `About Entity Name` e.g. `About Winky D` or `About Harare Primary School`',
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
          'Start with answering the question what is [entity]. Basically say [entity] is [what you said on subtitle here] and maybe state where entity is based if length permits. Next write what is to be found in the profile article e.g in this profile are details on [entity] history, products and services/career etc.',
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
      'Check the Google Keep Notes file for guidelines. Generally for schools have location, type, headmaster then people have wife/husband, education, children then for companies have headquarters, type, CEO and so on. Information such as name, age or year founded should not be repeated here as they are already in the profile fields. This is for additional information which is not covered by the profile fields.',
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
    group: INPUT_GROUP.EDITORIAL,
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
    name: 'body',
    description:
      'Come up with an outline (outline should include titles which have search traffic) and always the entity history/background is the first title. Come up with these through keyword research) and ask AI to write a bio from that outline without sounding like it is promoting the entity. This is very crucial be sure to edit out statements which sound promotional. Paragraphs should not be too long to improve readablity. NB: Only do this in profile articles and remember to order titles correctly starting from h2.',
    group: INPUT_GROUP.EDITORIAL,
    title: 'Body',
    type: 'body',
  }),
  defineField({
    name: 'hasCanonical',
    group: INPUT_GROUP.EDITORIAL,
    description:
      'Only use when this aticle is blocking the ranking of another article',
    title: 'Originated from another article?',
    type: 'boolean',
    initialValue: false,
  }),
  defineField({
    name: 'canonical',
    group: INPUT_GROUP.EDITORIAL,
    title: 'Canonical URL',
    hidden: ({ parent }) => !parent.hasCanonical,
    type: 'url',
  }),
  defineField({
    name: 'truthScore',
    group: INPUT_GROUP.EDITORIAL,
    title: 'Truth Score Percentage',
    description: 'Do not edit this field',
    type: 'number',
    validation: (rule) => rule.min(0).max(100),
    initialValue: 10,
  }),

  // Config items for school listing

  defineField({
    name: 'level',
    type: 'string',
    group: INPUT_GROUP.CONFIG,
    hidden: ({ parent }) => parent.entityType !== 'school',
    title: 'School Level',
    options: {
      layout: 'dropdown',
      list: [
        {
          title: 'Pre-School',
          value: 'pre-school',
        },
        {
          title: 'Primary School',
          value: 'primary-school',
        },
        {
          title: 'High School',
          value: 'high-school',
        },
        {
          title: 'Tertiary Institution',
          value: 'tertiary-institution',
        },
      ],
    },
  }),

  defineField({
    name: 'oLevelSchoolType',
    type: 'string',
    group: INPUT_GROUP.CONFIG,
    hidden: ({ parent }) =>
      parent.entityType !== 'school' || parent.level !== 'high-school',
    title: 'O Level School Type',
    options: {
      layout: 'dropdown',
      list: ['Boys Boarding', 'Girls Boarding', 'Mixed Boarding', 'Day School'],
    },
  }),

  defineField({
    name: 'aLevelSchoolType',
    type: 'string',
    group: INPUT_GROUP.CONFIG,
    hidden: ({ parent }) =>
      parent.entityType !== 'school' || parent.level !== 'high-school',
    title: 'A Level School Type',
    options: {
      layout: 'dropdown',
      list: ['Boys Boarding', 'Girls Boarding', 'Mixed Boarding', 'Day School'],
    },
  }),

  defineField({
    name: 'primarySchoolType',
    type: 'string',
    group: INPUT_GROUP.CONFIG,
    hidden: ({ parent }) =>
      parent.entityType !== 'school' || parent.level !== 'primary-school',
    title: 'Primary School Type',
    options: {
      layout: 'dropdown',
      list: ['Boys Boarding', 'Girls Boarding', 'Mixed Boarding', 'Day School'],
    },
  }),

  defineField({
    name: 'location',
    group: INPUT_GROUP.CONFIG,
    description:
      'Precise City Name / Town Name / Village Name where the school is located. Do not use Province or District Names here.',
    title: 'Location',
    type: 'string',
    validation: (Rule) =>
      Rule.max(20).warning(
        'Longer Locations may disorient structure of the page',
      ),
  }),

  defineField({
    name: 'province',
    type: 'string',
    group: INPUT_GROUP.CONFIG,
    title: 'Province',
    options: {
      layout: 'dropdown',
      list: [
        'Harare',
        'Bulawayo',
        'Manicaland',
        'Mashonaland East',
        'Mashonaland West',
        'Masvingo',
        'Midlands',
        'Matabeleland North',
        'Matabeleland South',
        'Mashonaland Central',
      ],
    },
  }),

  defineField({
    name: 'churchAffiliation',
    type: 'string',
    group: INPUT_GROUP.CONFIG,
    title: 'Church Affiliation',
    options: {
      layout: 'dropdown',
      list: [
        'Anglican',
        'Catholic',
        'Dutch',
        'Methodist',
        'Pentecostal',
        'Presbyterian',
        'Seventh-day',
      ],
    },
  }),

  defineField({
    name: 'feesHistory',
    type: 'array',
    group: INPUT_GROUP.CONFIG,
    title: 'Fees History',
    of: [
      {
        type: 'object',
        fields: [
          {
            name: 'amount',
            type: 'number',
            title: 'School Fees Amount',
            validation: (Rule) => Rule.min(0).warning('Fees must be positive'),
          },
          {
            name: 'notes',
            type: 'string',
            title: 'School Fees Notes',
          },
        ],
      },
    ],
  }),

  defineField({
    name: 'employmentRatesHistory',
    type: 'array',
    group: INPUT_GROUP.CONFIG,
    title: 'Tertiary Insitution Employment Rates',
    hidden: ({ parent }) => parent.level !== 'primary-school',
    of: [
      {
        type: 'object',
        fields: [
          {
            name: 'year',
            title: 'Year',
            type: 'number',
            validation: (Rule) => Rule.min(2000).max(new Date().getFullYear()),
          },
          {
            name: 'employmentRate',
            title: 'Employment Rate',
            type: 'number',
            validation: (Rule) => Rule.min(0).max(100),
          },
        ],
        preview: {
          select: {
            year: 'year',
            employmentRate: 'employmentRate',
          },
          prepare({ year, employmentRate }) {
            return {
              title: `Year: ${year}, Employment Rate: ${employmentRate}%`,
            };
          },
        },
      },
    ],
  }),

  defineField({
    name: 'primarySchoolPassRates',
    type: 'array',
    group: INPUT_GROUP.CONFIG,
    title: 'Primary School Pass Rates',
    hidden: ({ parent }) => parent.level !== 'primary-school',
    of: [
      {
        type: 'object',
        fields: [
          {
            name: 'year',
            title: 'Year',
            type: 'number',
            validation: (Rule) => Rule.min(2000).max(new Date().getFullYear()),
          },
          {
            name: 'passRate',
            title: 'Pass Rate',
            type: 'number',
            validation: (Rule) => Rule.min(0).max(100),
          },
        ],
        preview: {
          select: {
            year: 'year',
            passRate: 'passRate',
          },
          prepare({ year, passRate }) {
            return {
              title: `Year: ${year}, Pass Rate: ${passRate}%`,
            };
          },
        },
      },
    ],
  }),

  defineField({
    name: 'oLevelSchoolPassRates',
    type: 'array',
    group: INPUT_GROUP.CONFIG,
    title: 'O Level School Pass Rates',
    hidden: ({ parent }) => parent.level !== 'high-school',
    of: [
      {
        type: 'object',
        fields: [
          {
            name: 'year',
            title: 'Year',
            type: 'number',
            validation: (Rule) => Rule.min(2000).max(new Date().getFullYear()),
          },
          {
            name: 'passRate',
            title: 'Pass Rate',
            type: 'number',
            validation: (Rule) => Rule.min(0).max(100),
          },
        ],
        preview: {
          select: {
            year: 'year',
            passRate: 'passRate',
          },
          prepare({ year, passRate }) {
            return {
              title: `Year: ${year}, Pass Rate: ${passRate}%`,
            };
          },
        },
      },
    ],
  }),

  defineField({
    name: 'aLevelSchoolPassRates',
    type: 'array',
    group: INPUT_GROUP.CONFIG,
    title: 'A Level School Pass Rates',
    hidden: ({ parent }) => parent.level !== 'high-school',
    of: [
      {
        type: 'object',
        fields: [
          {
            name: 'year',
            title: 'Year',
            type: 'number',
            validation: (Rule) => Rule.min(2000).max(new Date().getFullYear()),
          },
          {
            name: 'passRate',
            title: 'Pass Rate',
            type: 'number',
            validation: (Rule) => Rule.min(0).max(100),
          },
        ],
        preview: {
          select: {
            year: 'year',
            passRate: 'passRate',
          },
          prepare({ year, passRate }) {
            return {
              title: `Year: ${year}, Pass Rate: ${passRate}%`,
            };
          },
        },
      },
    ],
  }),

  defineField({
    name: 'contacts',
    type: 'array',
    group: INPUT_GROUP.CONFIG,
    title: 'Contacts',
    description:
      'Contacts of the entity. Use the format: { name: "Contact Name", phone: "+263123456789", role: "Role of Contact" }',
    of: [
      {
        type: 'object',
        fields: [
          {
            name: 'name',
            title: 'Contact Name',
            type: 'string',
          },
          {
            name: 'phone',
            title: 'Phone Number',
            type: 'string',
            validation: (Rule) =>
              Rule.regex(
                /^\+263\d+$/,
                'Phone number must be in the format +263XXXXXXXXX',
              ),
          },
          {
            name: 'role',
            title: 'Role',
            type: 'string',
            options: {
              list: ['Landline Number', 'Cell Number', 'WhatsApp Number'],
            },
          },
        ],
        preview: {
          select: {
            name: 'name',
            phone: 'phone',
            role: 'role',
          },
          prepare({ name, phone, role }) {
            return {
              title: `${name} (${role})`,
              subtitle: phone,
              media: DatabaseIcon,
            };
          },
        },
      },
    ],
  }),
];
