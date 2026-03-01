const { spawn } = require('child_process');

const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const child = spawn(cmd, ['run', 'build'], { stdio: 'inherit', shell: false });

child.on('exit', (code) => {
  if (code !== 0) {
    process.exit(code || 1);
  }
  const ssr = spawn(process.execPath, ['server/index.js'], { stdio: 'inherit' });
  ssr.on('exit', (ssrCode) => process.exit(ssrCode || 0));
});
