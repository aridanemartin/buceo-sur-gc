import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.listItem()
        .title('Información del centro / general')
        .child(S.document().schemaType('centroInfo').documentId('centroInfo')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== 'centroInfo' && item.getId() !== 'sidemountCourse',
      ),
      S.listItem()
        .title('Cursos Sidemount')
        .child(S.documentTypeList({ title: 'Cursos Sidemount', schemaType: 'sidemountCourse' })),
    ])
