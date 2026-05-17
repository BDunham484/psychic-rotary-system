import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import FriendsTab from '../components/Friends/FriendsTab';

const renderTab = (user) =>
  render(
    <MockedProvider>
      <MemoryRouter>
        <FriendsTab user={user} />
      </MemoryRouter>
    </MockedProvider>
  );

const baseUser = {
  friends: [],
  receivedRequests: [],
  sentRequests: [],
  blockedUsers: [],
};

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
  fireEvent.change(screen.getByPlaceholderText(/search friends/i), { target: { value: 'ali' } });
  expect(screen.getByText('alice')).toBeInTheDocument();
  expect(screen.queryByText('bob')).not.toBeInTheDocument();
});

test('shows no-matches state when filter finds nothing', () => {
  const user = { ...baseUser, friends: [{ _id: 'f1', username: 'alice', concertCount: 1 }] };
  renderTab(user);
  fireEvent.change(screen.getByPlaceholderText(/search friends/i), { target: { value: 'zzz' } });
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
