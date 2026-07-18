/**
 * Folds the code fence that follows every `<ComponentPreview name="..." />`
 * into the element itself (as its only child), so the component can render
 * the demo and its source as one unit — the official HeroUI docs layout
 * (preview card with a collapsed, expandable code block attached below).
 *
 * MDX pages keep the official authoring shape (self-closing element, then a
 * ```tsx file=... fence); this runs after solidbase's import-code-file pass
 * (user remark plugins run last) and before remark-code-highlight, which
 * consumes the injected `showLineNumbers` and visits code nodes wherever
 * they sit in the tree. Same programmatic mdxJsxFlowElement-children
 * technique as solidbase's own remark plugins (code-tabs, preview) — safe
 * for hydration, unlike hand-authored JSX children in MDX (see
 * mdx-components.tsx).
 *
 * Dependency-free walk: unist-util-visit isn't hoisted where this config
 * runs under bun's isolated linker.
 */

interface Node {
  type: string
  name?: string
  meta?: string
  children?: Node[]
}

function walk(node: Node) {
  const children = node.children
  if (!children) {
    return
  }
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (
      child.type === "mdxJsxFlowElement" &&
      child.name === "ComponentPreview" &&
      (child.children?.length ?? 0) === 0 &&
      children[i + 1]?.type === "code"
    ) {
      const code = children[i + 1]
      // Demo source blocks show line numbers, like the official docs.
      code.meta = `${code.meta ?? ""} showLineNumbers`
      child.children = [code]
      children.splice(i + 1, 1)
    }
    walk(child)
  }
}

export function remarkComponentPreviewCode() {
  return (tree: Node) => {
    walk(tree)
  }
}
