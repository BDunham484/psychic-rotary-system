import { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { ConcertContext } from '../../../utils/GlobalState';
import { GET_CONCERT_BY_ID } from '../../../utils/queries';
import styles from './FriendsGoing.module.css';

const MAX_AVATARS = 4;

const getInitials = (username) => {
  const words = username.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return username.slice(0, 2).toUpperCase();
};

const FriendsGoing = ({ concertId }) => {
  const { user } = useContext(ConcertContext);
  const friends = user?.me?.friends || [];

  const { data } = useQuery(GET_CONCERT_BY_ID, { variables: { concertId } });
  const yes = data?.concert?.yes || [];

  const friendsGoing = yes.filter(u => friends.some(f => f._id === u._id));

  if (friendsGoing.length === 0) return null;

  const shown = friendsGoing.slice(0, MAX_AVATARS);
  const overflow = friendsGoing.length - MAX_AVATARS;

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.label}>Friends Going</span>
        <span className={styles.countLine}>
          <span className={styles.countNum}>{friendsGoing.length}</span>
          {' '}of your friends · click to see all
        </span>
      </div>
      <div className={styles.avatarRow}>
        {shown.map(u => (
          <div key={u._id} className={styles.avatar}>
            {getInitials(u.username)}
          </div>
        ))}
        {overflow > 0 && (
          <div className={`${styles.avatar} ${styles.overflow}`}>
            +{overflow}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsGoing;
