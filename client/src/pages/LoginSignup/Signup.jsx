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
