import { Router, type RouteSectionProps } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import "./app.css"
import "./solidbase-styles"
import { SolidBaseRoot } from "@kobalte/solidbase/client"
import { Suspense } from "solid-js"

// /demos/* pages render bare (no docs chrome) so they can be embedded
// as iframes inside MDX pages.
function Root(props: RouteSectionProps) {
  if (props.location.pathname.startsWith("/demos")) {
    return <Suspense>{props.children}</Suspense>
  }
  return <SolidBaseRoot {...props} />
}

export default function App() {
  return (
    <Router root={Root}>
      <FileRoutes />
    </Router>
  )
}
