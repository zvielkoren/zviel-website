const fs = require('fs');
const path = require('path');

const workerPath = path.join(__dirname, '../.open-next/_worker.js');

if (fs.existsSync(workerPath)) {
  console.log('Patching .open-next/_worker.js with module.require polyfill...');
  let content = fs.readFileSync(workerPath, 'utf8');

  // Define Node compatibility polyfill
  const polyfill = `
globalThis.require = globalThis.require || (() => { throw new Error("require is not supported") });
globalThis.module = globalThis.module || {};
globalThis.module.require = globalThis.module.require || globalThis.require;
`;

  // Prepend the polyfill
  content = polyfill + '\n' + content;

  fs.writeFileSync(workerPath, content, 'utf8');
  console.log('Worker patched successfully.');
} else {
  console.error('Error: .open-next/_worker.js not found!');
  process.exit(1);
}
