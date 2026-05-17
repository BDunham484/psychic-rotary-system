import { useEffect, useState } from 'react';
import { ArrowUpShort } from '@styled-icons/bootstrap/ArrowUpShort';
import styles from './ScrollButton.module.css';

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      className={`${styles.scrollTop} ${visible ? styles.visible : ''}`}
      onClick={scrollTop}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <ArrowUpShort />
    </button>
  );
};

export default ScrollButton;
