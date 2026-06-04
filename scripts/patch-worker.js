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

  // Generate _routes.json to let Cloudflare Pages serve static files directly rather than routing them to the worker
  const routesPath = path.join(__dirname, '../.open-next/_routes.json');
  const assetsDir = path.join(__dirname, '../.open-next/assets');
  
  const exclude = ['/_next/static/*'];
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    for (const file of files) {
      if (file !== '_next') {
        const stat = fs.statSync(path.join(assetsDir, file));
        if (stat.isFile()) {
          exclude.push(`/${file}`);
        }
      }
    }
  }

  const routesContent = {
    version: 1,
    include: ['/*'],
    exclude
  };

  fs.writeFileSync(routesPath, JSON.stringify(routesContent, null, 2), 'utf8');
  console.log('Generated _routes.json successfully with exclusions:', exclude);
} else {
  console.error('Error: .open-next/_worker.js not found!');
  process.exit(1);
}
