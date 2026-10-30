# Component Spec Template and Inventory

```md
# <Component>
Level: atom | molecule | organism | template      Depends on: <components>
Purpose: <1 line>                                 Not for: <1 line, name the alternative>
Anatomy: <parts>
Variants: <name -> intent>                        Sizes: sm 32 / md 36 / lg 40
States: default, hover, focus-visible, active, disabled, loading, error, success (visual change for each)
Tokens: <part -> semantic/component token>
Layout: padding, gap, min/max width, truncation, alignment
Behaviour: keyboard map, focus management, async handling, controlled vs uncontrolled
A11y: role, aria attributes, contrast pairs, announcements
Content: label length, casing, icon usage
Responsive: 320 / 768 / 1280
Do / Don't: 2 pairs
API: | prop | type | default | description |
```

## Minimum inventory

- **Atoms**: Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Switch, Badge, Avatar, Tooltip, Skeleton, Separator, Label, Kbd, Spinner.
- **Molecules**: FormField, SearchInput, Tabs, Breadcrumb, Pagination, Toast, Alert, Stat, EmptyState, DropdownMenu, DatePicker, Combobox, Popover, FileDrop.
- **Organisms**: DataTable, Sidebar, TopBar, CommandPalette, Dialog, AlertDialog, Sheet, Stepper, Calendar, ChartPanel, FilterBar, ErrorBoundary view.
- **Templates**: AppShell, AuthLayout, SettingsLayout, MasterDetail, MarketingPage.

One of each: one `Button` (cva variants), one `DataTable<T>`, one `Stat`, one `EmptyState`. Near-duplicates are slop.
