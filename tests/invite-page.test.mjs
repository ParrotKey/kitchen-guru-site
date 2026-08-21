import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { inviteViewFromHash } from '../assets/invite.mjs';

const html = await readFile(new URL('../invite.html', import.meta.url), 'utf8');

test('invite page is no-index, branded, and reacts to invite changes', () => {
  assert.match(html, /noindex, nofollow, noarchive/);
  assert.match(html, /Open Kitchen Guru/);
  assert.match(html, /window\.addEventListener\('hashchange', renderInvite\)/);
  assert.match(html, /This link does not accept anything automatically/);
});

test('valid invite hashes create the expected native route', () => {
  const id = '11111111-2222-4333-8444-555555555555';
  assert.deepEqual(inviteViewFromHash(`#${id}`), {
    valid: true,
    kicker: 'Friend invite',
    title: 'You have been invited to connect.',
    copy: 'Open Kitchen Guru to see the player and choose whether to send a friend request.',
    nativeUrl: `kitchenguru:///invite/${id}`,
  });
});

test('malformed and missing hashes cannot create native routes', () => {
  for (const hash of ['', '#', '#../settings', '#not-a-player']) {
    const view = inviteViewFromHash(hash);
    assert.equal(view.valid, false);
    assert.equal(view.nativeUrl, null);
    assert.equal(view.title, 'This invite link is incomplete.');
  }
});
