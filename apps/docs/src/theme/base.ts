// Prefix a root-absolute path with the deploy base (vite `base`, e.g.
// "/heroui-solid/" on GitHub Pages). Router <A> links resolve against the
// Router base automatically — this is only for plain <a>/Link hrefs.
export const withBase = (path: string) =>
  import.meta.env.BASE_URL.replace(/\/$/, "") + path
