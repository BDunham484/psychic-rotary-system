import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <span className={styles.copy}>&copy; 2022 noisebox</span>
        </footer>
    );
}

export default Footer;
