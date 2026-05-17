import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ConcertContext } from '../../../utils/GlobalState';
import { GET_CONCERT_BY_ID } from '../../../utils/queries';
import FriendsGoing from './index';

const CONCERT_ID = 'c1';

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
  no: [],
  maybe: [],
};

const makeQueryMock = (yes = []) => ({
  request: { query: GET_CONCERT_BY_ID, variables: { concertId: CONCERT_ID } },
  result: { data: { concert: { ...concertBase, yes } } },
});

const makeContext = (friends = []) => ({
  user: { me: { _id: 'user123', friends } },
});

const renderComponent = (mocks, context) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ConcertContext.Provider value={context}>
        <FriendsGoing concertId={CONCERT_ID} />
      </ConcertContext.Provider>
    </MockedProvider>
  );

test('renders nothing when no friends are going', async () => {
  renderComponent(
    [makeQueryMock([{ _id: 'u1', username: 'alice' }])],
    makeContext([])
  );
  await new Promise(r => setTimeout(r, 200));
  expect(screen.queryByText(/friends going/i)).not.toBeInTheDocument();
});

test('renders nothing when friends exist but none RSVPd yes', async () => {
  renderComponent(
    [makeQueryMock([])],
    makeContext([{ _id: 'friend1', username: 'alice' }])
  );
  await new Promise(r => setTimeout(r, 200));
  expect(screen.queryByText(/friends going/i)).not.toBeInTheDocument();
});

test('renders FRIENDS GOING label when a friend has RSVPd yes', async () => {
  renderComponent(
    [makeQueryMock([{ _id: 'friend1', username: 'alice rock' }])],
    makeContext([{ _id: 'friend1', username: 'alice rock' }])
  );
  expect(await screen.findByText(/friends going/i)).toBeInTheDocument();
});

test('shows correct initials for multi-word username', async () => {
  renderComponent(
    [makeQueryMock([{ _id: 'friend1', username: 'alice rock' }])],
    makeContext([{ _id: 'friend1', username: 'alice rock' }])
  );
  expect(await screen.findByText('AR')).toBeInTheDocument();
});

test('shows correct initials for single-word username', async () => {
  renderComponent(
    [makeQueryMock([{ _id: 'friend1', username: 'jo' }])],
    makeContext([{ _id: 'friend1', username: 'jo' }])
  );
  expect(await screen.findByText('JO')).toBeInTheDocument();
});

test('shows friend count in header', async () => {
  renderComponent(
    [makeQueryMock([{ _id: 'friend1', username: 'alice' }])],
    makeContext([{ _id: 'friend1', username: 'alice' }])
  );
  expect(await screen.findByText('1')).toBeInTheDocument();
  expect(await screen.findByText(/of your friends/i)).toBeInTheDocument();
});

test('shows overflow pill when more than 4 friends going', async () => {
  const friends = [
    { _id: 'f1', username: 'alice' },
    { _id: 'f2', username: 'bob' },
    { _id: 'f3', username: 'carol' },
    { _id: 'f4', username: 'dave' },
    { _id: 'f5', username: 'eve' },
  ];
  renderComponent([makeQueryMock(friends)], makeContext(friends));
  expect(await screen.findByText('+1')).toBeInTheDocument();
});

test('does not show non-friend RSVPs in avatars', async () => {
  renderComponent(
    [makeQueryMock([
      { _id: 'friend1', username: 'alice' },
      { _id: 'stranger1', username: 'bob' },
    ])],
    makeContext([{ _id: 'friend1', username: 'alice' }])
  );
  expect(await screen.findByText('AL')).toBeInTheDocument();
  expect(screen.queryByText('BO')).not.toBeInTheDocument();
});
