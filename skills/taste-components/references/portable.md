# Portable Mode Fragments

For Razor (`.cshtml`), Thymeleaf, Jinja/Django, ERB, Blade and air-gapped deployments. Rules: semantic HTML mirroring shadcn markup and ARIA; Tailwind utilities from a precompiled CSS file (or `tokens.css` + small component CSS); no CDN; no inline `on*` attributes; ES modules loaded with `type="module"` (nonce if CSP requires); CSRF slot in every form; inline Lucide SVG with `currentColor`.

## Layout

`components/<name>.html` fragment + `components/<name>.js` module. Modules find elements by `data-*` hooks and are idempotent (`if (el.dataset.ready) return`).

## Dialog

```html
<button type="button" class="btn btn-primary" data-dialog-open="confirm-delete">Delete project</button>
<dialog id="confirm-delete" class="dialog" aria-labelledby="confirm-delete-title">
  <form method="post" action="/projects/42/delete">
    <input type="hidden" name="__RequestVerificationToken" value="@token">
    <h2 id="confirm-delete-title">Delete "Q3 forecast"?</h2>
    <p>Charts using this project will stop updating. This cannot be undone.</p>
    <div class="dialog-actions">
      <button type="button" class="btn btn-outline" data-dialog-close>Cancel</button>
      <button type="submit" class="btn btn-destructive">Delete project</button>
    </div>
  </form>
</dialog>
```
```js
// components/dialog.js
for (const btn of document.querySelectorAll('[data-dialog-open]')) {
  const dlg = document.getElementById(btn.dataset.dialogOpen)
  btn.addEventListener('click', () => dlg.showModal())
  dlg.querySelector('[data-dialog-close]')?.addEventListener('click', () => dlg.close())
  dlg.addEventListener('close', () => btn.focus())
}
```

## Other behaviours

| Widget | Pattern |
|---|---|
| Menu | trigger `aria-haspopup="menu" aria-expanded`, `role="menu"` list, roving `tabindex`, Esc returns focus |
| Tabs | `role="tablist"`, `role="tab"` with `aria-selected` + `aria-controls`, arrow keys move, panels `role="tabpanel"` |
| Tooltip | `aria-describedby`, show on hover and focus, hide on Esc |
| Toast | container `role="status" aria-live="polite"`, auto-dismiss 5s, pause on hover/focus |
| Disclosure | `<details><summary>` before any JS |
| Table sort | `<button>` inside `<th>` updates `aria-sort` and re-renders server-side via query string |
| Charts | vendored Chart.js file or inline SVG; never a CDN |
