# Recipes

## Layouts (Tailwind)

- **App shell**: `grid min-h-dvh grid-cols-[auto_1fr]`; sidebar `w-64` collapsing to `w-16`; header `sticky top-0 z-10 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80` (the only blur in the app); content `p-4 md:p-6 max-w-screen-2xl w-full mx-auto`.
- **Page header**: `flex flex-wrap items-end justify-between gap-4`; title `text-2xl font-semibold tracking-tight`; description `text-sm text-muted-foreground`; actions `flex gap-2` with primary last.
- **KPI row**: `grid grid-cols-2 gap-4 lg:grid-cols-4`, only for numbers a decision depends on; each has period, delta (sign + icon + color) and comparison.
- **Dashboard grid**: `grid grid-cols-12 gap-4`; primary answer `col-span-12 lg:col-span-8`, supporting `lg:col-span-4`. Order by the user's top questions.
- **Master-detail**: two panes from `lg` (`Resizable`), `Sheet` below.
- **Settings**: sub-nav `w-56` + sectioned forms `max-w-2xl`, each section with its own save or one sticky bar.
- **Auth**: centered `max-w-sm` card, or split with brand panel `hidden lg:flex`.
- **Responsive**: mobile-first; `hidden md:table-cell` for secondary columns; stacked toolbars; sticky bottom action bar on mobile forms; `@container` for reusable panels.

## Forms (react-hook-form + zod)

```tsx
const schema = z.object({
  email: z.string().email('Enter an email like name@company.com'),
  amount: z.coerce.number().positive('Amount must be more than 0'),
})
const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), mode: 'onBlur' })
async function onSubmit(values: z.infer<typeof schema>) {
  const res = await createPayment(values)
  if (!res.ok) return res.fieldErrors.forEach(([name, message]) => form.setError(name, { message }))
  toast.success(`Payment of ${formatMoney(values.amount)} scheduled`)
}
```
`grid gap-4`, two columns at `md` for short related fields; `inputMode`, `autoComplete`, `type` set; locale-aware formatting for currency, phone, dates; sticky action bar for long forms.

## Data table

Typed column config; numerics right-aligned `tabular-nums`; status = `Badge` with dot + text. Features: sort (`aria-sort`), column visibility, row selection with sticky bulk bar and count, debounced global filter, faceted filters as removable chips, server pagination when total is known, density toggle, row action menu, empty vs filtered-empty, skeleton rows at row height. URL-sync sort/filter/page. `<caption>` or `aria-label`. Below `md`: card list or contained horizontal scroll.

## Seeded mock data (hydration-safe, no E10)

```ts
// services/mock/seed.ts
export function rng(seed = 42) {
  return () => ((seed = (seed * 1664525 + 1013904223) % 2 ** 32) / 2 ** 32)
}
const r = rng(7)
const firstNames = ['Amara', 'Kenji', 'Sofia', 'Mateus', 'Priya', 'Oluwaseun', 'Lena', 'Hamid']
export const customers = Array.from({ length: 40 }, (_, i) => ({
  id: `cus_${(1000 + i).toString(36)}`,
  name: `${firstNames[Math.floor(r() * firstNames.length)]} ${['Okafor', 'Tanaka', 'Rossi', 'Silva', 'Shah', 'Adeyemi', 'Novak', 'Karimi'][i % 8]}`,
  mrrMinor: Math.round(4900 + r() * 95000),
  status: (['active', 'trialing', 'past_due', 'canceled'] as const)[Math.floor(r() ** 2 * 4)],
}))
```

## Charts (shadcn Chart / Recharts)

`ChartContainer` with `config` mapping series to `var(--chart-n)`; fixed-height wrapper (no layout shift); `aria-label` with the takeaway; direct labels or tooltip; axes with units; "View as table" toggle; skeleton while loading; max 6 series, one highlighted.

## Theme toggle (Vite, no flash)

```html
<script>
  try { const t = localStorage.getItem('theme'); if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark') } catch {}
</script>
```
Put in `<head>` before CSS. Toggle is a `button` with `aria-pressed` and a text label.
