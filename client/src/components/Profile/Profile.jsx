import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../../utils/queries';
import Auth from '../../utils/auth';
import { deriveFriendship } from '../../utils/helpers';
import BackButton from '../shared/BackButton';
import ProfileHero from './ProfileHero';
import ConcertsList from './ConcertsList';
import FriendsTab from '../Friends/FriendsTab';
import styles from './Profile.module.css';

const Profile = () => {
  const { username: userParam } = useParams();
  const [tab, setTab] = useState('concerts');

  const { loading, data, startPolling, stopPolling } = useQuery(
    userParam ? QUERY_USER : QUERY_ME,
    { variables: { username: userParam } }
  );

  const { data: meData } = useQuery(QUERY_ME, {
    skip: !userParam || !Auth.loggedIn(),
  });

  useEffect(() => {
    startPolling(1000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const user = useMemo(() => data?.me || data?.user || {}, [data]);
  const me   = useMemo(() => meData?.me || null, [meData]);
  const isSelf = !userParam;

  const friendship = useMemo(
    () => deriveFriendship(me, user._id),
    [me, user._id]
  );

  if (Auth.loggedIn() && Auth.getProfile()?.data.username === userParam) {
    return <Navigate to='/profile' />;
  }
  if (loading) return <div>Loading…</div>;
  if (!user?._id) return <h4>You need to be logged in to see this page.</h4>;

  return (
    <main className={styles.main}>
      <div className={`${styles.page} fade-up`}>
        <div className={styles.backBar}>
          <BackButton />
        </div>

        <ProfileHero user={user} isSelf={isSelf} friendship={friendship} />

        {isSelf ? (
          <>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${tab === 'concerts' ? styles.tabActive : ''}`}
                onClick={() => setTab('concerts')}
              >
                Concerts <span className={styles.tabCount}>{user.concertCount || 0}</span>
              </button>
              <button
                className={`${styles.tab} ${tab === 'friends' ? styles.tabActive : ''}`}
                onClick={() => setTab('friends')}
              >
                Friends <span className={styles.tabCount}>{user.friendCount || 0}</span>
              </button>
            </div>
            <div className={styles.tabContent}>
              {tab === 'concerts' && <ConcertsList user={user} isSelf={true} />}
              {tab === 'friends'  && <FriendsTab  user={user} />}
            </div>
          </>
        ) : (
          <div className={styles.tabContent}>
            <ConcertsList user={user} isSelf={false} />
          </div>
        )}
      </div>
    </main>
  );
};

export default Profile;
