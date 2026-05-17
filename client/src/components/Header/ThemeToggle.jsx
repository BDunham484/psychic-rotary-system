import { useTheme } from '../../utils/ThemeContext';
import { Sun } from '@styled-icons/feather/Sun';
import { Moon } from '@styled-icons/feather/Moon';
import styles from './Header.module.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={styles.themeRow}>
      <div className={styles.themeLabel}>
        <div className={styles.themeTitle}>Theme</div>
        <div className={styles.themeSub}>{isLight ? 'Light mode' : 'Dark mode'}</div>
      </div>
      <button
        className={styles.themeToggle}
        role="switch"
        aria-checked={isLight}
        aria-label="Toggle theme"
        onClick={toggleTheme}
      >
        <span className={styles.themeKnob}>
          {isLight ? <Sun /> : <Moon />}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle;
