#!/usr/bin/env bash
# Render an SVG file to PNG using headless Chrome. Works from any cwd.
# Usage: bash .mascot-lab/render.sh input.svg output.png [size]
set -euo pipefail

CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
[ -f "$CHROME" ] || CHROME="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"

SVG="$1"
OUT="$2"
ARG="${3:-512}"
# ARG can be "512" (square) or "1200x420" (WxH)
case "$ARG" in
  *x*) W="${ARG%x*}"; H="${ARG#*x}";;
  *)   W="$ARG"; H="$ARG";;
esac

# Resolve to absolute paths
SVG_ABS="$(cd "$(dirname "$SVG")" && pwd)/$(basename "$SVG")"
OUT_DIR="$(cd "$(dirname "$OUT")" && pwd)"
OUT_ABS="$OUT_DIR/$(basename "$OUT")"
HTML_ABS="${SVG_ABS%.svg}.__render.html"

{
  echo '<!doctype html><html><head><meta charset="utf-8"><style>'
  echo 'html,body{margin:0;padding:0;background:transparent}'
  echo "svg{display:block;width:${W}px;height:${H}px}"
  echo '</style></head><body>'
  cat "$SVG_ABS"
  echo '</body></html>'
} > "$HTML_ABS"

"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 \
  --window-size="${W},${H}" \
  --default-background-color=00000000 \
  --screenshot="$(cygpath -w "$OUT_ABS")" \
  "$(cygpath -w "$HTML_ABS")" >/dev/null 2>&1

rm -f "$HTML_ABS"
[ -f "$OUT_ABS" ] && echo "rendered: $OUT_ABS (${W}x${H})" || { echo "FAILED to render $OUT_ABS" >&2; exit 1; }
