import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import ProfileHero from '../components/Profile/ProfileHero';

const user = { _id: 'u1', username: 'alice', concertCount: 5, friendCount: 3 };

const renderHero = (props) =>
  render(
    <MockedProvider>
      <MemoryRouter>
        <ProfileHero {...props} />
      </MemoryRouter>
    </MockedProvider>
  );

test('renders username', () => {
  renderHero({ user, isSelf: true, friendship: 'none' });
  expect(screen.getByText('alice')).toBeInTheDocument();
});

test('shows no action buttons on own profile', () => {
  renderHero({ user, isSelf: true, friendship: 'none' });
  expect(screen.queryByText('Add Friend')).not.toBeInTheDocument();
});

test('shows Add Friend when friendship is none', () => {
  renderHero({ user, isSelf: false, friendship: 'none' });
  expect(screen.getByText('Add Friend')).toBeInTheDocument();
});

test('shows Request Sent when friendship is requested', () => {
  renderHero({ user, isSelf: false, friendship: 'requested' });
  expect(screen.getByText('Request Sent')).toBeInTheDocument();
});

test('shows Remove when friendship is friend', () => {
  renderHero({ user, isSelf: false, friendship: 'friend' });
  expect(screen.getByText('Remove')).toBeInTheDocument();
});

test('shows Block button when not blocked', () => {
  renderHero({ user, isSelf: false, friendship: 'none' });
  expect(screen.getByText('Block')).toBeInTheDocument();
});

test('shows Unblock button when blocked', () => {
  renderHero({ user, isSelf: false, friendship: 'blocked' });
  expect(screen.getByText('Unblock')).toBeInTheDocument();
});
