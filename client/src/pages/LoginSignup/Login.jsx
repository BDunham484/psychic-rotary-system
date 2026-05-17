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
