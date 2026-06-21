import { useEffect, useState } from 'react';

// True when the viewport is at or below the mobile breakpoint (720px).
export function useIsMobile() {
  const [m, setM] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const fn = (e) => setM(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return m;
}

export default useIsMobile;
