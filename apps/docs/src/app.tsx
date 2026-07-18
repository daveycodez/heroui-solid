import { Router } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import "./app.css"
import "./tailwind.css"
import "./solidbase-styles"
import { SolidBaseRoot } from "@kobalte/solidbase/client"

export default function App() {
  return (
    <Router
      base={import.meta.env.BASE_URL.replace(/\/$/, "")}
      root={SolidBaseRoot}
    >
      <FileRoutes />
    </Router>
  )
}
