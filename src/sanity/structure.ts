import type { StructureResolver } from 'sanity/structure'
import { pageTypes, productTypes } from './schemaTypes'

// Sidebar title for each "Páginas web" singleton (defaults to the schema title).
const pageTitles: Record<string, string> = {
  siteSettings: 'Textos globales (menú, pie, banner)',
  centroInfo: 'Inicio (información del centro)',
  divesPage: 'Inmersiones',
  baptismsPage: 'Bautizos',
  coursesPage: 'Cursos',
  ratesPage: 'Tarifas',
  sidemountPage: 'Sidemount',
  galleryPage: 'Galería',
  contactPage: 'Contacto',
}

// Two clearly separated areas:
//  - "Páginas web": the texts of each page, one singleton document per page
//    (document _id === type name, so there is never a second copy).
//  - "Productos": the catalogue that the pages list (courses, dives, …).
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.listItem()
        .title('Páginas web')
        .child(
          S.list()
            .title('Páginas web')
            .items(
              pageTypes.map((type) =>
                S.listItem()
                  .title(pageTitles[type.name] ?? type.title ?? type.name)
                  .id(type.name)
                  .child(S.document().schemaType(type.name).documentId(type.name)),
              ),
            ),
        ),
      S.divider(),
      S.listItem()
        .title('Productos')
        .child(
          S.list()
            .title('Productos')
            .items(productTypes.map((type) => S.documentTypeListItem(type.name))),
        ),
    ])
