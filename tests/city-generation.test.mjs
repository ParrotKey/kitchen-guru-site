import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const scriptPath = path.join(root, 'tools/generate-city-pages.mjs');
const source = fs.readFileSync(scriptPath, 'utf8')
  .replace(/^import .*;\r?\n/gm, '')
  .replace('fileURLToPath(import.meta.url)', 'scriptPath');

function generateInMemory() {
  const output = new Map();
  // Execute the existing CLI without allowing its filesystem writes.
  vm.runInNewContext(source, {
    fs: {
      readFileSync: fs.readFileSync,
      mkdirSync() {},
      writeFileSync(file, content) { output.set(path.relative(root, file).replaceAll('\\', '/'), content); },
    },
    path, scriptPath, process: { argv: [] }, console: { log() {} },
  });
  return output;
}

test('city generation is deterministic, checked in, and uses scoped identity copy', () => {
  const first = generateInMemory();
  assert.deepEqual(first, generateInMemory());
  assert.equal(first.size, 34);
  for (const [file, generated] of first) {
    assert.equal(fs.readFileSync(path.join(root, file), 'utf8').replaceAll('\r\n', '\n'), generated.replaceAll('\r\n', '\n'), file);
    if (!/^cities\/[^/]+\/index.html$/.test(file)) continue;
    assert.match(generated, /Public court counts do not identify you/);
    assert.match(generated, /Group messages require an accepted invitation/);
    assert.doesNotMatch(generated, /Names, presence, and (?:direct )?messages are for|Kitchen Guru\+/);
    const schemas = [...generated.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    assert.ok(schemas.length > 0, `${file} structured data remains valid`);
  }
});
