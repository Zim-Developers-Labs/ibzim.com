import {
  definePlugin,
  DocumentActionComponent,
  DocumentActionsResolver,
  NewDocumentOptionsResolver,
} from "sanity";
import { LOCKED_DOCUMENT_TYPES } from "../constants";

export const resolveDocumentActions: DocumentActionsResolver = (
  prev,
  { schemaType }
) => {
  if (LOCKED_DOCUMENT_TYPES.includes(schemaType)) {
    prev = prev.filter(
      (previousAction: DocumentActionComponent) =>
        previousAction.action === "publish" ||
        previousAction.action === "discardChanges"
    );
  }

  return prev;
};

export const resolveNewDocumentOptions: NewDocumentOptionsResolver = (prev) => {
  const options = prev.filter((previousOption) => {
    return !LOCKED_DOCUMENT_TYPES.includes(previousOption.templateId);
  });

  return options;
};

export const customDocumentActions = definePlugin({
  name: "custom-document-actions",
  document: {
    actions: resolveDocumentActions,
    newDocumentOptions: resolveNewDocumentOptions,
  },
});
