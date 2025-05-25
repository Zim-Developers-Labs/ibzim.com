import defineStructure from '../utils/defineStructure';
import { UsersIcon } from '@sanity/icons';

export default defineStructure<any>((S) =>
  S.listItem()
    .title('Profiles (Wiki)')
    .icon(UsersIcon)
    .child(
      S.documentTypeList('profile')
        .title('Profile')
        .child((id) => S.document().schemaType('profile').documentId(id)),
    ),
);
