import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConcertContext } from '../utils/GlobalState';
import { ThemeProvider } from '../utils/ThemeContext';
import Header from '../components/Header';

jest.mock('../utils/auth', () => ({ loggedIn: () => false }));

beforeEach(() => {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
});

const ctx = {
  today: '2024-01-01T00:00:00.000Z',
  setDate: jest.fn(),
  setSortOrSearch: jest.fn(),
};

const renderHeader = () =>
  render(
    <ThemeProvider>
      <ConcertContext.Provider value={ctx}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ConcertContext.Provider>
    </ThemeProvider>
  );

test('renders NOISEBOX wordmark', () => {
  renderHeader();
  expect(screen.getByText('NOISEBOX')).toBeInTheDocument();
});

test('does not render NBX abbreviation', () => {
  renderHeader();
  expect(screen.queryByText('NBX')).not.toBeInTheDocument();
});
