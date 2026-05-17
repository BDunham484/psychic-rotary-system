import { useEffect, useState } from 'react';
import { ArrowUpCircleFill } from '@styled-icons/bootstrap/ArrowUpCircleFill';
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
      <ArrowUpCircleFill />
    </button>
  );
};

export default ScrollButton;
