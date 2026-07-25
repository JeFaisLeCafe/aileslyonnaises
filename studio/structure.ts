import type { DocumentActionComponent, DocumentActionsContext } from "sanity";
import type { StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["siteSettings"]);

export const structure: StructureResolver = (builder) =>
  builder
    .list()
    .title("Les Ailes Lyonnaises")
    .items([
      builder
        .listItem()
        .title("Coordonnées du site")
        .child(
          builder
            .document()
            .schemaType("siteSettings")
            .documentId("siteSettings"),
        ),
      builder.divider(),
      builder.documentTypeListItem("aircraft").title("Flotte"),
      builder.documentTypeListItem("person").title("Équipe et gouvernance"),
      builder.documentTypeListItem("priceGroup").title("Tarifs"),
      builder.documentTypeListItem("trainingProgram").title("Formations"),
      builder.documentTypeListItem("story").title("Récits intemporels"),
    ]);

export const singletonDocumentActions = (
  previousActions: DocumentActionComponent[],
  context: DocumentActionsContext,
) =>
  singletonTypes.has(context.schemaType)
    ? previousActions.filter(
        ({ action }) => action === "publish" || action === "discardChanges",
      )
    : previousActions;
