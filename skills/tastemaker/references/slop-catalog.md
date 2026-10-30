# Slop Catalog

AI slop is output that is statistically likely but means nothing for this product. Each entry has an ID used by `tastemaker scan`, the hook and review comments. **Auto** = detected by `taste-guard/scripts/slop-scan.mjs`; **Review** = checked by `taste-guard` / `taste-audit` and the `taste-critic` agent by reading.

Severity: **error** blocks delivery · **warn** needs a reason to keep · **info** taste nudge.

Suppress a finding only with a reason: `// taste-ignore V01 brand gradient approved in brand-guidelines.md` on the same or previous line.

## V: Visual

| ID | Pattern | Sev | Detect | Fix |
|---|---|---|---|---|
| V01 | Default "AI gradient" (indigo/violet/purple to pink/blue/cyan) on heroes, buttons, cards | warn | Auto | Solid brand surface; one accent; gradients only if `brand-guidelines.md` defines them |
| V02 | Gradient-clipped heading text | warn | Auto | Solid `text-foreground`; emphasise with weight, size or a single accent word |
| V03 | Glass on resting surfaces (`backdrop-blur` cards) | warn | Auto | Blur only sticky headers and overlays, with solid fallback |
| V04 | Floating blurred blobs / orbs behind content | warn | Auto | Remove; use layout, type and real imagery for interest |
| V05 | `shadow-2xl` / `rounded-3xl` on ordinary cards | info | Auto | Border first; shadow only for overlays; radius from the token family |
| V06 | `hover:scale-105` on cards and buttons | warn | Auto | Color/border/elevation change; scale only for media thumbnails |
| V07 | Emoji as icons, bullets or decoration | error | Auto | Lucide or inline SVG with `aria-hidden` and a text label |
| V08 | Raw hex/rgb/hsl in components (`bg-[#7c3aed]`, `style={{color:'#333'}}`) | error | Auto | Semantic token class (`bg-primary`, `text-muted-foreground`) |
| V09 | Neon glow shadows | warn | Auto | Remove, or reserve for a single focus/status use defined in tokens |
| V10 | Sparkles icon to mean "AI" | warn | Auto | Name the actual capability ("Summarize", "Draft reply") with a functional icon |
| V11 | Decorative `animate-bounce` / `animate-pulse` outside loaders | warn | Auto | Motion only for feedback, orientation or continuity |
| V12 | Palette classes in components (`bg-gray-900`, `text-slate-500`) instead of semantic tokens | warn | Auto | `bg-background`, `bg-muted`, `text-muted-foreground`, `border-border` |
| V13 | More than 3 radius values in one file | info | Auto | Pick one radius family: sm for inputs, md for cards, full for pills |
| V14 | Everything centered | info | Auto | Left-align reading content; center only short hero statements |
| V15 | Three identical feature cards with an icon-in-a-circle | warn | Review | Vary by importance: one lead feature, supporting rows, real screenshots |
| V16 | Default dot-grid / noise / radial-glow backgrounds | info | Auto | Plain surface; texture only as a deliberate brand element |
| V17 | Stock "dashboard" with four KPI cards, one area chart, one table, regardless of domain | warn | Review | Derive the layout from the user's top 3 questions (taste-direction) |
| V18 | Dark mode as afterthought (`dark:` overrides sprinkled per element) | warn | Review | Theme through semantic tokens; components carry no `dark:` color classes |

## C: Copy

| ID | Pattern | Sev | Detect | Fix |
|---|---|---|---|---|
| C01 | Hype words: unlock, supercharge, elevate, seamless, revolutionize, effortless, cutting-edge, game-changer, next-level, unleash, empower, world-class, state-of-the-art, "harness the power" | warn | Auto | State the concrete outcome with a number or noun ("Close the books in 2 days") |
| C02 | Placeholder content: lorem ipsum, John/Jane Doe, "Your Company", "Product Name" | error | Auto | Domain-true names and copy; seeded fake data that looks real for the domain |
| C03 | Invented social proof: "10k+ happy users", "Trusted by", "99.9% uptime", star ratings | warn | Auto | Only with real, supplied data; otherwise remove the section |
| C04 | Generic CTAs: "Get Started", "Learn More", "Click here", "Submit" | warn | Auto | Verb + object: "Create invoice", "Compare plans", "Book a demo" |
| C05 | "Welcome to <Product>" hero headline | warn | Auto | Lead with the benefit for this audience |
| C06 | Exclamation marks in interface strings | info | Auto | Calm, specific tone; celebrate only real milestones |
| C07 | Headline that any competitor could use unchanged | warn | Review | Add specifics: audience, number, mechanism |
| C08 | Title Case On Every Button And Label | info | Review | Sentence case |

## U: UX and accessibility

| ID | Pattern | Sev | Detect | Fix |
|---|---|---|---|---|
| U01 | Icon-only button with no accessible name | error | Auto | `aria-label` plus `Tooltip` |
| U02 | Clickable `div`/`span` | error | Auto | `<button>` or `<a href>`; Radix `Slot` for polymorphism |
| U03 | `outline-none` without a `focus-visible` replacement | error | Auto | `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` |
| U04 | Placeholder used as the only label | warn | Auto | Visible `<Label>` above input; placeholder shows format only |
| U05 | Zoom disabled in viewport meta | error | Auto | `width=device-width, initial-scale=1` only |
| U06 | `h-screen` / `100vh` for full-height layouts | warn | Auto | `min-h-dvh` / `100dvh` |
| U07 | `alert()` / `confirm()` / `prompt()` | error | Auto | Toast for info, `AlertDialog` for decisions |
| U08 | `<img>` without `alt` | error | Auto | Meaningful alt, or `alt=""` for decorative |
| U09 | Autoplay media without `muted` | warn | Auto | `muted playsInline`, user-controlled play |
| U10 | Missing loading, empty, error or permission state | error | Review | Fill the guard state matrix |
| U11 | Text under 12px (`text-[10px]`, `text-[11px]`) | warn | Auto | Minimum 12px for meta, 14-16px for body |
| U12 | `target="_blank"` without `rel` | warn | Auto | `rel="noopener noreferrer"` and an external-link cue |
| U13 | Positive `tabIndex` | error | Auto | DOM order; `tabIndex={0}` or `-1` only |
| U14 | Modal for non-blocking info, toast for errors that need action | warn | Review | Toast = transient success; inline alert = persistent; dialog = blocking decision |
| U15 | Color-only status (red/green dot with no label) | error | Review | Color + icon + text |

## E: Engineering

| ID | Pattern | Sev | Detect | Fix |
|---|---|---|---|---|
| E01 | `TODO`, `FIXME`, "rest of code", "implement later" | error | Auto | Implement now or cut scope and say so in wire-up notes |
| E02 | Empty handlers `() => {}`, `href="#"` | error / warn | Auto | Real handler, or disable the control with a reason |
| E03 | `console.log` left in UI code | warn | Auto | Remove, or route through a logger |
| E04 | `any` types | warn | Auto | Type from the data contract |
| E05 | `!important` outside token/global files | warn | Auto | Fix specificity or use `cn()` merging |
| E06 | z-index ladders (`z-[9999]`) | warn | Auto | Token z-scale: sticky 10, dropdown 20, overlay 30, modal 40, toast 50 |
| E07 | `key={index}` on dynamic lists | warn | Auto | Stable IDs |
| E08 | Placeholder image services (placeholder.com, picsum, placehold.co, source.unsplash) | error | Auto | Local assets, generated SVG, or neutral skeleton with aspect ratio |
| E09 | Inline style literals for color/spacing | warn | Auto | Token classes or CSS variables |
| E10 | `Math.random()` / `Date.now()` in render | warn | Auto | Seeded generator outside render (hydration-safe) |
| E11 | More than one icon library | warn | Auto | One library (Lucide default) |
| E12 | Mixed component kits (MUI/Ant/Chakra/Bootstrap with shadcn) | error | Auto | One kit per project |
| E13 | Tailwind syntax for the wrong major version | error | Auto (project) | v4: `@import "tailwindcss"` + `@theme`; v3: `@tailwind` + config |
| E14 | `dangerouslySetInnerHTML` | warn | Auto | Render as text or sanitise with a vetted library |
| E15 | Files over 400 lines | info | Auto | Split into organisms |
