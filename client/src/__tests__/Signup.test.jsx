import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import Signup from '../pages/LoginSignup/Signup';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

jest.mock('../utils/auth', () => ({ login: jest.fn() }));

const successMock = {
  request: {
    query: ADD_USER,
    variables: { username: 'cooluser', email: 'test@example.com', password: 'Password1!' },
  },
  result: { data: { addUser: { token: 'tok' } } },
};

const renderSignup = (mocks = []) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    </MockedProvider>
  );

test('submit is disabled when fields are empty', () => {
  renderSignup();
  expect(screen.getByRole('button', { name: /create account/i })).toBeDisabled();
});

test('shows password strength meter when password is typed', () => {
  renderSignup();
  fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), {
    target: { value: 'pass' },
  });
  expect(screen.getByText(/password strength/i)).toBeInTheDocument();
});

test('shows Strong label for a strong password', () => {
  renderSignup();
  fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), {
    target: { value: 'Password1!' },
  });
  expect(screen.getByText('Password strength: Strong')).toBeInTheDocument();
});

test('submit is enabled when all fields are valid', () => {
  renderSignup();
  fireEvent.change(screen.getByPlaceholderText('your_username'), {
    target: { value: 'cooluser' },
  });
  fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), {
    target: { value: 'Password1!' },
  });
  expect(screen.getByRole('button', { name: /create account/i })).not.toBeDisabled();
});

test('calls Auth.login with token on successful signup', async () => {
  renderSignup([successMock]);
  fireEvent.change(screen.getByPlaceholderText('your_username'), {
    target: { value: 'cooluser' },
  });
  fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), {
    target: { value: 'Password1!' },
  });
  fireEvent.click(screen.getByRole('button', { name: /create account/i }));
  await waitFor(() => expect(Auth.login).toHaveBeenCalledWith('tok'));
});

test('shows link to login page', () => {
  renderSignup();
  expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
});
