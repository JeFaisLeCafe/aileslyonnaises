import type { DocumentActionComponent, DocumentActionsContext } from "sanity";
import type { StructureBuilder, StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["siteSettings"]);

const personList = (builder: StructureBuilder, title: string, filter: string) =>
  builder
    .listItem()
    .title(title)
    .schemaType("person")
    .child(
      builder.documentList().title(title).filter(filter).schemaType("person"),
    );

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
      builder.documentTypeListItem("newsArticle").title("Actualités"),
      builder.documentTypeListItem("story").title("Récits intemporels"),
      builder.divider(),
      personList(
        builder,
        "Équipe pédagogique",
        '_type == "person" && count((roles)[@ in ["instructor", "chiefInstructor"]]) > 0',
      ),
      personList(
        builder,
        "Bureau",
        '_type == "person" && count((roles)[@ in ["president", "vicePresident", "treasurer", "secretary"]]) > 0',
      ),
      personList(
        builder,
        "Conseil d’administration",
        '_type == "person" && count((roles)[@ in ["boardMember"]]) > 0',
      ),
      builder.documentTypeListItem("person").title("Toutes les personnes"),
      builder.divider(),
      builder.documentTypeListItem("priceGroup").title("Tarifs"),
      builder.documentTypeListItem("trainingProgram").title("Formations"),
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
