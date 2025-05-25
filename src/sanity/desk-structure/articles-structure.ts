import { DocumentsIcon } from '@sanity/icons';
import defineStructure from '../utils/defineStructure';

export default defineStructure<any>((S) =>
  S.listItem()
    .title('Articles')
    .icon(DocumentsIcon)
    .child(
      S.documentTypeList('article')
        .title('Article')
        .child((id) => S.document().schemaType('article').documentId(id)),
    ),
);
