import { UserIcon } from '@sanity/icons';
import { defineType } from 'sanity';
import { ProfileFields } from './index';
import { INPUT_GROUP, INPUT_GROUPS } from '@/sanity/constants';
import { defineField } from 'sanity';

export default defineType({
  name: 'profile',
  groups: INPUT_GROUPS,
  title: 'Profile',
  icon: UserIcon,
  type: 'document',
  fields: [
    ...ProfileFields,
    defineField({
      name: 'relatedProfiles',
      // description:
      //   "This is important for seo (internal linking) to avoid orphaned pages. Besides placing the page in a very specifically related series of articles set where you want to place links to this this article",
      title: 'Related Profiles',
      type: 'array',
      group: INPUT_GROUP.SEO,
      of: [
        {
          type: 'reference',
          to: [{ type: 'profile' }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'entityType',
      media: 'picture',
    },
    prepare({ title, media, subtitle }) {
      return { title, subtitle, media };
    },
  },
});
