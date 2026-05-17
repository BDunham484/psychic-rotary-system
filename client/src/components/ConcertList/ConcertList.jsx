import { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConcertContext } from '../../utils/GlobalState';
import Auth from '../../utils/auth';
import AdminDelete from '../AdminUtil/AdminDelete';
import PlusMinus from '../shared/PlusMinus/PlusMinus';
import { SquaredPlus } from '@styled-icons/entypo/SquaredPlus';
import styles from './ConcertList.module.css';

const ConcertList = ({ concerts }) => {
  const { user } = useContext(ConcertContext);
  const [concertList, setConcertList] = useState(concerts);
  const isAdmin = useMemo(() => user?.me?.isAdmin === true, [user?.me?.isAdmin]);
  const loggedIn = Auth.loggedIn();

  useEffect(() => { setConcertList(concerts); }, [concerts]);

  const filterList = (concertId) => {
    setConcertList(list => list.filter(c => c._id !== concertId));
  };

  if (!concertList?.length) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>∅</div>
        <div className={styles.emptyTitle}>No shows for this day</div>
        <div className={styles.emptySub}>Try a different date or search for a venue.</div>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {concertList.map(concert => (
        <ConcertRow
          key={concert._id}
          concert={concert}
          loggedIn={loggedIn}
          isAdmin={isAdmin}
          onDelete={() => filterList(concert._id)}
        />
      ))}
    </div>
  );
};

const ConcertRow = ({ concert, loggedIn, isAdmin, onDelete }) => {
  const yesCount   = concert.yes?.length   ?? null;
  const maybeCount = concert.maybe?.length ?? null;
  const hasAttendance = yesCount !== null || maybeCount !== null;

  return (
    <div className={`${styles.row} fade-up`}>
      <div className={styles.rsvp}>
        {loggedIn
          ? <PlusMinus concertId={concert._id} />
          : <SquaredPlus style={{ opacity: 0.4, width: '4.4rem', height: '4.4rem', color: 'var(--text-muted)' }} />
        }
      </div>

      <div className={styles.content}>
        <Link
          to={`/show/${concert.customId}`}
          state={{ concert }}
          className={styles.artists}
        >
          {concert.artists}
        </Link>
        <div className={styles.meta}>
          {concert.venue && (
            <>
              <span className={styles.at}>at</span>
              <Link to={`/venue/${encodeURIComponent(concert.venue)}`} className={styles.venue}>
                {concert.venue}
              </Link>
            </>
          )}
          {concert.times && <span className={styles.time}>{concert.times}</span>}
        </div>
      </div>

      {hasAttendance && (
        <div className={styles.attendance}>
          {yesCount !== null && (
            <span className={styles.pill}>
              <span className={`${styles.dot} ${styles.dotYes}`} />
              <span className={styles.attCount}>{yesCount}</span>
            </span>
          )}
          {maybeCount !== null && (
            <span className={styles.pill}>
              <span className={`${styles.dot} ${styles.dotMaybe}`} />
              <span className={styles.attCount}>{maybeCount}</span>
            </span>
          )}
        </div>
      )}

      {isAdmin && <AdminDelete concertId={concert._id} filterList={onDelete} />}
    </div>
  );
};

export default ConcertList;
