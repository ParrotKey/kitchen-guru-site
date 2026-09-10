import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');
const [home, privacy, terms, deletion] = await Promise.all(
  ['index.html', 'privacy.html', 'terms.html', 'deletion.html'].map(read),
);
const text = (html) => html.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/gi, '')
  .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

test('identity promises are scoped to court counts and disclose other audiences', () => {
  for (const html of [home, privacy]) {
    assert.match(text(html), /Public court counts do not identify you/);
    assert.match(text(html), /invitations, friend requests, shared groups, or content you choose to publish/);
    assert.doesNotMatch(text(html), /identity is shared only|Identity becomes visible only|before names appear|nothing is visible until/i);
  }
  for (const audience of ['Public court-map viewers', 'Request and invitation recipients', 'Accepted group members', 'Public-content viewers']) {
    assert.ok(privacy.includes(audience));
  }
  assert.match(text(home), /Direct messages require accepted friendship\. Group messages require an accepted invitation/);
});

test('founding offer and planned store prices agree without implying release or auto-enrollment', () => {
  for (const html of [home, terms]) {
    const copy = text(html);
    assert.match(copy, /first 200 registered members receive Pro for 12 months from signup, with no automatic paid enrollment afterward/);
    assert.match(copy, /Planned U\.S\. pricing is \$2\.99\/month or \$29\.99\/year/);
    assert.match(copy, /When purchases become available.*final localized price and billing period before confirmation/);
  }
  assert.match(home, />Releasing soon</);
  assert.match(home, />Coming soon</);
  assert.doesNotMatch(text(home), /captain|Kitchen Guru\+|Fine-tune court alerts/i);
  for (const html of [privacy, terms, deletion]) assert.doesNotMatch(text(html), /Premium|RevenueCat|Supabase|entitlements|row-level/);
});

test('deletion retains the 30-day email target and distinguishes asynchronous photo cleanup', () => {
  assert.match(text(deletion), /aim to complete email requests within 30 days/);
  assert.doesNotMatch(text(deletion), /within 7 days/);
  assert.match(text(deletion), /Confirm twice/);
  assert.match(text(deletion), /Download my data/);
  for (const html of [deletion, privacy]) {
    assert.match(text(html), /Uploaded-photo cleanup may take a few minutes/);
    assert.match(text(html), /while a report is open and for 180 days after resolution, including after account deletion/i);
  }
  assert.match(text(privacy), /30 days after checkout/);
  assert.match(text(deletion), /Cancel an active subscription separately/);
  assert.match(text(terms), /Deleting your account does not cancel an Apple or Google subscription/);
});

test('existing operator and jurisdiction remain intact', () => {
  assert.match(privacy, /operated by <strong>Parrot Key LLC<\/strong>, located in <strong>Florida<\/strong>/);
  assert.match(terms, /laws of the State of <strong>Florida<\/strong>/);
  assert.match(terms, /courts located in <strong>Florida<\/strong>/);
});

test('privacy reflects public photo URLs, notification delivery, disabled telemetry, and transient viewport bounds', () => {
  const copy = text(privacy);
  assert.match(copy, /store your age as a whole number, then discard the exact birth date/);
  assert.match(copy, /Profile and court photo files have public URLs/);
  assert.match(copy, /anyone holding a file URL can access that file/);
  assert.match(copy, /Group photos are private and accessible only to active members and people holding a valid invitation/);
  assert.match(copy, /Public posts, court updates, and comments display the author's player name/);
  assert.match(copy, /Player names and profile photos can appear in friend requests and invitations/);
  assert.match(copy, /generic group-plan alerts through Expo, Apple Push, and Google FCM/);
  assert.match(copy, /notification text does not include private message or plan details/);
  assert.match(copy, /PostHog product analytics and Sentry error reporting are disabled in the current release configuration/);
  assert.doesNotMatch(copy, /no PII|privacy-respecting analytics/);
  assert.match(copy, /Map viewport bounds are transmitted to retrieve courts in view but are not retained/);
  for (const html of [privacy, deletion]) {
    assert.match(text(html), /including replaced uploads, are queued for file deletion with automatic retries/);
    assert.match(text(html), /longer during a service outage/);
  }
  for (const html of [privacy, terms, deletion]) assert.match(text(html), /Last updated: September 10, 2026/);
});
