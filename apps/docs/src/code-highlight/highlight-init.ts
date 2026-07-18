// Parse-time syntax-highlight registration — same trick as THEME_INIT_SCRIPT
// (theme.ts): the only way to paint token colors on a block's first frame is
// a blocking inline script that runs while the HTML streams in, long before
// hydration. This head script defines `__shReg`; each CodeBlock's SSR markup
// ends with `<script>self.__shReg&&__shReg(document.currentScript)</script>`,
// so registration happens the moment that block's text nodes are parsed.
//
// It reads the block's `data-sh` attribute ({ n: highlight names by styleId,
// r: [start, end, styleId] token ranges at absolute offsets } — emitted by
// remark-code-highlight.ts), builds Ranges over the block's single `<code>`
// text node, registers them in the document-global CSS.highlights registry,
// and stashes the additions on the figure (`__sh`) so the component's onMount
// can adopt them for cleanup instead of re-registering (code-block.tsx). Inert
// when the API is missing; per-block scripts never execute on client-side
// navigations (framework-inserted scripts don't run), where onMount registers
// instead. Keep hand-minified.
export const HIGHLIGHT_INIT_SCRIPT = `(()=>{try{if(!self.Highlight||!CSS.highlights)return;self.__shReg=function(s){try{var f=s.parentElement,d=JSON.parse(f.getAttribute("data-sh")),c=f.querySelector("code"),t=c&&c.firstChild,A=[];if(t)for(var j=0;j<d.r.length;j++){var x=d.r[j],n=d.n[x[2]],h=CSS.highlights.get(n);h||(h=new Highlight,CSS.highlights.set(n,h));var r=new Range;r.setStart(t,x[0]);r.setEnd(t,x[1]);h.add(r);A.push([n,h,r])}f.__sh=A}catch(_){}}}catch(_){}})()`

// The [name, registry entry, range] tuples a registration produces — shared
// shape between the inline script's stash and the component's own bookkeeping.
export type HighlightAdditions = [string, Highlight, Range][]
