const s = require('fs').readFileSync(__dirname + '/main.js', 'utf8');
const out = [];
for (const m of s.matchAll(/selectors:\[\["(app-[\w-]+)"\]\]|\bP\(\d+,"((?:[^"\\]|\\.)*)"\)|(title|content|caption):"((?:[^"\\]|\\.)*)"/g)) {
  if (m[1]) out.push('\n## ' + m[1]);
  else if (m[2] !== undefined && m[2].trim()) out.push(m[2].trim());
  else if (m[4]) out.push(m[3] + ': ' + m[4]);
}
console.log(out.join('\n'));
