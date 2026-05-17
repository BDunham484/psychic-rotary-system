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
