# Stack Adapters and Compatibility

## Detect first (silently)

Read `package.json`, lockfile, `components.json`, `tsconfig.json`, `vite.config.*`, `next.config.*`, CSS entry. Record: framework + major, router, Tailwind major, component kit, icon library, motion library, path alias. Never add a second kit, icon set or CSS strategy.

## Compatibility matrix

| Concern | Rule |
|---|---|
| Tailwind v4 | CSS-first: `@import "tailwindcss";`, tokens in `@theme` / `@theme inline`, dark via `@custom-variant dark (&:where(.dark, .dark *));`. No `tailwind.config.js` unless the project already has one. Vite uses `@tailwindcss/vite` |
| Tailwind v3 | `@tailwind base; @tailwind components; @tailwind utilities;`, tokens in `tailwind.config` `theme.extend` as `hsl(var(--x) / <alpha-value>)`, `darkMode: 'class'` |
| shadcn/ui | Respect `components.json` (style, baseColor, cssVariables, aliases). v4 projects use OKLCH variables; v3 projects use HSL triplets. Add components with the CLI; edit generated files only to wire tokens |
| React 19 | `ref` is a regular prop for function components; `forwardRef` still works for older shadcn files. Do not mix patterns inside one component |
| Next.js App Router | Server Components default; `'use client'` on interactive leaves only; serializable props; data in server components or `app/api/*/route.ts`; `next/font` for fonts; `suppressHydrationWarning` on `<html>` with `next-themes` |
| Vite + React | `react-router`; data via `services/*.ts`; `import.meta.env.VITE_*` only for public config |
| Vue / Nuxt | `<script setup lang="ts">`; shadcn-vue or Nuxt UI, not both; `useColorMode` for theme |
| Svelte / SvelteKit | Runes in Svelte 5 (`$state`, `$props`); shadcn-svelte or bits-ui |
| Astro | Static by default; islands (`client:visible`) only for interactive parts |
| Node / Express | Static UI in `public/`; `fetch('/api/...')` mapped 1:1 to endpoints listed in the manifest |
| Icons | Lucide in every framework variant (`lucide-react`, `lucide-vue-next`, `lucide-svelte`); inline SVG in Portable Mode |
| Charts | shadcn Chart (Recharts) in React; Chart.js in plain HTML and slides; inline SVG in Portable Mode |
| Motion | CSS transitions first; `motion` (Framer Motion) only if already present or needed for exit/layout animation |

## Portable Mode (.NET Razor, Spring/Thymeleaf, Django, Rails, air-gapped)

Plain semantic HTML + precompiled Tailwind CSS (or the generated `tokens.css`); vanilla ES modules or Web Components; inline SVG icons; system font stack `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`; no CDN; no runtime bundler; CSP-safe (no `eval`, no inline handler attributes, nonce for any inline script); CSRF token slot in every form; fragments pasteable into `.cshtml` / Thymeleaf / Jinja. Behaviour: `<dialog>` for modals, `aria-expanded` + roving focus for menus, `role="tablist"` for tabs, `role="status"` for toasts.

## Backend touchpoint contract

Every data organism carries `// DATA: METHOD /path -> TypeName` and a typed mock in `services/mock/`. UI imports only from `services/`, never from mocks directly, so swapping to the real API is a one-file change.
