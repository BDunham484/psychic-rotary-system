import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ConcertContext } from '../utils/GlobalState';
import { CONCERT_BY_CUSTOM_ID } from '../utils/queries';

jest.mock('../utils/auth', () => ({
  loggedIn: () => false,
}));

import Show from './Show';

const mockContext = { user: { me: { _id: 'user123' } } };

const concert = {
  _id: 'c1',
  artists: 'Test Artist',
  artistsLink: null,
  description: 'An evening of loud guitars and questionable decisions.',
  venue: 'Test Venue',
  date: '2026-05-17T00:00:00.000Z',
  times: '8:00 PM',
  address: '123 Main St',
  address2: null,
  phone: null,
  email: null,
  website: null,
  ticketLink: null,
  ticketPrice: null,
  customId: { headliner: 'testartist', date: '20260517', venue: 'testvenue', times: '2000' },
  yes: [],
  no: [],
  maybe: [],
};

// 4-segment path matching concert.customId; times="2000"
const PATH = '/show/testartist/20260517/testvenue/2000';

const customIdMock = (result) => ({
  request: {
    query: CONCERT_BY_CUSTOM_ID,
    variables: { headliner: 'testartist', date: '20260517', venue: 'testvenue', times: '2000' },
  },
  result: { data: { concertByCustomId: result } },
});

const renderShow = ({ state = { concert }, mocks = [] } = {}) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ConcertContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: PATH, state }]}>
          <Routes>
            <Route path="/show/:headliner/:date/:venue/:times" element={<Show />} />
            <Route path="/show/:headliner/:date/:venue" element={<Show />} />
          </Routes>
        </MemoryRouter>
      </ConcertContext.Provider>
    </MockedProvider>
  );

test('renders from router state without firing the query', () => {
  renderShow({ state: { concert }, mocks: [] }); // empty mocks: if a query fired, Apollo would warn/error
  expect(screen.getByRole('heading', { level: 1, name: /test artist/i })).toBeInTheDocument();
  expect(screen.getByText('Test Venue')).toBeInTheDocument();
  expect(screen.getByText('123 Main St')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
});

test('renders the description in an About section when present', () => {
  renderShow({ state: { concert }, mocks: [] });
  expect(screen.getByText('About')).toBeInTheDocument();
  expect(screen.getByText(/questionable decisions/i)).toBeInTheDocument();
});

test('omits the About section when there is no description', () => {
  renderShow({ state: { concert: { ...concert, description: null } }, mocks: [] });
  expect(screen.queryByText('About')).not.toBeInTheDocument();
});

test('shows a loading state when there is no state and the query is in flight', () => {
  renderShow({ state: null, mocks: [customIdMock(concert)] });
  expect(screen.getByText(/loading show/i)).toBeInTheDocument();
});

test('renders from the concertByCustomId query when state is absent', async () => {
  renderShow({ state: null, mocks: [customIdMock(concert)] });
  expect(await screen.findByRole('heading', { level: 1, name: /test artist/i })).toBeInTheDocument();
  expect(screen.getByText('Test Venue')).toBeInTheDocument();
});

test('renders "Show not found" when the query resolves null', async () => {
  renderShow({ state: null, mocks: [customIdMock(null)] });
  expect(await screen.findByText('Show not found.')).toBeInTheDocument();
});
