const fs = require('fs');
const path = require('path');

const workerPath = path.join(__dirname, '../.open-next/assets/_worker.js');
const routesPath = path.join(__dirname, '../.open-next/assets/_routes.json');

if (fs.existsSync(workerPath)) {
  console.log('Patching .open-next/assets/_worker.js with module.require polyfill and import path adjustments...');
  let content = fs.readFileSync(workerPath, 'utf8');
  
  // Define Node compatibility polyfill
  const polyfill = `
globalThis.require = globalThis.require || (() => { throw new Error("require is not supported") });
globalThis.module = globalThis.module || {};
globalThis.module.require = globalThis.module.require || globalThis.require;
`;

  // Prepend the polyfill
  content = polyfill + '\n' + content;

  // Adjust relative paths because the worker has been moved into the assets/ folder
  content = content
    .replace(/from "\.\/cloudflare\//g, 'from "../cloudflare/')
    .replace(/from "\.\/middleware\//g, 'from "../middleware/')
    .replace(/from "\.\/\.build\//g, 'from "../.build/')
    .replace(/import\("\.\/server-functions\//g, 'import("../server-functions/');

  fs.writeFileSync(workerPath, content, 'utf8');
  console.log('Worker patched successfully.');

  // Create the _routes.json file to exclude static assets from the worker
  console.log('Creating .open-next/assets/_routes.json...');
  const routesContent = {
    version: 1,
    include: ["/*"],
    exclude: [
      "/_next/*",
      "/favicon.ico",
      "/profile-picture.png"
    ]
  };
  fs.writeFileSync(routesPath, JSON.stringify(routesContent, null, 2), 'utf8');
  console.log('_routes.json created successfully.');
} else {
  console.error('Error: .open-next/assets/_worker.js not found!');
  process.exit(1);
}
