import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('data/screenshot-provenance.json', root), 'utf8'));
const home = await readFile(new URL('index.html', root), 'utf8');

test('archived screenshots stay intact and native app-store captures remain blocked', async () => {
  assert.equal(manifest.publicHomepageReferencesRetired, true);
  assert.equal(manifest.nativeAppStoreCapturesBlocked, true);
  assert.match(manifest.reason, /No images were replaced/);
  const files = manifest.assets.map((asset) => asset.file);
  assert.equal(new Set(files).size, files.length);
  const actual = (await readdir(new URL('assets/app-screens/', root)))
    .filter((file) => file.endsWith('.png')).map((file) => `assets/app-screens/${file}`);
  assert.deepEqual(files.toSorted(), actual.toSorted());
  assert.doesNotMatch(home, /app-screens\/|kg-app-|data-app-image|data-app-screen|href="#screens"/);
  for (const file of files) assert.ok(!home.includes(file));
  for (const asset of manifest.assets) {
    assert.equal(asset.status, 'unverified-route-capture');
    assert.doesNotMatch(asset.replacementRoute, /capture/);
    const bytes = await readFile(new URL(asset.file, root));
    assert.equal(createHash('sha256').update(bytes).digest('hex').toUpperCase(), asset.sha256);
    if (asset.file.endsWith('kg-app-map-real-390x844.png')) {
      assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
      assert.equal(bytes.readUInt32BE(16), 390);
      assert.equal(bytes.readUInt32BE(20), 844);
    } else {
      // Retained legacy files are JPEGs despite their .png names; do not certify PNG provenance.
      assert.equal(bytes.subarray(0, 3).toString('hex'), 'ffd8ff');
    }
  }
});

test('other public HTML does not reference archived screenshots', async () => {
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const { join } = await import('node:path');
    const file = join(entry.parentPath, entry.name);
    const html = await readFile(file, 'utf8');
    assert.doesNotMatch(html, /app-screens\/|kg-app-|kg-current-|store-assets\//, file);
  }
});
