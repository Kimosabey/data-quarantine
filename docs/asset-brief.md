# Asset Brief — DataQuarantine

**Primary color signature:** `#F59E0B` · **Accent:** `#EF4444`
**Visual tier:** Infographic (labeled Senior-5) — grid thumbnail uses Minimal illustration tier
**Domain motif:** Fault-tolerant pipeline isolating malformed records via circuit breakers and dead-letter queues.
**Background:** Off-white `#f6f6f5` (grid thumbnail) · Light `#F5F5F4` (labeled infographic assets)

Save each to `docs/assets/<name>.png`. Site sync: `node kimo-nexus/scripts/sync-portfolio-assets.mjs`.
Grid WebP: `kimo-nexus/public/projects/data-quarantine.webp` (1280×640).

| Asset | File | Size | Status |
|---|---|---|---|
| Thumbnail | `docs/assets/thumbnail.png` | 1280×640 | ✅ Legacy (1024²) — V3 light regen queued |
| Hero | `docs/assets/hero_main.png` | 1920×1080 | ✅ Legacy (1024²) — V3 light regen queued |
| Workflow | `docs/assets/workflow.png` | 1920×1080 | ✅ Legacy (1024²) — V3 light regen queued |
| Dashboard | `docs/assets/dashboard.png` | 1600×1000 | ✅ Legacy (1024²) — V3 light regen queued |
| Architecture | `docs/assets/architecture.png` | 1600×1000 | ✅ Legacy (1024²) — V3 light regen queued |

### Thumbnail prompt (required — grid + README)

Minimal SaaS illustration, light theme, off-white background (#f6f6f5), vector graphic, soft depth, zero text, zero logos, zero UI chrome. **#F59E0B** primary + **#EF4444** accent. Amber pipeline splitting bad records into a red quarantine funnel — DLQ vault shape, no labels.

### Hero / minimal illustration prompt

Minimal SaaS illustration, light theme, off-white background (#f6f6f5), vector graphic, soft depth, zero text, zero logos, zero UI chrome. **#F59E0B** primary + **#EF4444** accent. Amber pipeline splitting bad records into a red quarantine funnel — DLQ vault shape, no labels. Spacious composition, Stripe/Linear aesthetic.

### Infographic prompt seed (workflow / dashboard / architecture)

Modern premium data pipeline resilience infographic, light background `#F5F5F4`, **#F59E0B** primary + **#EF4444** accent, Inter font, rounded cards, soft shadows, Stripe/Linear aesthetic, sharp **{W}×{H}** PNG. Show: Fault-tolerant pipeline isolating malformed records via circuit breakers and dead-letter queues. Exact labels only — no placeholder text.
