# Data Visualization

One chart answers one question. Write the question as the chart title's subtitle.

| Question | Chart | Notes |
|---|---|---|
| Trend over time | line (area only for cumulative volume) | y at zero only for bar/area; annotate the inflection |
| Compare categories | horizontal bar, sorted | direct labels; no 3D |
| Part-to-whole (5 or fewer parts) | stacked bar; donut only at 4 or fewer | bar is more precise |
| Distribution | histogram, box plot, strip plot | state bin width |
| Correlation | scatter | trend line only if meaningful |
| Ranking change | slope chart | highlight the story series |
| Progress to target | bullet chart or progress bar | target marker visible |
| Single KPI | stat with period, delta (sign + icon + color), sparkline | comparison baseline named |
| Geography | choropleth only if location is the point | otherwise a sorted table |
| Many dimensions | small multiples | shared scales |
| Flow / funnel | horizontal funnel bars with conversion % between steps | not 3D funnels |
| Schedule | Gantt-style bars | today line |

Rules: max 6 series; direct labels over legends; one highlight color against neutral gray; units and time zone on axes; `Intl.NumberFormat` with compact notation for large values; no dual axes unless unavoidable and labelled; tooltips supplement, never replace, visible labels.

Accessibility: never color alone (patterns, markers or labels); `role="img"` + `aria-label` with the takeaway sentence; "View as table" toggle or visually hidden table; 3:1 contrast for lines and bars against the background.

States: skeleton at final height (no layout shift), empty ("No orders in this period" + change-period action), error with retry, partial data marked.
