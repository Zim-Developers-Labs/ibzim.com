import defineStructure from "../utils/defineStructure";
import { DocumentsIcon } from "@sanity/icons";

export default defineStructure<any>((S) =>
  S.listItem()
    .title("Press Releases")
    .icon(DocumentsIcon)
    .child(
      S.documentTypeList("press.article")
        .title("Press Release")
        .child((id) => S.document().schemaType("press.article").documentId(id))
    )
);
