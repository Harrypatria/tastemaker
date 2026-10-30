# Motion

Motion must do a job: **feedback** (something happened), **orientation** (where it came from or went), **continuity** (same object, new state). Anything else is V11.

| Level | Use for | Allowed |
|---|---|---|
| none | dense tools, regulated, data entry | color/opacity transitions on hover and focus only |
| subtle (default) | most product UI | + overlay enter/exit, list insert/remove, skeleton shimmer, 150-250ms |
| expressive | marketing, onboarding, launches | + scroll-linked reveals and hero choreography, still under 600ms per element |

Tokens: `duration.instant 80ms`, `fast 150ms`, `base 200ms`, `slow 300ms`; easing standard `cubic-bezier(.2,0,0,1)`, enter `cubic-bezier(0,0,0,1)`, exit `cubic-bezier(.3,0,1,1)`. Exits faster than enters.

Rules: animate `transform` and `opacity` only (never width/height/top); stagger at most 40ms per item and 6 items; no infinite loops outside loaders; `prefers-reduced-motion: reduce` sets durations to 0 and disables parallax and auto-advance; no motion before the content is readable (LCP first).
