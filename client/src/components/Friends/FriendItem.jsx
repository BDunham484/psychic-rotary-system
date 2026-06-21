import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from '@styled-icons/feather/ExternalLink';
import { UserMinus }    from '@styled-icons/feather/UserMinus';
import { UserX }        from '@styled-icons/feather/UserX';
import { ChevronLeft }  from '@styled-icons/feather/ChevronLeft';
import { clampSwipe, shouldOpen, REVEAL } from '../../utils/swipe';
import { useIsMobile } from '../../utils/useIsMobile';
import styles from './FriendsTab.module.css';

const initialsOf = (name) => (name || '?').slice(0, 2).toUpperCase();

function FriendRowDesktop({ friend, onRemove, onBlock }) {
  return (
    <div className={styles.friendItem}>
      <div className={styles.friendAvatar}>{initialsOf(friend.username)}</div>
      <div className={styles.friendInfo}>
        <div className={styles.friendName}>{friend.username}</div>
        <div className={styles.friendMeta}>{friend.concertCount || 0} concerts saved</div>
      </div>
      <div className={styles.friendActions}>
        <Link to={`/profile/${friend.username}`} className={styles.iconBtn} title="View profile">
          <ExternalLink />
        </Link>
        <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} title="Remove friend" onClick={onRemove}>
          <UserMinus />
        </button>
        <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} title="Block" onClick={onBlock}>
          <UserX />
        </button>
      </div>
    </div>
  );
}

function FriendRowMobile({ friend, open, setOpen, onRemove, onBlock }) {
  const [tx, setTx] = useState(0);
  const startX = useRef(0);
  const startY = useRef(0);
  const txRef = useRef(0);
  const dragging = useRef(false);
  const locked = useRef(null);

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
    const next = clampSwipe(mx, open, REVEAL);
    txRef.current = next;
    setTx(next);
  };

  const up = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    if (locked.current !== 'x') return;
    if (shouldOpen(txRef.current, REVEAL)) { setTx(-REVEAL); setOpen(true); }
    else { setTx(0); setOpen(false); }
  };

  // Suppress the click that follows a horizontal drag so a swipe never navigates.
  const guardClick = (e) => {
    if (locked.current === 'x') { e.preventDefault(); e.stopPropagation(); }
  };

  return (
    <div className={styles.friendSwipeWrap}>
      <div className={styles.friendSwipeActions} aria-hidden={!open}>
        <button className={`${styles.swipeAct} ${styles.swipeRemove}`} title="Remove friend" onClick={onRemove}>
          <UserMinus /><span>Remove</span>
        </button>
        <button className={`${styles.swipeAct} ${styles.swipeBlock}`} title="Block" onClick={onBlock}>
          <UserX /><span>Block</span>
        </button>
      </div>
      <div
        className={styles.friendItemSwipe}
        style={{ transform: `translateX(${tx}px)`, transition: dragging.current ? 'none' : undefined }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onClickCapture={guardClick}
      >
        <Link to={`/profile/${friend.username}`} className={styles.friendSwipeLink}>
          <div className={styles.friendAvatar}>{initialsOf(friend.username)}</div>
          <div className={styles.friendInfo}>
            <div className={styles.friendName}>{friend.username}</div>
            <div className={styles.friendMeta}>{friend.concertCount || 0} concerts saved</div>
          </div>
        </Link>
        <ChevronLeft className={styles.friendChevron} aria-hidden="true" />
      </div>
    </div>
  );
}

export default function FriendItem(props) {
  return useIsMobile() ? <FriendRowMobile {...props} /> : <FriendRowDesktop {...props} />;
}
