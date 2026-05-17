import { deriveFriendship } from '../utils/helpers';

const makeME = (overrides = {}) => ({
  friends: [],
  sentRequests: [],
  blockedUsers: [],
  ...overrides,
});

test('returns none when me is null', () => {
  expect(deriveFriendship(null, 'abc')).toBe('none');
});

test('returns none when targetId is null', () => {
  expect(deriveFriendship(makeME(), null)).toBe('none');
});

test('returns none when no relationship exists', () => {
  expect(deriveFriendship(makeME(), 'abc')).toBe('none');
});

test('returns friend when target is in friends list', () => {
  const me = makeME({ friends: [{ _id: 'abc', username: 'alice' }] });
  expect(deriveFriendship(me, 'abc')).toBe('friend');
});

test('returns requested when target is in sentRequests', () => {
  const me = makeME({ sentRequests: [{ _id: 'abc', username: 'alice' }] });
  expect(deriveFriendship(me, 'abc')).toBe('requested');
});

test('returns blocked when target is in blockedUsers', () => {
  const me = makeME({ blockedUsers: [{ _id: 'abc', username: 'alice' }] });
  expect(deriveFriendship(me, 'abc')).toBe('blocked');
});

test('blocked takes priority over friend', () => {
  const me = makeME({
    friends: [{ _id: 'abc' }],
    blockedUsers: [{ _id: 'abc' }],
  });
  expect(deriveFriendship(me, 'abc')).toBe('blocked');
});
