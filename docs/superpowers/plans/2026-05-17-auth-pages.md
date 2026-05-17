# Auth Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the Login and Signup pages to match the Claude Design auth handoff — shared `AuthShell` card shell, `Auth.module.css`, inline validation with `touched` guards, password strength meter, server error banners, and disabled-submit logic.

**Architecture:** A new `AuthShell` wrapper provides the dot-grid backdrop, radial glow, and card chrome (including the `::before` indigo accent bar) shared by both pages. Both pages are full rewrites that consume `Auth.module.css` via CSS Modules, use `validateEmail()` from the existing `utils/helpers.js`, and call the existing `LOGIN_USER` / `ADD_USER` mutations unchanged. The old `FormCard` component and `LoginSignup.module.css` are deleted after migration. The active `.form-card` rule in `index.css` is removed.

**Tech Stack:** React 18, Apollo Client (`useMutation`), React Router v6 (`Link`), `@testing-library/react`, `MockedProvider`, CSS Modules, `@styled-icons/feather`

---

### Task 1: Write failing Login tests

**Files:**
- Create: `client/src/__tests__/Login.test.jsx`

- [ ] **Step 1: Create the test file**

`client/src/__tests__/Login.test.jsx`:

```jsx
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
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd client && npm test -- --watchAll=false --testPathPattern=Login
```

Expected: 5 failing tests. First failure will be something like:
`Unable to find an accessible element with the role "button" and name matching /sign in/i`
(The current Login button says "Submit".)

---

### Task 2: Write failing Signup tests

**Files:**
- Create: `client/src/__tests__/Signup.test.jsx`

- [ ] **Step 1: Create the test file**

`client/src/__tests__/Signup.test.jsx`:

```jsx
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
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd client && npm test -- --watchAll=false --testPathPattern=Signup
```

Expected: 6 failing tests. First failure:
`Unable to find an accessible element with the role "button" and name matching /create account/i`

- [ ] **Step 3: Commit the failing tests**

```bash
git add client/src/__tests__/Login.test.jsx client/src/__tests__/Signup.test.jsx
git commit -m "test: add failing tests for Login and Signup rewrites"
```

---

### Task 3: Create Auth.module.css

**Files:**
- Create: `client/src/pages/LoginSignup/Auth.module.css`

- [ ] **Step 1: Create the CSS file**

`client/src/pages/LoginSignup/Auth.module.css`:

```css
.page {
  min-height: 100vh;
  padding-top: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* Backdrop */
.grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(160,150,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(160,150,255,0.025) 1px, transparent 1px);
  background-size: 4rem 4rem;
  pointer-events: none;
}
.glow {
  position: absolute;
  width: 60rem; height: 60rem;
  background: radial-gradient(circle, oklch(62% 0.16 275 / 0.1) 0%, transparent 65%);
  border-radius: 50%;
  pointer-events: none;
  left: 50%; top: 50%;
  transform: translate(-50%, -50%);
}

/* Card */
.card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 42rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-mid);
  border-radius: 1.4rem;
  overflow: hidden;
  margin: 4rem 2rem;
  box-shadow:
    0 24px 48px -16px rgba(0,0,0,0.5),
    0 0 0 1px oklch(62% 0.16 275 / 0.05);
}
.card::before {
  content: '';
  display: block; height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
}

.cardHeader { padding: 3.2rem 3.2rem 0; }
.eyebrow {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1rem;
}
.title {
  font-family: var(--font-display);
  font-size: 3.6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: 0.8rem;
}
.sub {
  font-family: var(--font-body);
  font-size: 1.5rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.form {
  padding: 2.8rem 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.field { display: flex; flex-direction: column; gap: 0.7rem; }
.label {
  font-family: var(--font-mono);
  font-size: 1.05rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  display: flex; align-items: center; justify-content: space-between;
}
.labelRequired { color: var(--accent); }

.input {
  width: 100%;
  background: var(--bg-raised);
  border: 1px solid var(--border-mid);
  border-radius: 0.8rem;
  padding: 1.2rem 1.4rem;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 1.55rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}
.input::placeholder { color: var(--text-muted); }
.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px oklch(62% 0.16 275 / 0.12);
  background: var(--bg-overlay);
}
.invalid { border-color: var(--rsvp-no); }
.invalid:focus { box-shadow: 0 0 0 4px oklch(58% 0.14 22 / 0.15); }

.helper {
  font-family: var(--font-mono);
  font-size: 1.05rem;
  color: var(--text-muted);
  letter-spacing: 0.02em;
  display: flex; align-items: center; gap: 0.4rem;
}
.helperError { color: var(--rsvp-no); }
.helperSuccess { color: var(--rsvp-yes); }
.helper svg { width: 1.3rem; height: 1.3rem; }

/* Password strength */
.strengthBar { display: flex; gap: 0.4rem; margin-top: 0.5rem; }
.strengthSeg {
  flex: 1; height: 4px;
  background: var(--bg-raised);
  border-radius: 2px;
  transition: background 0.15s;
}
.weak   { background: var(--rsvp-no); }
.medium { background: oklch(75% 0.10 85); }
.strong { background: var(--rsvp-yes); }
.strengthLabel {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--text-muted);
  letter-spacing: 0.04em;
  margin-top: 0.4rem;
}
.strengthLabel.weak   { color: var(--rsvp-no); }
.strengthLabel.medium { color: oklch(75% 0.10 85); }
.strengthLabel.strong { color: var(--rsvp-yes); }

/* Submit */
.submit {
  width: 100%;
  margin-top: 0.6rem;
  padding: 1.3rem;
  background: var(--accent);
  border: none;
  border-radius: 0.8rem;
  color: var(--bg-void);
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s, opacity 0.15s;
  display: inline-flex; align-items: center; justify-content: center; gap: 0.8rem;
}
.submit:hover:not(:disabled) { background: var(--accent-hi); }
.submit:active:not(:disabled) { transform: scale(0.99); }
.submit:disabled {
  background: var(--bg-raised);
  color: var(--text-muted);
  cursor: not-allowed;
}
.submit svg { width: 1.6rem; height: 1.6rem; }

/* Server error banner */
.errorBanner {
  padding: 1rem 1.4rem;
  background: var(--rsvp-no-dim);
  border: 1px solid oklch(58% 0.14 22 / 0.4);
  border-radius: 0.8rem;
  display: flex; align-items: flex-start; gap: 0.8rem;
  font-family: var(--font-mono);
  font-size: 1.15rem;
  color: var(--rsvp-no);
  line-height: 1.5;
}
.errorBanner svg { width: 1.6rem; height: 1.6rem; flex-shrink: 0; margin-top: 0.1rem; }

/* Footer link to swap forms */
.cardFooter {
  padding: 1.6rem 3.2rem 2.4rem;
  border-top: 1px solid var(--border-dim);
  text-align: center;
  font-family: var(--font-body);
  font-size: 1.35rem;
  color: var(--text-muted);
}
.cardFooter a {
  color: var(--accent-hi);
  font-weight: 600;
  margin-left: 0.4rem;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.15s;
}
.cardFooter a:hover { border-bottom-color: var(--accent); }

@media (max-width: 720px) {
  .card { margin: 2rem 1.2rem; max-width: 100%; }
  .cardHeader { padding: 2.4rem 2rem 0; }
  .title { font-size: 3rem; }
  .form { padding: 2rem; }
  .cardFooter { padding: 1.4rem 2rem 1.8rem; }
}
```

---

### Task 4: Create AuthShell.jsx

**Files:**
- Create: `client/src/pages/LoginSignup/AuthShell.jsx`

- [ ] **Step 1: Create the component**

`client/src/pages/LoginSignup/AuthShell.jsx`:

```jsx
import styles from './Auth.module.css';

const AuthShell = ({ children }) => (
  <div className={styles.page}>
    <div className={styles.grid}/>
    <div className={styles.glow}/>
    <div className={`${styles.card} fade-up`}>
      {children}
    </div>
  </div>
);

export default AuthShell;
```

- [ ] **Step 2: Commit CSS and shell**

```bash
git add client/src/pages/LoginSignup/Auth.module.css client/src/pages/LoginSignup/AuthShell.jsx
git commit -m "feat: add Auth.module.css and AuthShell shared shell"
```

---

### Task 5: Rewrite Login.jsx

**Files:**
- Modify: `client/src/pages/LoginSignup/Login.jsx` (full rewrite)

- [ ] **Step 1: Replace the entire file with the following**

`client/src/pages/LoginSignup/Login.jsx`:

```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ArrowRight } from '@styled-icons/feather/ArrowRight';
import { AlertCircle } from '@styled-icons/feather/AlertCircle';
import { LOGIN_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';
import { validateEmail } from '../../utils/helpers';
import AuthShell from './AuthShell';
import styles from './Auth.module.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState(null);
  const [login, { loading }] = useMutation(LOGIN_USER);

  const emailErr = touched.email && form.email && !validateEmail(form.email);
  const canSubmit = validateEmail(form.email) && form.password.length >= 1 && !loading;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setServerError(null);
    try {
      const { data } = await login({ variables: { ...form } });
      Auth.login(data.login.token);
    } catch (err) {
      setServerError('Email or password is incorrect.');
    }
  };

  return (
    <AuthShell>
      <div className={styles.cardHeader}>
        <div className={styles.eyebrow}>Welcome back</div>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.sub}>Sign in to RSVP, save shows, and connect with friends.</p>
      </div>

      <form className={styles.form} onSubmit={onSubmit}>
        {serverError && (
          <div className={styles.errorBanner}>
            <AlertCircle/><span>{serverError}</span>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>
            <span>Email</span><span className={styles.labelRequired}>required</span>
          </label>
          <input
            className={`${styles.input} ${emailErr ? styles.invalid : ''}`}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            onBlur={() => setTouched(t => ({ ...t, email: true }))}
            required
          />
          {emailErr && (
            <div className={`${styles.helper} ${styles.helperError}`}>
              <AlertCircle/><span>Enter a valid email address.</span>
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            <span>Password</span><span className={styles.labelRequired}>required</span>
          </label>
          <input
            className={styles.input}
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            required
          />
        </div>

        <button type="submit" className={styles.submit} disabled={!canSubmit}>
          {loading ? 'Signing in…' : <>Sign in <ArrowRight/></>}
        </button>
      </form>

      <div className={styles.cardFooter}>
        New to NOISEBX?
        <Link to="/signup">Create an account</Link>
      </div>
    </AuthShell>
  );
};

export default Login;
```

- [ ] **Step 2: Run Login tests — expect all 5 to pass**

```bash
cd client && npm test -- --watchAll=false --testPathPattern=Login
```

Expected: `Tests: 5 passed, 5 total`

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/LoginSignup/Login.jsx
git commit -m "feat: rewrite Login with validation, error banner, and AuthShell"
```

---

### Task 6: Rewrite Signup.jsx

**Files:**
- Modify: `client/src/pages/LoginSignup/Signup.jsx` (full rewrite)

- [ ] **Step 1: Replace the entire file with the following**

`client/src/pages/LoginSignup/Signup.jsx`:

```jsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ArrowRight } from '@styled-icons/feather/ArrowRight';
import { AlertCircle } from '@styled-icons/feather/AlertCircle';
import { ADD_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';
import { validateEmail } from '../../utils/helpers';
import AuthShell from './AuthShell';
import styles from './Auth.module.css';

function passwordStrength(pw) {
  if (!pw) return { score: 0, label: '', cls: '' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 2) return { score: 1, label: 'Weak',   cls: 'weak' };
  if (s <= 3) return { score: 2, label: 'Medium', cls: 'medium' };
  return               { score: 3, label: 'Strong', cls: 'strong' };
}

const Signup = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState(null);
  const [addUser, { loading }] = useMutation(ADD_USER);

  const usernameErr = touched.username && form.username.length > 0 && form.username.length < 3;
  const emailErr    = touched.email && form.email && !validateEmail(form.email);
  const strength    = useMemo(() => passwordStrength(form.password), [form.password]);
  const pwTooShort  = touched.password && form.password && form.password.length < 8;

  const canSubmit =
    form.username.length >= 3 &&
    validateEmail(form.email) &&
    form.password.length >= 8 &&
    !loading;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setServerError(null);
    try {
      const { data } = await addUser({ variables: { ...form } });
      Auth.login(data.addUser.token);
    } catch (err) {
      setServerError(err.message || 'Sign up failed. Try again.');
    }
  };

  return (
    <AuthShell>
      <div className={styles.cardHeader}>
        <div className={styles.eyebrow}>Join NOISEBX</div>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.sub}>Save shows, RSVP to concerts, and connect with friends.</p>
      </div>

      <form className={styles.form} onSubmit={onSubmit}>
        {serverError && (
          <div className={styles.errorBanner}>
            <AlertCircle/><span>{serverError}</span>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>
            <span>Username</span><span className={styles.labelRequired}>required</span>
          </label>
          <input
            className={`${styles.input} ${usernameErr ? styles.invalid : ''}`}
            type="text"
            autoComplete="username"
            placeholder="your_username"
            value={form.username}
            onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
            onBlur={() => setTouched(t => ({ ...t, username: true }))}
            required
          />
          <div className={`${styles.helper} ${usernameErr ? styles.helperError : ''}`}>
            {usernameErr ? <><AlertCircle/><span>At least 3 characters.</span></> : <span>Visible to other users.</span>}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            <span>Email</span><span className={styles.labelRequired}>required</span>
          </label>
          <input
            className={`${styles.input} ${emailErr ? styles.invalid : ''}`}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            onBlur={() => setTouched(t => ({ ...t, email: true }))}
            required
          />
          {emailErr && (
            <div className={`${styles.helper} ${styles.helperError}`}>
              <AlertCircle/><span>Enter a valid email address.</span>
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            <span>Password</span><span className={styles.labelRequired}>required</span>
          </label>
          <input
            className={`${styles.input} ${pwTooShort ? styles.invalid : ''}`}
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            onBlur={() => setTouched(t => ({ ...t, password: true }))}
            required
          />
          {form.password && (
            <>
              <div className={styles.strengthBar}>
                <div className={`${styles.strengthSeg} ${strength.score >= 1 ? styles[strength.cls] : ''}`}/>
                <div className={`${styles.strengthSeg} ${strength.score >= 2 ? styles[strength.cls] : ''}`}/>
                <div className={`${styles.strengthSeg} ${strength.score >= 3 ? styles[strength.cls] : ''}`}/>
              </div>
              <div className={`${styles.strengthLabel} ${styles[strength.cls]}`}>
                Password strength: {strength.label}
              </div>
            </>
          )}
          {pwTooShort && (
            <div className={`${styles.helper} ${styles.helperError}`}>
              <AlertCircle/><span>At least 8 characters.</span>
            </div>
          )}
        </div>

        <button type="submit" className={styles.submit} disabled={!canSubmit}>
          {loading ? 'Creating account…' : <>Create account <ArrowRight/></>}
        </button>
      </form>

      <div className={styles.cardFooter}>
        Already have an account?
        <Link to="/login">Log in</Link>
      </div>
    </AuthShell>
  );
};

export default Signup;
```

- [ ] **Step 2: Run Signup tests — expect all 6 to pass**

```bash
cd client && npm test -- --watchAll=false --testPathPattern=Signup
```

Expected: `Tests: 6 passed, 6 total`

- [ ] **Step 3: Run full test suite to confirm no regressions**

```bash
cd client && npm test -- --watchAll=false
```

Expected: All previously passing tests still pass (65 total across 13 suites).

- [ ] **Step 4: Commit**

```bash
git add client/src/pages/LoginSignup/Signup.jsx
git commit -m "feat: rewrite Signup with validation, strength meter, and AuthShell"
```

---

### Task 7: Cleanup

**Files:**
- Delete: `client/src/pages/LoginSignup/LoginSignup.module.css`
- Delete: `client/src/components/shared/FormCard/FormCard.jsx`
- Modify: `client/src/index.css` — remove the active `.form-card` block

- [ ] **Step 1: Delete the old CSS module and FormCard**

```bash
git rm client/src/pages/LoginSignup/LoginSignup.module.css
git rm client/src/components/shared/FormCard/FormCard.jsx
```

- [ ] **Step 2: Remove the active `.form-card` rule from index.css**

In `client/src/index.css`, find and remove this block (lines ~360–364):

```css
.form-card {
  background-color: var(--darkest);
  border-radius: 10px;
  border: 1px solid #386472;
}
```

Leave all the commented-out rules below it unchanged.

- [ ] **Step 3: Run full test suite to confirm nothing broke**

```bash
cd client && npm test -- --watchAll=false
```

Expected: All tests still pass. (`FormCard` is no longer imported anywhere.)

- [ ] **Step 4: Commit cleanup**

```bash
git add client/src/index.css
git commit -m "chore: remove FormCard and LoginSignup.module.css, clean up .form-card rule"
```
