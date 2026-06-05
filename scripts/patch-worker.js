const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const workerPath = path.join(__dirname, '../.open-next/_worker.js');

if (fs.existsSync(workerPath)) {
  console.log('Patching .open-next/_worker.js with static import...');
  let content = fs.readFileSync(workerPath, 'utf8');

  // Convert dynamic import of handler.mjs to a static import at the top so esbuild can bundle it
  content = content.replace(
    'const { handler } = await import("./server-functions/default/handler.mjs");',
    ''
  );

  // Prepend the static import of handler
  content = `import { handler } from "./server-functions/default/handler.mjs";\n` + content;

  fs.writeFileSync(workerPath, content, 'utf8');
  console.log('Worker patched successfully.');

  // Run esbuild programmatically to bundle the entire worker into a single minified file
  console.log('Bundling and minifying worker with esbuild...');
  
  const bannerContent = `
import * as _async_hooks from "node:async_hooks";
import * as _path from "node:path";
import * as _crypto from "node:crypto";
import * as _stream from "node:stream";
import * as _stream_web from "node:stream/web";
import * as _buffer from "node:buffer";
import * as _util from "node:util";
import * as _events from "node:events";
import * as _url from "node:url";
import * as _timers from "node:timers";
import * as _timers_promises from "node:timers/promises";
import * as _os from "node:os";
import * as _string_decoder from "node:string_decoder";
import * as _diagnostics_channel from "node:diagnostics_channel";
import * as _perf_hooks from "node:perf_hooks";
import * as _zlib from "node:zlib";

// The ultimate mock Proxy: returns itself for all property access, function calls, and new instances.
// We use a standard function as the target to make the Proxy constructable (arrow functions are not constructable).
// This prevents any method calls, property lookups, or instantiation on unsupported modules from throwing runtime errors.
const ultimateMock = new Proxy(function() { return ultimateMock; }, {
  get: () => ultimateMock
});

const requireCache = {};

globalThis.require = function(name) {
  const map = {
    "node:async_hooks": _async_hooks, "async_hooks": _async_hooks,
    "node:path": _path, "path": _path,
    "node:crypto": _crypto, "crypto": _crypto,
    "node:stream": _stream, "stream": _stream,
    "node:stream/web": _stream_web, "stream/web": _stream_web,
    "node:buffer": _buffer, "buffer": _buffer,
    "node:util": _util, "util": _util,
    "node:events": _events, "events": _events,
    "node:url": _url, "url": _url,
    "node:timers": _timers, "timers": _timers,
    "node:timers/promises": _timers_promises, "timers/promises": _timers_promises,
    "node:os": _os, "os": _os,
    "node:string_decoder": _string_decoder, "string_decoder": _string_decoder,
    "node:diagnostics_channel": _diagnostics_channel, "diagnostics_channel": _diagnostics_channel,
    "node:perf_hooks": _perf_hooks, "perf_hooks": _perf_hooks,
    "node:zlib": _zlib, "zlib": _zlib,
    "node:fs": ultimateMock, "fs": ultimateMock,
    "node:vm": ultimateMock, "vm": ultimateMock,
    "node:child_process": ultimateMock, "child_process": ultimateMock,
    "node:inspector": ultimateMock, "inspector": ultimateMock,
    "node:http": ultimateMock, "http": ultimateMock,
    "node:https": ultimateMock, "https": ultimateMock,
    "node:module": ultimateMock, "module": ultimateMock,
    "node:net": ultimateMock, "net": ultimateMock,
    "node:tls": ultimateMock, "tls": ultimateMock,
    "node:dns": ultimateMock, "dns": ultimateMock,
    "node:readline": ultimateMock, "readline": ultimateMock,
    "node:querystring": ultimateMock, "querystring": ultimateMock,
    "node:punycode": ultimateMock, "punycode": ultimateMock,
    "node:assert": ultimateMock, "assert": ultimateMock,
    "node:constants": ultimateMock, "constants": ultimateMock
  };

  if (name in map) {
    if (!requireCache[name]) {
      const mod = map[name];
      // Only wrap real modules in a mutable Proxy, keep ultimateMock as is
      if (mod === ultimateMock) {
        requireCache[name] = ultimateMock;
      } else {
        const overrides = {};
        requireCache[name] = new Proxy(mod, {
          get: (target, prop) => {
            if (prop in overrides) return overrides[prop];
            return target[prop];
          },
          set: (target, prop, value) => {
            overrides[prop] = value;
            return true;
          },
          has: (target, prop) => {
            return prop in overrides || prop in target;
          }
        });
      }
    }
    return requireCache[name];
  }
  
  // Return standard MODULE_NOT_FOUND error to let optional try/catch blocks degrade gracefully
  const err = new Error("Cannot find module '" + name + "'");
  err.code = "MODULE_NOT_FOUND";
  throw err;
};
`;

  try {
    // List of Node.js built-ins to alias to their node: prefixed versions
    const modules = [
      'async_hooks', 'fs', 'path', 'os', 'url', 'vm', 'buffer', 'util', 'module', 'events', 'http', 'https',
      'crypto', 'stream', 'zlib', 'assert', 'dns', 'net', 'tls', 'string_decoder', 'readline', 'querystring',
      'punycode', 'child_process', 'inspector', 'timers', 'timers/promises'
    ];
    
    const alias = {};
    for (const mod of modules) {
      alias[mod] = `node:${mod}`;
    }

    esbuild.buildSync({
      entryPoints: [workerPath],
      bundle: true,
      minify: true,
      platform: 'neutral',
      format: 'esm',
      target: 'es2022',
      outfile: workerPath,
      allowOverwrite: true,
      external: ['node:*', 'cloudflare:*'],
      alias,
      banner: {
        js: bannerContent
      }
    });

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
