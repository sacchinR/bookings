const fs = require('fs');
const path = require('path');

const checks = [
  path.resolve(__dirname, 'dist'),
  path.resolve(__dirname, 'dist-ssr')
];

const missing = checks.filter((p) => !fs.existsSync(p));
if (missing.length > 0) {
  console.error('Missing build outputs:', missing.join(', '));
  process.exit(1);
}

console.log('Build verification passed');
