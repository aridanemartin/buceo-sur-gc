// Wraps the built-in "delete" action for certifyingAgency documents: disables
// it while any published course still references the document, so editors
// can't orphan a course's agency reference by deleting it out from under it.
import { useEffect, useState } from 'react'
import {
  getPublishedId,
  useClient,
  type DocumentActionComponent,
  type DocumentActionProps,
} from 'sanity'

const API_VERSION = '2024-01-01'

export function createProtectedDeleteAction(
  originalAction: DocumentActionComponent,
): DocumentActionComponent {
  return function ProtectedDeleteAction(props: DocumentActionProps) {
    const client = useClient({ apiVersion: API_VERSION })
    const [publishedCourseCount, setPublishedCourseCount] = useState<number | null>(null)
    const publishedId = getPublishedId(props.id)

    useEffect(() => {
      let cancelled = false
      setPublishedCourseCount(null)
      client
        .fetch<number>(
          `count(*[_type == "course" && !(_id in path("drafts.**")) && references($id)])`,
          { id: publishedId },
        )
        .then((count) => {
          if (!cancelled) setPublishedCourseCount(count)
        })
      return () => {
        cancelled = true
      }
    }, [client, publishedId])

    const original = originalAction(props)
    if (!original) return original

    if (publishedCourseCount === null) {
      return { ...original, disabled: true, title: 'Comprobando cursos que usan esta entidad…' }
    }

    if (publishedCourseCount > 0) {
      const plural = publishedCourseCount === 1 ? '' : 's'
      return {
        ...original,
        disabled: true,
        title: `No se puede eliminar: usada por ${publishedCourseCount} curso${plural} publicado${plural}.`,
      }
    }

    return original
  }
}
