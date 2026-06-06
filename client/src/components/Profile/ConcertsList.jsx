import { useMutation } from '@apollo/client';
import { Check } from '@styled-icons/feather/Check';
import { Tag as TicketIcon } from '@styled-icons/feather/Tag';
import { Trash2 } from '@styled-icons/feather/Trash2';
import { X } from '@styled-icons/feather/X';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { concertSlug, toLocalMidnight } from '../../utils/helpers';
import {
  CLEAR_RSVP,
  DELETE_CONCERT_FROM_USER,
  RSVP_MAYBE,
  RSVP_NO,
  RSVP_YES,
} from '../../utils/mutations';
import styles from './ConcertsList.module.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const RSVP_TYPES  = ['yes', 'maybe', 'no'];
const RSVP_LABELS = { yes: 'Going', maybe: 'Maybe', no: "Can't" };

// Which RSVP (if any) the viewer currently holds for this concert.
const seededRsvp = (concert, userId) =>
    concert.yes?.some(u => u._id === userId)   ? 'yes' :
    concert.maybe?.some(u => u._id === userId) ? 'maybe' :
    concert.no?.some(u => u._id === userId)    ? 'no' :
    null;

// Per-option totals adjusted for the viewer's optimistic vote: base server count,
// plus the live vote, minus the seeded vote so we never double-count ourselves.
const adjCounts = (concert, seeded, live) => {
  const out = {};
  RSVP_TYPES.forEach(t => {
    const base = concert[t]?.length || 0;
    out[t] = base + (live === t ? 1 : 0) - (seeded === t ? 1 : 0);
  });
  return out;
};

const ConcertsList = ({ user, isSelf }) => {
  const [deleteConcert] = useMutation(DELETE_CONCERT_FROM_USER);

  const handleRemove = async (id) => {
    try { await deleteConcert({ variables: { concertId: id } }); }
    catch (e) { console.error(e); }
  };

  // Always display by date asc, then showtime asc (customId.times is the "HHmm"
  // key), regardless of the order concerts were added to the user.
  const sortedConcerts = useMemo(() => {
    const ms = (c) => {
      const t = new Date(c.date).getTime();
      return Number.isNaN(t) ? Infinity : t;
    };
    return [...(user.concerts || [])].sort((a, b) => {
      const da = ms(a);
      const db = ms(b);
      if (da !== db) return da - db;
      const ta = a.customId?.times || '';
      const tb = b.customId?.times || '';
      return ta < tb ? -1 : ta > tb ? 1 : 0;
    });
  }, [user.concerts]);

  if (sortedConcerts.length === 0) {
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
      {sortedConcerts.map(c => (
        <ConcertRow
          key={c._id}
          concert={c}
          isSelf={isSelf}
          userId={user._id}
          onRemove={() => handleRemove(c._id)}
        />
      ))}
    </div>
  );
};

const ConcertRow = ({ concert, isSelf, userId, onRemove }) => {
  const seeded = seededRsvp(concert, userId);
  const [rsvp, setRsvp] = useState(seeded);

  const [rsvpYes]   = useMutation(RSVP_YES);
  const [rsvpNo]    = useMutation(RSVP_NO);
  const [rsvpMaybe] = useMutation(RSVP_MAYBE);
  const [clearRsvp] = useMutation(CLEAR_RSVP);

  const counts = adjCounts(concert, seeded, rsvp);
  const d = toLocalMidnight(concert.date);

  // Tapping the active option clears it (row stays — only the trash button removes).
  // Tapping a different option switches; the concert is already saved so no add needed.
  const pick = (type) => {
    const next = rsvp === type ? null : type;
    setRsvp(next);
    const vars = { variables: { concertId: concert._id, userId } };
    const run = next === null   ? clearRsvp :
                type === 'yes'   ? rsvpYes :
                type === 'maybe' ? rsvpMaybe :
                rsvpNo;
    run(vars).catch(console.error);
  };

  return (
    <Link
      to={`/show/${concertSlug(concert.customId)}`}
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
            {concert.ticketPrice && (
              <span className={styles.price}>
                <TicketIcon /> {concert.ticketPrice}
              </span>
            )}
          </div>
        )}
      </div>

      {isSelf && (
        <div
          className={styles.rsvp}
          role="group"
          aria-label="RSVP"
          onClick={(e) => e.preventDefault()}
        >
          {RSVP_TYPES.map(t => (
            <button
              key={t}
              type="button"
              className={`${styles.pick} ${rsvp === t ? styles[`on_${t}`] : ''}`}
              title={RSVP_LABELS[t]}
              aria-pressed={rsvp === t}
              onClick={(e) => { e.preventDefault(); pick(t); }}
            >
              {t === 'maybe'
                ? <span className={styles.pickIconText}>?</span>
                : t === 'yes' ? <Check /> : <X />
              }
              <span className={styles.pickCount}>{counts[t]}</span>
            </button>
          ))}
        </div>
      )}

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
