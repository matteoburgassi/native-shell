#!/usr/bin/env node
/**
 * Post-build CSS compatibility pass for legacy Smart TV browsers.
 * Strips modern CSS that old Chromium engines (webOS/Tizen) can't handle.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');

const cssFiles = [];
function findCss(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) findCss(full);
    else if (entry.name.endsWith('.css')) cssFiles.push(full);
  }
}
findCss(distDir);

for (const file of cssFiles) {
  let css = readFileSync(file, 'utf8');
  const before = css;

  // 1. Strip :not(#\#) specificity hacks from cascade-layers polyfill
  css = css.replace(/:not\(#\\#\)/g, '');

  // 2. Unwrap @supports blocks (up to 3 levels of nesting)
  let changed = true;
  while (changed) {
    const prev = css;
    css = css.replace(
      /@supports\s*[^{]*\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}/g,
      (_, inner) => inner,
    );
    changed = css !== prev;
  }

  // 3. Strip @property declarations
  css = css.replace(/@property\s+[^{]*\{[^}]*\}/g, '');

  // 4. Remove "in oklab" / "in srgb" from gradient positions
  css = css.replace(/\bin\s+(?:oklab|oklch|srgb|display-p3|lab|lch)\b/g, '');

  // 5. Remove entire declarations that contain unsupported color functions.
  //    Match property:value pairs within rule blocks.
  css = css.replace(/[a-z-]+\s*:\s*[^;{}]*color-mix\([^)]*\)[^;{}]*;?/g, '');
  css = css.replace(/[a-z-]+\s*:\s*[^;{}]*color\(display-p3[^)]*\)[^;{}]*;?/g, '');

  // 6. Remove duplicate broken fallback values like "color:#fff 80%"
  //    These are residue where color-mix was partially stripped.
  //    Valid: "color:#fff" / "color:rgba(...)" — Invalid: "color:#fff 80%"
  css = css.replace(/([a-z-]+\s*:\s*#[0-9a-fA-F]{3,8})\s+\d+%/g, '$1');
  css = css.replace(/([a-z-]+\s*:\s*#[0-9a-fA-F]{3,8})\s+\d+%/g, '$1');

  // 7. Remove empty rule blocks left behind
  css = css.replace(/[^{}]+\{\s*\}/g, '');
  // Run twice for nested empties
  css = css.replace(/[^{}]+\{\s*\}/g, '');

  if (css !== before) {
    writeFileSync(file, css);
    console.log(`  patched: ${file}`);
  }
}

console.log('CSS compat pass complete.');
