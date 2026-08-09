import type { LayoutProps } from 'sanity'

// Sanity wraps every object-type field (localeText, localeString, arrays, …) in a
// <fieldset><legend>, while leaf fields (a plain string/number input) use a <label>.
// Both render at the same font size by default, which makes section titles like
// "Introducción" read the same size as the field labels nested inside them (e.g.
// "Español"). Bump the legend size/weight so it sits between field labels and the
// document title.
export function StudioLayout(props: LayoutProps) {
  return (
    <>
      <style>{`
        legend [data-ui="Text"] {
          font-size: 25px;
          font-weight: 600;
        }
      `}</style>
      {props.renderDefault(props)}
    </>
  )
}
