import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ConcertContext } from '../utils/GlobalState';

jest.mock('../utils/auth', () => ({
  loggedIn: () => false,
}));

import Show from './Show';

const mockContext = { user: { me: { _id: 'user123' } } };

const concert = {
  _id: 'c1',
  artists: 'Test Artist',
  venue: 'Test Venue',
  date: '2026-05-17T00:00:00.000Z',
  times: '8pm',
  address: '123 Main St',
  address2: null,
  phone: null,
  email: null,
  website: null,
  ticketLink: null,
};

const renderShow = (state = { concert }) =>
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <ConcertContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/show/test', state }]}>
          <Routes>
            <Route path="/show/:artists" element={<Show />} />
          </Routes>
        </MemoryRouter>
      </ConcertContext.Provider>
    </MockedProvider>
  );

test('renders "Show not found" when no concert in state', () => {
  renderShow(null);
  expect(screen.getByText('Show not found.')).toBeInTheDocument();
});

test('renders artist name in hero', () => {
  renderShow();
  expect(screen.getByRole('heading', { level: 1, name: /test artist/i })).toBeInTheDocument();
});

test('renders venue name', () => {
  renderShow();
  expect(screen.getByText('Test Venue')).toBeInTheDocument();
});

test('renders Back button', () => {
  renderShow();
  expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
});

test('renders address in details', () => {
  renderShow();
  expect(screen.getByText('123 Main St')).toBeInTheDocument();
});
