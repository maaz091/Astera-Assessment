import fs from 'node:fs';
import path from 'node:path';

/**
 * Next.js 16 static export (`output: 'export', trailingSlash: true`) emits segment
 * RSC payloads inside `<route>/__next.<segment>/__PAGE__.txt`, while the client
 * router requests dot-joined `<route>/__next.<segment>.__PAGE__.txt` on static hosts.
 * Mirror nested `__next.*` files to their dot-joined siblings in `out/` so plain
 * static HTTP servers serve client-side prefetch and navigation with zero 404s.
 */
function mirrorInRouteDir(routeDir, currentDir, dotPrefix) {
  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
    const full = path.join(currentDir, entry.name);
    const nextName = `${dotPrefix}.${entry.name}`;
    if (entry.isDirectory()) {
      mirrorInRouteDir(routeDir, full, nextName);
    } else if (entry.isFile()) {
      const target = path.join(routeDir, nextName);
      if (!fs.existsSync(target)) {
        fs.copyFileSync(full, target);
      }
    }
  }
}

function walkOut(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === '_next') continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith('__next.')) {
      mirrorInRouteDir(dir, full, entry.name);
    } else {
      walkOut(full);
    }
  }
}

walkOut(path.resolve('out'));
