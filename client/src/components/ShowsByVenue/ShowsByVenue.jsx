import { useQuery } from '@apollo/client';
import { Plus } from '@styled-icons/bootstrap/Plus';
import { ArrowLeft } from '@styled-icons/feather/ArrowLeft';
import { ArrowRight } from '@styled-icons/feather/ArrowRight';
import { Tag as TicketIcon } from '@styled-icons/feather/Tag';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Auth from '../../utils/auth';
import { toLocalMidnight, concertSlug } from '../../utils/helpers';
import { GET_CONCERTS_BY_VENUE } from '../../utils/queries';
import PlusMinus from '../shared/PlusMinus/PlusMinus';
import ScrollButton from '../shared/ScrollButton';
import Spinner from '../shared/Spinner';
import styles from './ShowsByVenue.module.css';

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS_SHORT   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function venueInitials(name) {
  const words = (name || '').replace(/^(The|A)\s+/i, '').split(/[\s&\/]+/).filter(Boolean);
  const letters = words.map(w => w.replace(/[^A-Za-z0-9]/g, '').charAt(0)).filter(Boolean);
  if (!letters.length) return '?';
  if (letters.length === 1) return letters[0].toUpperCase();
  return (letters[0] + letters[1]).toUpperCase();
}

const ShowsByVenue = () => {
  const { state } = useLocation();
  const { venueName: paramName } = useParams();
  const navigate = useNavigate();

  const venueName = state?.venueName || decodeURIComponent(paramName || '');

  const { loading, data } = useQuery(GET_CONCERTS_BY_VENUE, {
    variables: { venue: venueName },
  });

  const concerts = data?.concertsByVenue || [];
  const loggedIn = Auth.loggedIn();

  return (
    <main className={styles.main}>
      <div className={`${styles.page} fade-up`}>
        <div className={styles.backBar}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft /> Back
          </button>
          <div className={styles.backBarMeta}>
            <span className={styles.backBarMetaTop}>Venue</span>
            <span className={styles.backBarMetaBottom}>Austin, TX</span>
          </div>
        </div>

        <div className={styles.hero}>
          <div className={styles.eyebrow}>Venue · Austin, TX</div>
          <h1 className={styles.name}>
            <span className={styles.glyph}>{venueInitials(venueName)}</span>
            {venueName}
          </h1>
          <div className={styles.stats}>
            <div>
              <span className={styles.statVal}>{concerts.length}</span>
              <span className={styles.statLabel}>Upcoming shows</span>
            </div>
          </div>
        </div>

{loading ? (
          <div className={styles.spinnerWrap}><Spinner /></div>
        ) : concerts.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>♪</div>
            <div className={styles.emptyTitle}>No upcoming shows</div>
            <div className={styles.emptySub}>Check back soon.</div>
          </div>
        ) : (
          <div className={styles.list}>
            {concerts.map(c => {
              const d = toLocalMidnight(c.date);
              return (
                <div key={c._id} className={styles.row}>
                  <div className={styles.rsvp}>
                    {loggedIn
                      ? <PlusMinus concertId={c._id} />
                      : <button className={styles.plusBtn} disabled><Plus /></button>
                    }
                  </div>
                  <div className={styles.content}>
                    <div className={styles.dateRow}>
                      <span className={styles.dateDay}>{DAYS_SHORT[d.getDay()]}</span>
                      <span className={styles.dateMonth}>{MONTHS_SHORT[d.getMonth()]}</span>
                      <span className={styles.dateNum}>{d.getDate()}</span>
                      <div className={styles.arrow}><ArrowRight /></div>
                    </div>
                    <a
                      className={styles.artists}
                      href={`/show/${concertSlug(c.customId)}`}
                      onClick={(e) => { e.preventDefault(); navigate(`/show/${concertSlug(c.customId)}`, { state: { concert: c } }); }}
                    >
                      {c.artists}
                    </a>
                    <div className={styles.meta}>
                      {c.times && <span className={styles.time}>{c.times}</span>}
                      {c.ticketPrice && (
                        <span className={styles.price}>
                          <TicketIcon /> {c.ticketPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <ScrollButton />
    </main>
  );
};

export default ShowsByVenue;
