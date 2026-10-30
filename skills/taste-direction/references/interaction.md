# Interaction Patterns

- **Forms**: single column; label above input; helper under; error replaces helper and links via `aria-describedby`; mark optional, not required, when most are required; fieldsets for groups; correct `type`, `inputMode`, `autoComplete`; validate on blur, re-validate on change after first error; focus first invalid on submit; preserve input on server error; sticky submit bar on long forms; autosave drafts for long entry.
- **Tables**: sticky header; sortable with `aria-sort`; column visibility for 8+ columns; trailing row-action menu; bulk select with count and sticky bulk bar; density toggle; pagination or virtualization over 100 rows; distinct empty vs filtered-empty states; skeleton rows at real row height.
- **Search and filter**: debounce 250ms; active filters as removable chips; "Clear all"; result count; state in URL.
- **Feedback**: toast (4-6s, undo when reversible) for transient success; inline alert for persistent status; dialog only for blocking decisions; optimistic updates with rollback for low-risk actions.
- **Destructive**: name the target and consequence; typed confirmation for irreversible high-impact actions; prefer undo over confirm when reversible.
- **Onboarding**: skippable; value within 60 seconds; checklist with progress; sample-data option; empty states teach the first action.
- **Loading**: skeleton for regions, spinner only inside controls, progress bar for known-length jobs; never block the whole page for partial data; respond within 400ms or show feedback.
- **Errors**: what happened, why if known, what to do next; no stack traces; retry where safe; keep the user's work.
- **Mobile**: primary actions in thumb zone; no hover-only affordances; inputs at 16px to stop iOS zoom; safe-area insets; sheets over centered modals.
- **Keyboard**: every action reachable; `Esc` closes overlays and returns focus to the trigger; arrow keys inside menus, tabs, grids (roving tabindex); shortcuts shown in tooltips and the command palette.
- **Copy in controls**: verb + object, sentence case, specific (C04, C08).
