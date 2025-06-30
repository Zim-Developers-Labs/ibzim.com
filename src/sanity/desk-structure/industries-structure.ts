import defineStructure from "../utils/defineStructure";
import { FolderIcon } from "@sanity/icons";

export default defineStructure<any>((S) =>
  S.listItem()
    .title("Article Industries")
    .icon(FolderIcon)
    .child(
      S.documentTypeList("article.industry")
        .title("Industry")
        .child((id) =>
          S.document().schemaType("article.industry").documentId(id)
        )
    )
);
