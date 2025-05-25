import defineStructure from "../utils/defineStructure";
import { ControlsIcon } from "@sanity/icons";

export default defineStructure<any>((S) =>
  S.listItem()
    .title("Policies")
    .icon(ControlsIcon)
    .child(
      S.documentTypeList("policy")
        .title("Policy")
        .child((id) => S.document().schemaType("policy").documentId(id))
    )
);
