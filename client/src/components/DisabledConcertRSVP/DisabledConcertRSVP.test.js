import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { GET_CONCERT_BY_ID } from '../../utils/queries';
import DisabledConcertRSVP from './index';

const mocks = [
  {
    request: { query: GET_CONCERT_BY_ID, variables: { concertId: 'c1' } },
    result: {
      data: {
        concert: {
          _id: 'c1',
          customId: 'x',
          artists: 'Test Artist',
          artistsLink: '',
          date: '2026-05-17T00:00:00.000Z',
          times: '8pm',
          venue: 'Test Venue',
          address: '123 Main St',
          phone: '',
          website: '',
          email: '',
          ticketLink: '',
          yes:   [{ _id: 'u1' }, { _id: 'u2' }],
          no:    [{ _id: 'u3' }],
          maybe: [],
        },
      },
    },
  },
];

const renderComponent = () =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter>
        <DisabledConcertRSVP concertId="c1" />
      </MemoryRouter>
    </MockedProvider>
  );

test('renders yes/no/maybe count labels', async () => {
  renderComponent();
  expect(await screen.findByText('Yes')).toBeInTheDocument();
  expect(screen.getByText('No')).toBeInTheDocument();
  expect(screen.getByText('Maybe')).toBeInTheDocument();
});

test('renders yes count from query', async () => {
  renderComponent();
  expect(await screen.findByText('2')).toBeInTheDocument();
});

test('renders login CTA link', async () => {
  renderComponent();
  const link = await screen.findByRole('link', { name: /log in to rsvp/i });
  expect(link).toHaveAttribute('href', '/login');
});
