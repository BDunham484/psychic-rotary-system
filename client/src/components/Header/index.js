import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Auth from '../../utils/auth';
import { CubeAlt } from '@styled-icons/boxicons-regular';
import { ConcertContext } from '../../utils/GlobalState';
import styles from './Header.module.css';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { today, setDate, setSortOrSearch } = useContext(ConcertContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const loggedIn = Auth.loggedIn();

  const goHome = () => {
    setDate(today);
    setSortOrSearch('venue');
  };

  const closeMenu = () => setMenuOpen(false);

  const logout = (e) => {
    e.preventDefault();
    Auth.logout();
    closeMenu();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className={styles.header}>
        <Link to="/" onClick={() => { goHome(); closeMenu(); }} className={styles.brand}>
          <div className={styles.brandCube}><CubeAlt /></div>
          <span className={styles.brandName}>NOISEBOX</span>
          <span className={styles.brandNameMobile}>NBX</span>
        </Link>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </header>

      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <nav className={styles.drawerInner}>
          <Link
            to="/"
            onClick={() => { goHome(); closeMenu(); }}
            className={`${styles.drawerItem} ${isActive('/') ? styles.drawerItemActive : ''}`}
          >
            Shows
          </Link>

          {loggedIn && (
            <Link
              to="/profile"
              onClick={closeMenu}
              className={`${styles.drawerItem} ${location.pathname.startsWith('/profile') ? styles.drawerItemActive : ''}`}
            >
              Profile
            </Link>
          )}

          <Link
            to="/venues"
            onClick={closeMenu}
            className={`${styles.drawerItem} ${location.pathname === '/venues' ? styles.drawerItemActive : ''}`}
          >
            Venue search
          </Link>

          <div className={styles.drawerSep} />
          <ThemeToggle />
          <div className={styles.drawerSep} />

          {loggedIn ? (
            <button className={styles.drawerBtn} onClick={logout}>Logout</button>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className={styles.drawerBtn}>Login</Link>
              <Link to="/signup" onClick={closeMenu} className={`${styles.drawerBtn} ${styles.drawerBtnPrimary}`}>Sign up</Link>
            </>
          )}
        </nav>
      </div>

      {menuOpen && <div className={styles.backdrop} onClick={closeMenu} />}
    </>
  );
};

export default Header;
