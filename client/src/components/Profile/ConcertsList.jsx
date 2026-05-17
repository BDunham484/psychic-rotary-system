import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { DELETE_CONCERT_FROM_USER } from '../../utils/mutations';
import { Trash2 } from '@styled-icons/feather/Trash2';
import styles from './ConcertsList.module.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const ConcertsList = ({ user, isSelf }) => {
  const [deleteConcert] = useMutation(DELETE_CONCERT_FROM_USER);

  const handleRemove = async (id) => {
    try { await deleteConcert({ variables: { concertId: id } }); }
    catch (e) { console.error(e); }
  };

  if (!user.concerts || user.concerts.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>♪</div>
        <div className={styles.emptyTitle}>
          {isSelf ? 'No saved concerts yet' : `${user.username} has no saved concerts`}
        </div>
        <div className={styles.emptySub}>
          {isSelf ? 'Browse shows and tap + to save them here.' : 'Check back later.'}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {user.concerts.map(c => (
        <ConcertRow
          key={c._id}
          concert={c}
          isSelf={isSelf}
          onRemove={() => handleRemove(c._id)}
        />
      ))}
    </div>
  );
};

const ConcertRow = ({ concert, isSelf, onRemove }) => {
  const d = new Date(concert.date);
  return (
    <Link
      to={`/show/${concert.customId}`}
      state={{ concert }}
      className={styles.row}
    >
      <div className={styles.date}>
        <div className={styles.dateDay}>{DAYS[d.getDay()]}</div>
        <div className={styles.dateNum}>{d.getDate()}</div>
        <div className={styles.dateMonth}>{MONTHS[d.getMonth()]}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.artists}>{concert.artists}</div>
        {concert.venue && (
          <div className={styles.meta}>
            <span className={styles.at}>at</span>
            <span>{concert.venue}</span>
          </div>
        )}
      </div>
      {isSelf && (
        <button
          className={styles.removeBtn}
          aria-label="Remove from saved"
          title="Remove from saved"
          onClick={(e) => { e.preventDefault(); onRemove(); }}
        >
          <Trash2 />
        </button>
      )}
    </Link>
  );
};

export default ConcertsList;
