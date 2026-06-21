import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import FriendsTab from '../components/Friends/FriendsTab';
import { QUERY_USER } from '../utils/queries';
import { SEND_FRIEND_REQUEST, ACCEPT_FRIEND_REQUEST, UNBLOCK_USER } from '../utils/mutations';

const renderTab = (user) =>
  render(
    <MockedProvider>
      <MemoryRouter>
        <FriendsTab user={user} />
      </MemoryRouter>
    </MockedProvider>
  );

const baseUser = {
  _id: 'me',
  username: 'me',
  friends: [],
  receivedRequests: [],
  sentRequests: [],
  blockedUsers: [],
};

const userLookupResult = (id, username) => ({
  data: {
    user: {
      _id: id,
      username,
      email: `${username}@x.com`,
      concertCount: 0,
      isAdmin: false,
      concerts: [],
      friendCount: 0,
      friends: [],
      receivedRequests: [],
      requestCount: 0,
      sentRequests: [],
      blockedUsers: [],
    },
  },
});

test('shows empty friends state when no friends', () => {
  renderTab(baseUser);
  expect(screen.getByText('No friends yet')).toBeInTheDocument();
});

test('renders friend username', () => {
  const user = { ...baseUser, friends: [{ _id: 'f1', username: 'bob', concertCount: 2 }] };
  renderTab(user);
  expect(screen.getByText('bob')).toBeInTheDocument();
});

test('filters friends by search query', () => {
  const user = {
    ...baseUser,
    friends: [
      { _id: 'f1', username: 'alice', concertCount: 1 },
      { _id: 'f2', username: 'bob', concertCount: 2 },
    ],
  };
  renderTab(user);
  fireEvent.change(screen.getByPlaceholderText(/send a friend request/i), { target: { value: 'ali' } });
  expect(screen.getByText('alice')).toBeInTheDocument();
  expect(screen.queryByText('bob')).not.toBeInTheDocument();
});

test('shows no-matches state when filter finds nothing', () => {
  const user = { ...baseUser, friends: [{ _id: 'f1', username: 'alice', concertCount: 1 }] };
  renderTab(user);
  fireEvent.change(screen.getByPlaceholderText(/send a friend request/i), { target: { value: 'zzz' } });
  expect(screen.getByText('No matches')).toBeInTheDocument();
});

test('shows received request username', () => {
  const user = { ...baseUser, receivedRequests: [{ _id: 'r1', username: 'carol' }] };
  renderTab(user);
  expect(screen.getByText('carol')).toBeInTheDocument();
});

test('shows sent request username', () => {
  const user = { ...baseUser, sentRequests: [{ _id: 's1', username: 'dave' }] };
  renderTab(user);
  expect(screen.getByText('dave')).toBeInTheDocument();
});

test('shows blocked user username', () => {
  const user = { ...baseUser, blockedUsers: [{ _id: 'b1', username: 'eve' }] };
  renderTab(user);
  expect(screen.getByText('eve')).toBeInTheDocument();
});

test('looks up the username and sends a friend request on Add', async () => {
  let sentVars = null;
  const mocks = [
    {
      request: { query: QUERY_USER, variables: { username: 'frank' } },
      result: userLookupResult('u-frank', 'frank'),
    },
    {
      request: { query: SEND_FRIEND_REQUEST, variables: { friendId: 'u-frank', friendName: 'frank' } },
      result: () => {
        sentVars = { friendId: 'u-frank', friendName: 'frank' };
        return { data: { sendRequest: { username: 'frank', receivedRequests: [{ _id: 'me' }] } } };
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <FriendsTab user={baseUser} />
      </MemoryRouter>
    </MockedProvider>
  );

  fireEvent.change(screen.getByPlaceholderText(/send a friend request/i), { target: { value: 'frank' } });
  fireEvent.click(screen.getByText('Add'));

  await waitFor(() =>
    expect(sentVars).toEqual({ friendId: 'u-frank', friendName: 'frank' })
  );
});

describe('mobile swipe rows (Received / Sent / Blocked)', () => {
  const realMatchMedia = window.matchMedia;
  beforeEach(() => {
    window.matchMedia = (query) => ({
      matches: true, media: query, onchange: null,
      addListener: jest.fn(), removeListener: jest.fn(),
      addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn(),
    });
  });
  afterEach(() => { window.matchMedia = realMatchMedia; });

  test('Accept chip on a received request fires acceptRequest', async () => {
    let accepted = false;
    const mocks = [{
      request: { query: ACCEPT_FRIEND_REQUEST, variables: { senderId: 'r1', senderName: 'carol' } },
      result: () => { accepted = true; return { data: { acceptRequest: 'friends forever' } }; },
    }];
    const user = { ...baseUser, receivedRequests: [{ _id: 'r1', username: 'carol' }] };
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <FriendsTab user={user} />
        </MemoryRouter>
      </MockedProvider>
    );
    // Desktop renders the Accept action as an icon-only button (no visible
    // "Accept" text); the mobile SwipeRow chip renders a visible label span.
    // Asserting the text is present pins the mobile swipe path specifically.
    expect(screen.getByText('Accept')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Accept'));
    await waitFor(() => expect(accepted).toBe(true));
  });

  test('Unblock chip on a blocked user fires unblockUser', async () => {
    let unblocked = false;
    const mocks = [{
      request: { query: UNBLOCK_USER, variables: { blockedId: 'b1' } },
      result: () => { unblocked = true; return { data: { unblockUser: { username: 'me', blockedUsers: [] } } }; },
    }];
    const user = { ...baseUser, blockedUsers: [{ _id: 'b1', username: 'eve' }] };
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <FriendsTab user={user} />
        </MemoryRouter>
      </MockedProvider>
    );
    fireEvent.click(screen.getByTitle('Unblock'));
    await waitFor(() => expect(unblocked).toBe(true));
  });
});
