import defineStructure from "../utils/defineStructure";
import { RocketIcon } from "@sanity/icons";

export default defineStructure<any>((S) =>
  S.listItem()
    .title("Article Series")
    .icon(RocketIcon)
    .child(
      S.documentTypeList("article.series")
        .title("Series")
        .child((id) => S.document().schemaType("article.series").documentId(id))
    )
);
