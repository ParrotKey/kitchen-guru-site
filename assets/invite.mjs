const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function inviteViewFromHash(hash) {
  const inviteId = hash.replace(/^#/, '').trim();
  if (!UUID_PATTERN.test(inviteId)) {
    return {
      valid: false,
      kicker: 'Invite unavailable',
      title: 'This invite link is incomplete.',
      copy: 'Ask the player to share a new invitation from their Kitchen Guru profile.',
      nativeUrl: null,
    };
  }

  return {
    valid: true,
    kicker: 'Friend invite',
    title: 'You have been invited to connect.',
    copy: 'Open Kitchen Guru to see the player and choose whether to send a friend request.',
    nativeUrl: `kitchenguru:///invite/${inviteId}`,
  };
}
