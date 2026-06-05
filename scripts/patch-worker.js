const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const workerPath = path.join(__dirname, '../.open-next/_worker.js');

if (fs.existsSync(workerPath)) {
  console.log('Patching .open-next/_worker.js with static import and polyfills...');
  let content = fs.readFileSync(workerPath, 'utf8');

  // Define Node compatibility polyfill
  const polyfill = `
globalThis.require = globalThis.require || (() => { throw new Error("require is not supported") });
globalThis.module = globalThis.module || {};
globalThis.module.require = globalThis.module.require || globalThis.require;
`;

  // Convert dynamic import of handler.mjs to a static import at the top so esbuild can bundle it
  content = content.replace(
    'const { handler } = await import("./server-functions/default/handler.mjs");',
    ''
  );

  // Prepend the static import and polyfill
  content = `import { handler } from "./server-functions/default/handler.mjs";\n` + polyfill + '\n' + content;

  fs.writeFileSync(workerPath, content, 'utf8');
  console.log('Worker patched successfully.');

  // Run esbuild to bundle the entire worker into a single minified file
  console.log('Bundling and minifying worker with esbuild...');
  try {
    // List of Node.js built-ins to be aliased to their node: prefix equivalents
    const modules = [
      'async_hooks', 'fs', 'path', 'os', 'url', 'vm', 'buffer', 'util', 'module', 'events', 'http', 'https',
      'crypto', 'stream', 'zlib', 'assert', 'dns', 'net', 'tls', 'string_decoder', 'readline', 'querystring',
      'punycode', 'child_process'
    ];
    const aliases = modules.map(mod => `--alias:${mod}=node:${mod}`).join(' ');
    const externals = '--external:node:* --external:cloudflare:*';

    execSync(
      `npx esbuild "${workerPath}" --bundle --minify --platform=neutral --target=es2022 --outfile="${workerPath}" --allow-overwrite ${aliases} ${externals}`,
      { stdio: 'inherit' }
    );
    console.log('Esbuild bundling completed successfully.');
  } catch (err) {
    console.error('Error running esbuild:', err);
    process.exit(1);
  }

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
