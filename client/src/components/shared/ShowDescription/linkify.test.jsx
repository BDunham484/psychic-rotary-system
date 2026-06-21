import React from 'react';
import { render } from '@testing-library/react';
import { linkifyDescription } from './linkify';

const renderNodes = (text) => render(<p>{linkifyDescription(text)}</p>);

test('renders a token as an anchor with safe attributes', () => {
    const { getByRole } = renderNodes('Stay here. [Get a room.](https://example.com/book) Thanks.');
    const link = getByRole('link', { name: 'Get a room.' });
    expect(link).toHaveAttribute('href', 'https://example.com/book');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});

test('keeps the surrounding text around a token', () => {
    const { container } = renderNodes('Before [x](https://e.com) after');
    expect(container.textContent).toBe('Before x after');
});

test('renders plain text unchanged when there are no tokens', () => {
    const { container } = renderNodes('Just a plain blurb.');
    expect(container.textContent).toBe('Just a plain blurb.');
    expect(container.querySelector('a')).toBeNull();
});

test('does not link a non-whitelisted scheme token', () => {
    const { container } = renderNodes('Click [here](javascript:alert(1))');
    expect(container.querySelector('a')).toBeNull();
    expect(container.textContent).toContain('[here](javascript:alert(1))');
});

test('renders a mailto token as a link', () => {
    const { getByRole } = renderNodes('Email [us](mailto:hi@cmw.com)');
    expect(getByRole('link', { name: 'us' })).toHaveAttribute('href', 'mailto:hi@cmw.com');
});

test('renders multiple tokens in one string', () => {
    const { getAllByRole } = renderNodes('[a](https://a.com) and [b](https://b.com)');
    expect(getAllByRole('link')).toHaveLength(2);
});
