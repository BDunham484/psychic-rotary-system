import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShowDescription from './index';

// jsdom has no layout engine, so scrollHeight/clientHeight are always 0. These helpers let us
// simulate "the clamped text overflows" (long blurb) vs "it fits" (short blurb).
const mockLayout = ({ scrollHeight, clientHeight }) => {
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, get: () => scrollHeight });
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, get: () => clientHeight });
};

afterEach(() => {
  delete HTMLElement.prototype.scrollHeight;
  delete HTMLElement.prototype.clientHeight;
});

test('renders the About label and the text when a description is provided', () => {
  render(<ShowDescription text="Doors at 8pm. $10 cover." />);
  expect(screen.getByText('About')).toBeInTheDocument();
  expect(screen.getByText(/doors at 8pm/i)).toBeInTheDocument();
});

test.each([['', 'empty string'], ['   \n  ', 'whitespace only'], [null, 'null'], [undefined, 'undefined']])(
  'renders nothing when text is %s (%s)',
  (value) => {
    const { container } = render(<ShowDescription text={value} />);
    expect(container).toBeEmptyDOMElement();
  }
);

test('does not show a toggle when the text fits (no overflow)', () => {
  mockLayout({ scrollHeight: 40, clientHeight: 40 });
  render(<ShowDescription text="Short blurb that fits." />);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('shows a Read more toggle when the clamped text overflows, and toggles it', () => {
  mockLayout({ scrollHeight: 1000, clientHeight: 80 });
  render(<ShowDescription text={'A very long blurb. '.repeat(80)} />);

  const toggle = screen.getByRole('button', { name: /read more/i });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');

  userEvent.click(toggle);
  expect(screen.getByRole('button', { name: /read less/i })).toHaveAttribute('aria-expanded', 'true');

  userEvent.click(screen.getByRole('button', { name: /read less/i }));
  expect(screen.getByRole('button', { name: /read more/i })).toHaveAttribute('aria-expanded', 'false');
});

test('renders an inline link from a [text](url) token in the description', () => {
  render(<ShowDescription text="Stay nearby. [Get a room.](https://example.com/book)" />);
  const link = screen.getByRole('link', { name: 'Get a room.' });
  expect(link).toHaveAttribute('href', 'https://example.com/book');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});

test('does not create a link for a non-whitelisted scheme token', () => {
  render(<ShowDescription text="Nope [x](javascript:alert(1))" />);
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});
