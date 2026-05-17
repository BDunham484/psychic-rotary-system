import { render, screen, fireEvent } from '@testing-library/react';
import ControlBar from './ControlBar';

test('renders sort buttons', () => {
  render(<ControlBar mode="venue" isAsc={true} onSort={() => {}} count={10} />);
  expect(screen.getByText('Venue')).toBeInTheDocument();
  expect(screen.getByText('Artist')).toBeInTheDocument();
  expect(screen.getByText('Search')).toBeInTheDocument();
});

test('calls onSort with correct key', () => {
  const onSort = jest.fn();
  render(<ControlBar mode="venue" isAsc={true} onSort={onSort} count={10} />);
  fireEvent.click(screen.getByText('Artist'));
  expect(onSort).toHaveBeenCalledWith('artist');
});

test('shows result count', () => {
  render(<ControlBar mode="venue" isAsc={true} onSort={() => {}} count={7} />);
  expect(screen.getByText('7')).toBeInTheDocument();
  expect(screen.getByText('results')).toBeInTheDocument();
});
