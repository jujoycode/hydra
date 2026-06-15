# Hydra — Brand Assets

The Hydra mascot is a friendly, hand-drawn **multi-headed serpent** — a goofy, never-scary
take on the mythological Hydra (the many heads also nod to the app's multi-workspace nature).
Style: bold dark outline, muted hand-drawn fills, derpy dot-eyes (Flaticon "lineal-color" feel).

## Files

| File | What it is |
|------|------------|
| `hydra-mascot.svg` / `.png` | The mascot, standalone, transparent background (hero/illustration use) |
| `hydra-icon.svg` | App-icon composition — mascot on a soft rounded-square badge |
| `hydra-icon-small.svg` | Simplified high-contrast variant for tiny sizes (16/32 px) |
| `hydra-hero.svg` / `.png` | Dark README hero banner (= `docs/assets/readme/hero-banner.svg`) |
| `render.sh` | SVG → PNG via headless Chrome (`bash render.sh in.svg out.png 512` or `1280x400`) |
| `generate-icons.cjs` | Packs rendered PNGs into `build/icon.{ico,icns,png}` (no deps) |

Generated app icons live in `build/` (referenced by `forge.config.ts → icon: 'build/icon'`):
`icon.ico` (16/24/32 simplified, 48–256 full), `icon.icns` (32–1024), `icon.png` (512).

## Palette

| Role | Hex |
|------|-----|
| Outline (ink) | `#2e3326` |
| Head green (light→dark) | `#97a481` → `#6c7a55` |
| Body rose (light→dark) | `#e6b0a2` → `#cf8a7c` |
| Belly cream | `#f5d6c9` → `#e3a596` |
| Tongue | `#cf6b6b` |
| Brand green (badge / app) | `#3a7457` |

## Regenerating the icon set

```bash
# 1) render every size needed (full mascot + simplified small variant)
for s in 16 24 32 48 64 128 256 512 1024; do
  bash assets/brand/render.sh assets/brand/hydra-icon.svg /tmp/icon_${s}.png ${s}
done
for s in 16 24 32; do
  bash assets/brand/render.sh assets/brand/hydra-icon-small.svg /tmp/small_${s}.png ${s}
done
# 2) pack -> build/icon.{ico,icns,png}  (point the script's LAB dir at /tmp renders)
node assets/brand/generate-icons.cjs
```

> Requires Google Chrome or Microsoft Edge installed (headless rasterizer).
