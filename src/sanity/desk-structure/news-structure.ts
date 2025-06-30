import { DocumentsIcon } from '@sanity/icons';
import defineStructure from '../utils/defineStructure';

export default defineStructure<any>((S) =>
  S.listItem()
    .title('News')
    .icon(DocumentsIcon)
    .child(
      S.list()
        .title('News')
        .items([
          S.listItem()
            .title('News (Zimbabwe)')
            .icon(DocumentsIcon)
            .child(
              S.documentTypeList('zw.news')
                .title('Zimbabwe News')
                .child((id) =>
                  S.document().schemaType('zw.news').documentId(id),
                ),
            ),
        ]),
    ),
);
