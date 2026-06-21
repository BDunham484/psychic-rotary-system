import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft } from '@styled-icons/feather/ChevronLeft';
import { clampSwipe, shouldOpen } from '../../../utils/swipe';
import styles from './SwipeRow.module.css';

// Generic swipe-to-reveal row. `actions` render as chips in a right-hand drawer;
// the drawer's measured width is the reveal distance, so 1- or 2-chip drawers
// both work. Controlled open state lets a parent enforce single-open.
export default function SwipeRow({ actions = [], open, setOpen, children }) {
  const [tx, setTx] = useState(0);
  const [reveal, setReveal] = useState(0);
  const startX = useRef(0);
  const startY = useRef(0);
  const txRef = useRef(0);
  const dragging = useRef(false);
  const locked = useRef(null);
  const actionsRef = useRef(null);

  // Measure the drawer so the reveal distance matches the actual chip count/width.
  useLayoutEffect(() => {
    if (actionsRef.current) setReveal(actionsRef.current.offsetWidth);
  }, [actions.length]);

  // Reconcile transform when the parent closes this row externally.
  useEffect(() => { if (!open && !dragging.current) setTx(0); }, [open]);

  const down = (e) => {
    startX.current = e.clientX;
    startY.current = e.clientY;
    dragging.current = true;
    locked.current = null;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const move = (e) => {
    if (!dragging.current) return;
    const mx = e.clientX - startX.current;
    const my = e.clientY - startY.current;
    if (locked.current === null && (Math.abs(mx) > 6 || Math.abs(my) > 6)) {
      locked.current = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
    }
    if (locked.current !== 'x') return;   // vertical drag → let the page scroll
    if (e.cancelable) e.preventDefault();
    const next = clampSwipe(mx, open, reveal);
    txRef.current = next;
    setTx(next);
  };

  const up = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    if (locked.current !== 'x') return;
    if (shouldOpen(txRef.current, reveal)) { setTx(-reveal); setOpen(true); }
    else { setTx(0); setOpen(false); }
  };

  // Suppress the click that follows a horizontal drag so a swipe never fires a child.
  const guardClick = (e) => {
    if (locked.current === 'x') { e.preventDefault(); e.stopPropagation(); }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.actions} ref={actionsRef} aria-hidden={!open}>
        {actions.map((a, i) => (
          <button
            key={i}
            className={`${styles.chip} ${styles[`chip_${a.kind}`] || ''}`}
            title={a.title || a.label}
            onClick={a.onClick}
          >
            {a.icon}
            <span>{a.label}</span>
          </button>
        ))}
      </div>
      <div
        className={styles.card}
        style={{ transform: `translateX(${tx}px)`, transition: dragging.current ? 'none' : undefined }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onClickCapture={guardClick}
      >
        {children}
        <ChevronLeft className={styles.chevron} aria-hidden="true" />
      </div>
    </div>
  );
}
