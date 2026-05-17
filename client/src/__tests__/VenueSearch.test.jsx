import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import VenueSearch from '../components/VenueSearch/VenueSearch';
import { GET_ALL_VENUES } from '../utils/queries';

const VENUES_MOCK = {
  request: { query: GET_ALL_VENUES },
  result: { data: { allVenues: ["Emo's", 'Parish', 'The Paramount', 'ACL Live'] } },
};

const LOADING_MOCK = {
  request: { query: GET_ALL_VENUES },
  delay: Infinity,
};

const renderVenueSearch = (mocks = [VENUES_MOCK]) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter>
        <VenueSearch />
      </MemoryRouter>
    </MockedProvider>
  );

describe('VenueSearch', () => {
  it('shows spinner while loading', () => {
    renderVenueSearch([LOADING_MOCK]);
    expect(screen.getByAltText('Loading...')).toBeInTheDocument();
  });

  it('renders venue cards after data loads', async () => {
    renderVenueSearch();
    expect(await screen.findByText("Emo's")).toBeInTheDocument();
    expect(screen.getByText('Parish')).toBeInTheDocument();
  });

  it('shows total venue count', async () => {
    renderVenueSearch();
    await screen.findByText("Emo's");
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('filters venues as user types', async () => {
    renderVenueSearch();
    await screen.findByText("Emo's");
    fireEvent.change(screen.getByPlaceholderText(/search by venue name/i), {
      target: { value: 'par' },
    });
    // "Emo's" and "ACL Live" don't match "par" — should be gone
    expect(screen.queryByText("Emo's")).not.toBeInTheDocument();
    expect(screen.queryByText('ACL Live')).not.toBeInTheDocument();
    // count should update to reflect matching venues
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows empty state when query has no matches', async () => {
    renderVenueSearch();
    await screen.findByText("Emo's");
    fireEvent.change(screen.getByPlaceholderText(/search by venue name/i), {
      target: { value: 'zzz' },
    });
    expect(screen.getByText('No matches')).toBeInTheDocument();
  });

  it('clears search when X button clicked', async () => {
    renderVenueSearch();
    await screen.findByText("Emo's");
    const input = screen.getByPlaceholderText(/search by venue name/i);
    fireEvent.change(input, { target: { value: 'par' } });
    fireEvent.click(screen.getByLabelText('Clear search'));
    expect(screen.getByText("Emo's")).toBeInTheDocument();
  });
});
