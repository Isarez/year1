#!/usr/bin/env bash
# ติดตั้ง/ตรวจสอบ Playwright สำหรับชุดเทสของ "นกฮูกสนุกคิด"
#
# หลักการ: ไม่เก็บ node_modules ไว้ในโปรเจค — ติดตั้ง Playwright ไว้ที่เดียวกลางเครื่อง
# (~/.local/share/playwright-shared) แล้วให้โปรเจคทำ symlink มาหา ทุกโปรเจคในเครื่องใช้ร่วมกันได้
# ตัวเบราว์เซอร์ (chromium ~550MB) Playwright เก็บไว้นอกโปรเจคอยู่แล้ว (~/Library/Caches/ms-playwright)
#
# สคริปต์นี้รันซ้ำได้เสมอ (idempotent) — ถ้าติดตั้งครบแล้วจะจบทันทีไม่ทำอะไร
# ใช้: bash tools/setup-playwright.sh   แล้วค่อย npx playwright test

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SHARED_DIR="${PLAYWRIGHT_SHARED_DIR:-$HOME/.local/share/playwright-shared}"
LINK="$PROJECT_DIR/node_modules"
STAMP="$SHARED_DIR/.installed"

# เวอร์ชันที่โปรเจคต้องการ (อ่านจาก package.json ของโปรเจค)
SPEC="$(node -e "try{const d=require('$PROJECT_DIR/package.json').devDependencies||{};console.log(d['@playwright/test']||'latest')}catch(e){console.log('latest')}")"

# ---------- 1) ติดตั้งครบแล้วหรือยัง ----------
if [ -e "$LINK" ] \
  && node -e "require.resolve('@playwright/test',{paths:['$PROJECT_DIR']})" 2>/dev/null \
  && (cd "$PROJECT_DIR" && npx --no-install playwright --version >/dev/null 2>&1); then
  echo "✅ Playwright พร้อมใช้แล้ว ($(cd "$PROJECT_DIR" && npx --no-install playwright --version)) — ติดตั้งไว้ที่ $SHARED_DIR"
  ALREADY=1
else
  ALREADY=0
  echo "📦 ยังไม่มี Playwright ที่ใช้ได้ — กำลังติดตั้งลง $SHARED_DIR (ไม่ลงในโปรเจค)"

  mkdir -p "$SHARED_DIR"
  if [ ! -f "$SHARED_DIR/package.json" ]; then
    cat > "$SHARED_DIR/package.json" <<EOF
{
  "name": "playwright-shared",
  "private": true,
  "description": "Playwright ติดตั้งกลางของเครื่องนี้ — โปรเจคต่างๆ symlink node_modules มาที่นี่",
  "devDependencies": {
    "@playwright/test": "$SPEC"
  }
}
EOF
  fi

  (cd "$SHARED_DIR" && npm install --no-fund --no-audit)

  # โปรเจคเคยมี node_modules จริงอยู่ (จาก npm install) → แทนที่ด้วย symlink
  if [ -e "$LINK" ] && [ ! -L "$LINK" ]; then
    echo "🧹 ลบ node_modules ตัวจริงในโปรเจคทิ้ง แล้วชี้ไป $SHARED_DIR แทน"
    rm -rf "$LINK"
  fi
  [ -L "$LINK" ] && rm -f "$LINK"
  ln -s "$SHARED_DIR/node_modules" "$LINK"
fi

# ---------- 2) เบราว์เซอร์ (chromium) ----------
# playwright.config.js ใช้แค่ chromium ทั้ง 2 project (desktop/tablet)
BROWSER_DIR="${PLAYWRIGHT_BROWSERS_PATH:-$HOME/Library/Caches/ms-playwright}"
[ -d "$BROWSER_DIR" ] || BROWSER_DIR="$HOME/.cache/ms-playwright"
if ! ls -d "$BROWSER_DIR"/chromium-* >/dev/null 2>&1; then
  echo "🌐 ยังไม่มีเบราว์เซอร์ chromium — กำลังโหลด (เก็บนอกโปรเจคที่ $BROWSER_DIR)"
  (cd "$PROJECT_DIR" && npx playwright install chromium)
  ALREADY=0
fi

# ---------- 3) จดไว้ว่าเครื่องนี้ติดตั้งแล้ว ----------
printf '{"installedAt":"%s","spec":"%s","version":"%s","sharedDir":"%s"}\n' \
  "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$SPEC" \
  "$(cd "$PROJECT_DIR" && npx --no-install playwright --version 2>/dev/null || echo unknown)" \
  "$SHARED_DIR" > "$STAMP"

[ "$ALREADY" = "1" ] || echo "✅ ติดตั้งเสร็จแล้ว — รันเทสได้ด้วย: npx playwright test"
