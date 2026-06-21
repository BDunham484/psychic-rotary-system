import { render, screen, fireEvent } from '@testing-library/react';
import SwipeRow from '../components/shared/SwipeRow/SwipeRow';

test('renders children and the action chips', () => {
  render(
    <SwipeRow
      actions={[{ kind: 'danger', label: 'Remove', title: 'Remove friend', onClick: () => {} }]}
      open={false}
      setOpen={() => {}}
    >
      <div>Bob</div>
    </SwipeRow>
  );
  expect(screen.getByText('Bob')).toBeInTheDocument();
  // title is used explicitly here ("Remove friend")
  expect(screen.getByTitle('Remove friend')).toBeInTheDocument();
});

test('a chip fires its onClick when clicked', () => {
  const onClick = jest.fn();
  render(
    <SwipeRow
      actions={[{ kind: 'success', label: 'Accept', onClick }]}
      open={false}
      setOpen={() => {}}
    >
      <div>Carol</div>
    </SwipeRow>
  );
  // title defaults to label ("Accept") when title is omitted
  fireEvent.click(screen.getByTitle('Accept'));
  expect(onClick).toHaveBeenCalledTimes(1);
});
