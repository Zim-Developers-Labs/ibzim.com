import defineStructure from "../utils/defineStructure";
import { UsersIcon } from "@sanity/icons";

export default defineStructure<any>((S) =>
  S.listItem()
    .title("Authors")
    .icon(UsersIcon)
    .child(
      S.documentTypeList("author")
        .title("Author")
        .child((id) => S.document().schemaType("author").documentId(id))
    )
);
