import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import ConcertsList from '../components/Profile/ConcertsList';

const renderList = (user, isSelf = true) =>
  render(
    <MockedProvider>
      <MemoryRouter>
        <ConcertsList user={user} isSelf={isSelf} />
      </MemoryRouter>
    </MockedProvider>
  );

test('shows own empty state when no concerts and isSelf', () => {
  renderList({ username: 'alice', concerts: [] }, true);
  expect(screen.getByText('No saved concerts yet')).toBeInTheDocument();
});

test('shows other empty state when no concerts and not isSelf', () => {
  renderList({ username: 'alice', concerts: [] }, false);
  expect(screen.getByText('alice has no saved concerts')).toBeInTheDocument();
});

test('renders concert artist name', () => {
  const concerts = [
    { _id: 'c1', customId: { headliner: 'The Midnight', date: '20260601', venue: "Stubbs" }, artists: 'The Midnight', date: '2026-06-01T00:00:00.000Z', venue: "Stubb's" }
  ];
  renderList({ username: 'alice', concerts }, true);
  expect(screen.getByText('The Midnight')).toBeInTheDocument();
});

test('renders venue name', () => {
  const concerts = [
    { _id: 'c1', customId: { headliner: 'The Midnight', date: '20260601', venue: "Stubbs" }, artists: 'The Midnight', date: '2026-06-01T00:00:00.000Z', venue: "Stubb's" }
  ];
  renderList({ username: 'alice', concerts }, true);
  expect(screen.getByText("Stubb's")).toBeInTheDocument();
});
