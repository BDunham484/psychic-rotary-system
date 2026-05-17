import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ConcertContext } from '../../../utils/GlobalState';
import { GET_CONCERT_BY_ID } from '../../../utils/queries';
import {
  RSVP_YES, CANCEL_RSVP_YES,
  RSVP_NO,
  RSVP_MAYBE,
} from '../../../utils/mutations';
import ConcertRSVP from './index';

const USER_ID = 'user123';
const CONCERT_ID = 'c1';

const mockContext = { user: { me: { _id: USER_ID } } };

const concertBase = {
  _id: CONCERT_ID,
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
};

const makeQueryMock = (yes = [], no = [], maybe = []) => ({
  request: { query: GET_CONCERT_BY_ID, variables: { concertId: CONCERT_ID } },
  result: { data: { concert: { ...concertBase, yes, no, maybe } } },
});

const renderComponent = (mocks) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ConcertContext.Provider value={mockContext}>
        <ConcertRSVP concertId={CONCERT_ID} />
      </ConcertContext.Provider>
    </MockedProvider>
  );

test('renders Yes, Maybe, No option cards', async () => {
  renderComponent([makeQueryMock()]);
  expect(await screen.findByText('Yes')).toBeInTheDocument();
  expect(screen.getByText('Maybe')).toBeInTheDocument();
  expect(screen.getByText('No')).toBeInTheDocument();
});

test('shows count for each option', async () => {
  renderComponent([makeQueryMock(
    [{ _id: 'u1' }, { _id: 'u2' }],
    [{ _id: 'u3' }],
    []
  )]);
  expect(await screen.findByText('2 people')).toBeInTheDocument();
  expect(screen.getByText('1 person')).toBeInTheDocument();
  expect(screen.getByText('0 people')).toBeInTheDocument();
});

test('calls RSVP_YES mutation when Yes card clicked and not already RSVPd', async () => {
  let mutationCalled = false;
  const mocks = [
    makeQueryMock(),
    {
      request: { query: RSVP_YES, variables: { concertId: CONCERT_ID, userId: USER_ID } },
      result: () => { mutationCalled = true; return { data: { rsvpYes: { _id: CONCERT_ID, artists: 'Test Artist', yes: [{ _id: USER_ID }] } } }; },
    },
  ];
  renderComponent(mocks);
  fireEvent.click(await screen.findByText('Yes'));
  await waitFor(() => expect(mutationCalled).toBe(true));
});

test('calls CANCEL_RSVP_YES when Yes card clicked and already RSVPd Yes', async () => {
  let mutationCalled = false;
  const mocks = [
    makeQueryMock([{ _id: USER_ID }], [], []),
    {
      request: { query: CANCEL_RSVP_YES, variables: { concertId: CONCERT_ID, userId: USER_ID } },
      result: () => { mutationCalled = true; return { data: { cancelRsvpYes: { _id: CONCERT_ID, artists: 'Test Artist', yes: [] } } }; },
    },
  ];
  renderComponent(mocks);
  // Wait for query to resolve so myRSVP is 'yes' before clicking
  await screen.findByText('1 person');
  fireEvent.click(screen.getByText('Yes'));
  await waitFor(() => expect(mutationCalled).toBe(true));
});

test('calls RSVP_NO when switching from Yes to No', async () => {
  let mutationCalled = false;
  const mocks = [
    makeQueryMock([{ _id: USER_ID }], [], []),
    {
      request: { query: RSVP_NO, variables: { concertId: CONCERT_ID, userId: USER_ID } },
      result: () => { mutationCalled = true; return { data: { rsvpNo: { _id: CONCERT_ID, artists: 'Test Artist', no: [{ _id: USER_ID }] } } }; },
    },
  ];
  renderComponent(mocks);
  // Wait for query to resolve before clicking
  await screen.findByText('1 person');
  fireEvent.click(screen.getByText('No'));
  await waitFor(() => expect(mutationCalled).toBe(true));
});
