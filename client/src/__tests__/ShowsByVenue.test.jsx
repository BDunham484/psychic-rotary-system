import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ShowsByVenue from '../components/ShowsByVenue/ShowsByVenue';
import { GET_CONCERTS_BY_VENUE } from '../utils/queries';

const MOCK_CONCERTS = [
  {
    _id: '1',
    customId: { headliner: 'The Strokes', date: '20260615', venue: "Emos" },
    artists: 'The Strokes',
    date: '2026-06-15T00:00:00.000Z',
    times: '8:00 PM',
    venue: "Emo's",
  },
  {
    _id: '2',
    customId: { headliner: 'Spoon', date: '20260704', venue: "Emos" },
    artists: 'Spoon',
    date: '2026-07-04T00:00:00.000Z',
    times: '9:00 PM',
    venue: "Emo's",
  },
];

const makeVenueMock = (venue, concerts) => ({
  request: { query: GET_CONCERTS_BY_VENUE, variables: { venue } },
  result: { data: { concertsByVenue: concerts } },
});

const renderShowsByVenue = (venueName = "Emo's", mocks) =>
  render(
    <MockedProvider mocks={mocks || [makeVenueMock(venueName, MOCK_CONCERTS)]} addTypename={false}>
      <MemoryRouter initialEntries={[{ pathname: `/venue/${encodeURIComponent(venueName)}`, state: { venueName } }]}>
        <Routes>
          <Route path="/venue/:venueName" element={<ShowsByVenue />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );

describe('ShowsByVenue', () => {
  it('renders venue name in hero', async () => {
    renderShowsByVenue();
    expect(await screen.findByRole('heading', { name: /Emo's/i })).toBeInTheDocument();
  });

  it('renders concert artist names', async () => {
    renderShowsByVenue();
    expect(await screen.findByText('The Strokes')).toBeInTheDocument();
    expect(screen.getByText('Spoon')).toBeInTheDocument();
  });

  it('shows upcoming show count in hero', async () => {
    renderShowsByVenue();
    await screen.findByText('The Strokes');
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows empty state when no concerts', async () => {
    renderShowsByVenue("Emo's", [makeVenueMock("Emo's", [])]);
    expect(await screen.findByText('No upcoming shows')).toBeInTheDocument();
  });

  it('falls back to URL param when no location state', async () => {
    const venue = "Emo's";
    render(
      <MockedProvider mocks={[makeVenueMock(venue, MOCK_CONCERTS)]} addTypename={false}>
        <MemoryRouter initialEntries={[`/venue/${encodeURIComponent(venue)}`]}>
          <Routes>
            <Route path="/venue/:venueName" element={<ShowsByVenue />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );
    expect(await screen.findByText('The Strokes')).toBeInTheDocument();
  });
});
