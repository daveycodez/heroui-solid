// Parse-time syntax-highlight registration — same trick as THEME_INIT_SCRIPT
// (theme.ts): the only way to paint token colors on a block's first frame is
// a blocking inline script that runs while the HTML streams in, long before
// hydration. This head script defines `__shReg`; each CodeBlock's SSR markup
// ends with `<script>self.__shReg&&__shReg(document.currentScript)</script>`,
// so registration happens the moment that block's text nodes are parsed.
//
// It reads the block's `data-sh` attribute ({ n: highlight names by styleId,
// l: per-line [start, end, styleId] spans } — emitted by
// remark-code-highlight.ts), builds Ranges over the `.line-content` text
// nodes, registers them in the document-global CSS.highlights registry, and
// stashes the additions on the figure (`__sh`) so the component's onMount can
// adopt them for cleanup instead of re-registering (code-block.tsx). Inert
// when the API is missing; per-block scripts never execute on client-side
// navigations (framework-inserted scripts don't run), where onMount registers
// instead. Keep hand-minified.
export const HIGHLIGHT_INIT_SCRIPT = `(()=>{try{if(!self.Highlight||!CSS.highlights)return;self.__shReg=function(s){try{var f=s.parentElement,d=JSON.parse(f.getAttribute("data-sh")),c=f.querySelectorAll(".line-content"),A=[];d.l.forEach(function(L,i){var t=c[i]&&c[i].firstChild;if(t)for(var j=0;j<L.length;j++){var x=L[j],n=d.n[x[2]],h=CSS.highlights.get(n);h||(h=new Highlight,CSS.highlights.set(n,h));var r=new Range;r.setStart(t,x[0]);r.setEnd(t,x[1]);h.add(r);A.push([n,h,r])}});f.__sh=A}catch(_){}}}catch(_){}})()`

// The [name, registry entry, range] tuples a registration produces — shared
// shape between the inline script's stash and the component's own bookkeeping.
export type HighlightAdditions = [string, Highlight, Range][]
