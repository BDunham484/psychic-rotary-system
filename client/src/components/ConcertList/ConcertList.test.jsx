import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import ConcertList from './ConcertList';
import { ConcertContext } from '../../utils/GlobalState';

const mockUser = { me: { _id: '1', username: 'test', isAdmin: false, concerts: [] } };
const mockContext = { user: mockUser };

const wrap = (ui) => (
  <MockedProvider>
    <ConcertContext.Provider value={mockContext}>
      <MemoryRouter>{ui}</MemoryRouter>
    </ConcertContext.Provider>
  </MockedProvider>
);

test('shows empty state when no concerts', () => {
  render(wrap(<ConcertList concerts={[]} />));
  expect(screen.getByText('No shows for this day')).toBeInTheDocument();
});

test('renders artist name', () => {
  const concerts = [{
    _id: '1', artists: 'Black Pumas', customId: 'bp-123',
    venue: 'ACL Live', times: '8:00 PM', yes: [], maybe: []
  }];
  render(wrap(<ConcertList concerts={concerts} />));
  expect(screen.getByText('Black Pumas')).toBeInTheDocument();
});

test('renders venue name', () => {
  const concerts = [{
    _id: '1', artists: 'Wild Child', customId: 'wc-123',
    venue: 'The Parish', times: '7:30 PM', yes: [], maybe: []
  }];
  render(wrap(<ConcertList concerts={concerts} />));
  expect(screen.getByText('The Parish')).toBeInTheDocument();
});
