import { render, screen } from '@testing-library/react';
import DateNav from './DateNav';

const today = new Date();
today.setHours(0, 0, 0, 0);

test('shows TODAY label for current date', () => {
  render(<DateNav date={today.toISOString()} setDate={() => {}} total={5} />);
  expect(screen.getByText('TODAY')).toBeInTheDocument();
});

test('shows show count', () => {
  render(<DateNav date={today.toISOString()} setDate={() => {}} total={12} />);
  expect(screen.getByText(/12 shows/)).toBeInTheDocument();
});

test('shows TOMORROW label for next day', () => {
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  render(<DateNav date={tomorrow.toISOString()} setDate={() => {}} total={0} />);
  expect(screen.getByText('TOMORROW')).toBeInTheDocument();
});
