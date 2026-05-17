import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/LoginSignup/Login';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

jest.mock('../utils/auth', () => ({ login: jest.fn() }));

const successMock = {
  request: {
    query: LOGIN_USER,
    variables: { email: 'test@example.com', password: 'pass123' },
  },
  result: { data: { login: { token: 'tok' } } },
};

const errorMock = {
  request: {
    query: LOGIN_USER,
    variables: { email: 'test@example.com', password: 'wrong' },
  },
  error: new Error('Invalid credentials'),
};

const renderLogin = (mocks = []) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </MockedProvider>
  );

test('submit is disabled when fields are empty', () => {
  renderLogin();
  expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
});

test('submit is enabled when email is valid and password is non-empty', () => {
  renderLogin();
  fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('Your password'), {
    target: { value: 'pass123' },
  });
  expect(screen.getByRole('button', { name: /sign in/i })).not.toBeDisabled();
});

test('calls Auth.login with token on successful login', async () => {
  renderLogin([successMock]);
  fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('Your password'), {
    target: { value: 'pass123' },
  });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  await waitFor(() => expect(Auth.login).toHaveBeenCalledWith('tok'));
});

test('shows error banner on login failure', async () => {
  renderLogin([errorMock]);
  fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('Your password'), {
    target: { value: 'wrong' },
  });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  await waitFor(() =>
    expect(screen.getByText('Email or password is incorrect.')).toBeInTheDocument()
  );
});

test('shows link to signup page', () => {
  renderLogin();
  expect(screen.getByRole('link', { name: /create an account/i })).toBeInTheDocument();
});
