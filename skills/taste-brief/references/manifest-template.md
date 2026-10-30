# BUILD_MANIFEST.md template

```md
# <Product> Build Manifest  (v1, <date>)

## Product
One-liner: <what it does for whom>
Archetype: <data-workspace | crud-admin | consumer-app | marketing-site | content | commerce | devtool | workflow | realtime>
Risk: <low | money | health | regulated | safety>   Density: <low | medium | high>   Devices: <desktop-first | mobile-first | both>
Locale: <en-GB, RTL?>   Stack: <detected or chosen>   Brand assets: <none | guidelines | logo only>

## Users and jobs
| User | Job (when..., I want..., so I can...) | Success signal |
|---|---|---|

## Critical flow
1. ... -> 2. ... -> 3. ... -> Success: <state>

## Other flows
- <Flow name>: step -> step -> success

## Views
| View | Purpose | Top 3 user questions | Primary action | Reads / writes |
|---|---|---|---|---|

## State matrix
| View | Loading | Empty | Error | Permission | Domain states |
|---|---|---|---|---|---|

## Data contracts
// DATA: GET /api/invoices?status=&page= -> Page<Invoice>
type Invoice = { id: string; number: string; customer: { id: string; name: string }; amountMinor: number; currency: 'GBP' | 'EUR' | 'USD'; status: 'draft' | 'sent' | 'overdue' | 'paid'; dueDate: string /* ISO */ }

## Component inventory
| Level | Component | reuse/new | Used by |
|---|---|---|---|

## Assumptions and data needed
- ASSUMPTION: ...
- DATA NEEDED: ...
```

## Archetype quick defaults (taste-direction may override with a reason)

| Archetype | Nav | Density | Primary layout |
|---|---|---|---|
| data-workspace | collapsible sidebar + command palette | high | filter bar + table/master-detail |
| crud-admin | sidebar | medium | list -> detail -> edit sheet |
| consumer-app | bottom tabs (mobile), top nav (web) | low | cards and feeds sized for thumbs |
| marketing-site | sticky top nav | low | narrative sections, proof, one CTA |
| content | top nav + in-page TOC | low | 65ch reading column |
| commerce | top nav + search | medium | grid, filters, sticky buy box |
| devtool | sidebar + tabs | high | split panes, mono accents, keyboard first |
| workflow | stepper | medium | single-column form + summary aside |
| realtime | sidebar | high | status overview, alert list, drill-down |
