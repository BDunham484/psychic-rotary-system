import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_FRIEND_REQUEST, REMOVE_FRIEND, BLOCK_USER, UNBLOCK_USER } from '../../utils/mutations';
import styles from './ProfileHero.module.css';

const ProfileHero = ({ user, isSelf, friendship = 'none' }) => {
  const [status, setStatus] = useState(friendship);
  const [sendRequest] = useMutation(SEND_FRIEND_REQUEST);
  const [removeFriend] = useMutation(REMOVE_FRIEND);
  const [blockUser] = useMutation(BLOCK_USER);
  const [unblockUser] = useMutation(UNBLOCK_USER);

  const initials = (user.username || '?').slice(0, 2).toUpperCase();

  const handleAddFriend = async () => {
    try {
      await sendRequest({ variables: { friendId: user._id, friendName: user.username } });
      setStatus('requested');
    } catch (e) { console.error(e); }
  };

  const handleRemove = async () => {
    try {
      await removeFriend({ variables: { friendId: user._id } });
      setStatus('none');
    } catch (e) { console.error(e); }
  };

  const handleBlock = async () => {
    try {
      await blockUser({ variables: { blockedId: user._id } });
      setStatus('blocked');
    } catch (e) { console.error(e); }
  };

  const handleUnblock = async () => {
    try {
      await unblockUser({ variables: { blockedId: user._id } });
      setStatus('none');
    } catch (e) { console.error(e); }
  };

  return (
    <div className={`${styles.hero} ${isSelf ? styles.heroFlush : ''}`}>
      <h1 className={styles.name}>
        <span className={styles.glyph}>{initials}</span>
        {user.username}
      </h1>

      {/* On other people's profiles there's no tab bar, so the counts aren't
          redundant — keep them (plus the friend/block actions) here. */}
      {!isSelf && (
        <div className={styles.sub}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statVal}>{user.concertCount || 0}</span>
              <span className={styles.statLabel}>
                {user.concertCount === 1 ? 'Concert' : 'Concerts'}
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statVal}>{user.friendCount || 0}</span>
              <span className={styles.statLabel}>
                {user.friendCount === 1 ? 'Friend' : 'Friends'}
              </span>
            </div>
          </div>

          <div className={styles.actions}>
            {status === 'none' && (
              <button className={styles.action} onClick={handleAddFriend}>Add Friend</button>
            )}
            {status === 'requested' && (
              <button className={`${styles.action} ${styles.actionPending}`} disabled>Request Sent</button>
            )}
            {status === 'friend' && (
              <button className={`${styles.action} ${styles.actionSecondary}`} onClick={handleRemove}>Remove</button>
            )}
            <button
              className={`${styles.action} ${styles.actionDanger}`}
              onClick={status === 'blocked' ? handleUnblock : handleBlock}
            >
              {status === 'blocked' ? 'Unblock' : 'Block'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHero;
