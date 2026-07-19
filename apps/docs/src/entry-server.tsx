// @refresh reload

import { getFontPreloadLinkAttrs } from "@kobalte/solidbase/default-theme/fonts.js"
import { getHtmlProps } from "@kobalte/solidbase/server"
import { createHandler, StartServer } from "@solidjs/start/server"
import { For } from "solid-js"
import { HIGHLIGHT_INIT_SCRIPT } from "./code-highlight/highlight-init"
import { THEME_INIT_SCRIPT } from "./theme/theme"

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      // `data-theme="light"` is the no-JS fallback (this is a static site so the
      // server can't know the OS preference); THEME_INIT_SCRIPT overwrites it to
      // the resolved exact theme before first paint. Spread getHtmlProps last so
      // its lang wins but our explicit data-theme replaces solidbase's sdark bug.
      <html {...getHtmlProps()} data-theme="light">
        <head>
          {/* Must be the first <head> child — runs before assets paint, so the
              first frame is already the correct theme. See theme/theme.ts. */}
          <script innerHTML={THEME_INIT_SCRIPT} />
          {/* Defines the parse-time code-highlight registrar each CodeBlock's
              trailing inline script calls — colors paint as blocks stream in,
              not at hydration. See code-highlight/highlight-init.ts. */}
          <script innerHTML={HIGHLIGHT_INIT_SCRIPT} />
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href={`${import.meta.env.BASE_URL}favicon.ico`} />
          {/* Preload the theme fonts so text doesn't flash in a fallback font
              while the @fontsource stylesheets load. */}
          <For each={getFontPreloadLinkAttrs()}>
            {(attrs) => <link {...attrs} />}
          </For>
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
))
