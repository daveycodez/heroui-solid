// Components exported here are registered globally for all MDX pages via
// solidbase's theme `mdx-components` convention. Do NOT `import` components
// inside .mdx files — per-file MDX imports break SSR/hydration under
// @solidjs/start 2.0.0-beta.0 + vite 8 (empty suspense placeholders server-side,
// then a fatal Hydration Mismatch on the client).

// Embeds a /demos/* route (rendered without docs chrome — see app.tsx Root).
export function Demo(props: { path: string; height?: string }) {
  return (
    <iframe
      src={`/demos/${props.path}`}
      title={`Demo: ${props.path}`}
      loading="lazy"
      style={{
        width: "100%",
        height: props.height ?? "160px",
        border: "1px solid rgba(128, 128, 128, 0.25)",
        "border-radius": "12px",
        "background-color": "transparent"
      }}
    />
  )
}
