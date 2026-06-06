import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ConcertContext } from '../../../utils/GlobalState';
import { GET_CONCERT_BY_ID } from '../../../utils/queries';
import {
  RSVP_YES,
  RSVP_NO,
  RSVP_MAYBE,
  CLEAR_RSVP,
  ADD_CONCERT_TO_USER,
  DELETE_CONCERT_FROM_USER,
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

test('calls RSVP_YES and adds concert to user when Yes clicked and not already RSVPd', async () => {
  let rsvpCalled = false;
  let addCalled = false;
  const mocks = [
    makeQueryMock(),
    {
      request: { query: RSVP_YES, variables: { concertId: CONCERT_ID, userId: USER_ID } },
      result: () => { rsvpCalled = true; return { data: { rsvpYes: { _id: CONCERT_ID, artists: 'Test Artist', yes: [{ _id: USER_ID }] } } }; },
    },
    {
      request: { query: ADD_CONCERT_TO_USER, variables: { concertId: CONCERT_ID } },
      result: () => { addCalled = true; return { data: { addConcertToUser: { concerts: [{ _id: CONCERT_ID }] } } }; },
    },
  ];
  renderComponent(mocks);
  fireEvent.click(await screen.findByText('Yes'));
  await waitFor(() => expect(rsvpCalled).toBe(true));
  await waitFor(() => expect(addCalled).toBe(true));
});

test('clears RSVP and removes concert from user when active Yes clicked again', async () => {
  let clearCalled = false;
  let deleteCalled = false;
  const mocks = [
    makeQueryMock([{ _id: USER_ID }], [], []),
    {
      request: { query: CLEAR_RSVP, variables: { concertId: CONCERT_ID, userId: USER_ID } },
      result: () => { clearCalled = true; return { data: { clearRsvp: { _id: CONCERT_ID, artists: 'Test Artist', yes: [], no: [], maybe: [] } } }; },
    },
    {
      request: { query: DELETE_CONCERT_FROM_USER, variables: { concertId: CONCERT_ID } },
      result: () => { deleteCalled = true; return { data: { deleteConcertFromUser: { _id: USER_ID, username: 'tester', email: 't@t.co', concertCount: 0, concerts: [] } } }; },
    },
  ];
  renderComponent(mocks);
  // Wait for query to resolve so myRSVP is 'yes' before clicking
  await screen.findByText('1 person');
  fireEvent.click(screen.getByText('Yes'));
  await waitFor(() => expect(clearCalled).toBe(true));
  await waitFor(() => expect(deleteCalled).toBe(true));
});

test('calls RSVP_NO and adds concert to user when switching from Yes to No', async () => {
  let rsvpCalled = false;
  let addCalled = false;
  const mocks = [
    makeQueryMock([{ _id: USER_ID }], [], []),
    {
      request: { query: RSVP_NO, variables: { concertId: CONCERT_ID, userId: USER_ID } },
      result: () => { rsvpCalled = true; return { data: { rsvpNo: { _id: CONCERT_ID, artists: 'Test Artist', no: [{ _id: USER_ID }] } } }; },
    },
    {
      request: { query: ADD_CONCERT_TO_USER, variables: { concertId: CONCERT_ID } },
      result: () => { addCalled = true; return { data: { addConcertToUser: { concerts: [{ _id: CONCERT_ID }] } } }; },
    },
  ];
  renderComponent(mocks);
  // Wait for query to resolve before clicking
  await screen.findByText('1 person');
  fireEvent.click(screen.getByText('No'));
  await waitFor(() => expect(rsvpCalled).toBe(true));
  await waitFor(() => expect(addCalled).toBe(true));
});
