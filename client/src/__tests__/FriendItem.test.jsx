import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FriendItem from '../components/Friends/FriendItem';

const friend = { _id: 'f1', username: 'bob', concertCount: 3 };

const setMatch = (matches) => {
  window.matchMedia = (query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
};

const renderItem = (props = {}) =>
  render(
    <MemoryRouter>
      <FriendItem
        friend={friend}
        open={false}
        setOpen={() => {}}
        onRemove={props.onRemove || (() => {})}
        onBlock={props.onBlock || (() => {})}
      />
    </MemoryRouter>
  );

describe('FriendItem (desktop)', () => {
  beforeEach(() => setMatch(false));

  test('renders View / Remove / Block controls', () => {
    renderItem();
    expect(screen.getByTitle('View profile')).toBeInTheDocument();
    expect(screen.getByTitle('Remove friend')).toBeInTheDocument();
    expect(screen.getByTitle('Block')).toBeInTheDocument();
  });

  test('Remove fires onRemove', () => {
    const onRemove = jest.fn();
    renderItem({ onRemove });
    fireEvent.click(screen.getByTitle('Remove friend'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

describe('FriendItem (mobile)', () => {
  beforeEach(() => setMatch(true));

  test('name/avatar link points at the friend profile', () => {
    renderItem();
    expect(screen.getByRole('link', { name: /bob/ })).toHaveAttribute('href', '/profile/bob');
  });

  test('Block chip fires onBlock', () => {
    const onBlock = jest.fn();
    renderItem({ onBlock });
    fireEvent.click(screen.getByTitle('Block'));
    expect(onBlock).toHaveBeenCalledTimes(1);
  });
});
