const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = ['node_modules', '.git', 'dist'];
const IGNORED_FILES = [path.join('config', 'config.js')];

function shouldIgnore(filePath) {
  for (const d of IGNORED_DIRS) if (filePath.includes(`${path.sep}${d}${path.sep}`)) return true;
  for (const f of IGNORED_FILES) if (filePath.endsWith(f)) return true;
  return false;
}

function stripComments(code) {

  code = code.replace(/\/\*[\s\S]*?\*\

  code = code.split('\n').map((line, idx) => {
    if (idx === 0 && line.startsWith('#!')) return line;
    const i = line.indexOf('
    if (i === -1) return line;

    const before = line.slice(0, i);
  if (/https?:\/\
    return before.trimEnd();
  }).join('\n');
  return code;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (shouldIgnore(full)) continue;
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && full.endsWith('.js')) {
      try {
        const orig = fs.readFileSync(full, 'utf8');
        const stripped = stripComments(orig);
        if (stripped !== orig) {
          fs.writeFileSync(full, stripped, 'utf8');
          console.log('Stripped comments:', full);
        }
      } catch (e) {
        console.error('Failed to process', full, e.message);
      }
    }
  }
}

const root = path.resolve(__dirname, '..');
walk(root);
console.log('Done stripping comments.');
