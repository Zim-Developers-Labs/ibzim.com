import defineStructure from '../utils/defineStructure';
import { HomeIcon } from '@sanity/icons';

export default defineStructure<any>((S) =>
  S.listItem()
    .title('Home')
    .icon(HomeIcon)
    .child(
      S.editor().title('Home (Zimbabwe)').schemaType('home').documentId('home'),
    ),
);
