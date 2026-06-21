import { Link } from 'react-router-dom';
import { ExternalLink } from '@styled-icons/feather/ExternalLink';
import { UserMinus }    from '@styled-icons/feather/UserMinus';
import { UserX }        from '@styled-icons/feather/UserX';
import { useIsMobile } from '../../utils/useIsMobile';
import SwipeRow from '../shared/SwipeRow/SwipeRow';
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
  const actions = [
    { kind: 'danger', icon: <UserMinus />, label: 'Remove', title: 'Remove friend', onClick: onRemove },
    { kind: 'warn',   icon: <UserX />,     label: 'Block',  title: 'Block',         onClick: onBlock },
  ];
  return (
    <SwipeRow actions={actions} open={open} setOpen={setOpen}>
      <Link to={`/profile/${friend.username}`} className={styles.friendSwipeLink}>
        <div className={styles.friendAvatar}>{initialsOf(friend.username)}</div>
        <div className={styles.friendInfo}>
          <div className={styles.friendName}>{friend.username}</div>
          <div className={styles.friendMeta}>{friend.concertCount || 0} concerts saved</div>
        </div>
      </Link>
    </SwipeRow>
  );
}

export default function FriendItem(props) {
  return useIsMobile() ? <FriendRowMobile {...props} /> : <FriendRowDesktop {...props} />;
}
