# shadcn/ui Component Map

| Need | Use | Notes |
|---|---|---|
| Actions | `Button` (cva variants) | sizes 32/36/40; icon-only needs `aria-label` + `Tooltip` |
| Text input | `Input`, `Textarea`, `Label` via `Form` / `FormField` | wires `aria-describedby`, `aria-invalid` |
| Choice | `Select`, `RadioGroup`, `Checkbox`, `Switch`, `ToggleGroup` | `Combobox` (Popover + Command) for 8+ options or search |
| Date | `Calendar` + `Popover` | range mode for analytics filters |
| Blocking decision | `AlertDialog` | destructive confirms |
| Task in context | `Dialog` (desktop), `Sheet` / `Drawer` (mobile, side panels) | |
| Lightweight info | `Popover`, `HoverCard`, `Tooltip` | tooltip text only, never interactive content |
| Menus | `DropdownMenu`, `ContextMenu`, `Menubar`, `NavigationMenu` | table row actions use `DropdownMenu` |
| Navigation | `Sidebar`, `Tabs`, `Breadcrumb`, `Pagination` | tabs for peer views only |
| Feedback | `Sonner` toast, `Alert`, `Progress`, `Skeleton`, `Badge` | toast transient, Alert persistent |
| Data | `Table` + `@tanstack/react-table`, `Chart` (Recharts) | virtualize with `@tanstack/react-virtual` over ~500 rows |
| Layout | `Card`, `Separator`, `ScrollArea`, `Resizable`, `Accordion`, `Collapsible`, `AspectRatio` | |
| Command | `Command` (cmdk) in `CommandDialog` | Cmd/Ctrl+K with listener cleanup |

## Button variants (cva)

```ts
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: { sm: 'h-8 px-3', md: 'h-9 px-4', lg: 'h-10 px-6', icon: 'size-9' },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
)
```
Export variants for reuse (`buttonVariants` on links). `asChild` via Radix `Slot` for polymorphism. Loading: `<Loader2 className="animate-spin" aria-hidden />` + `aria-busy`, label stays visible.
