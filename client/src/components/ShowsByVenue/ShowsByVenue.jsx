import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CONCERTS_BY_VENUE } from '../../utils/queries';
import { ArrowLeft } from '@styled-icons/feather/ArrowLeft';
import { ArrowRight } from '@styled-icons/feather/ArrowRight';
import Spinner from '../shared/Spinner';
import ScrollButton from '../shared/ScrollButton';
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

  return (
    <main className={styles.main}>
      <div className={`${styles.page} fade-up`}>
        <div className={styles.backBar}>
          <button className={styles.backBtn} onClick={() => navigate('/venues')}>
            <ArrowLeft /> All venues
          </button>
        </div>

        <div className={styles.hero}>
          <div className={styles.glyph}>{venueInitials(venueName)}</div>
          <div className={styles.info}>
            <div className={styles.eyebrow}>Venue · Austin, TX</div>
            <h1 className={styles.name}>{venueName}</h1>
            <div className={styles.stats}>
              <div>
                <span className={styles.statVal}>{concerts.length}</span>
                <span className={styles.statLabel}>Upcoming shows</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sectionBar}>
          <span className={styles.sectionTitle}>Upcoming at {venueName}</span>
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
              const d = new Date(c.date);
              return (
                <a
                  key={c._id}
                  className={styles.row}
                  href={`/show/${c.customId}`}
                  onClick={(e) => { e.preventDefault(); navigate(`/show/${c.customId}`, { state: { concert: c } }); }}
                >
                  <div className={styles.date}>
                    <div className={styles.dateDay}>{DAYS_SHORT[d.getDay()]}</div>
                    <div className={styles.dateNum}>{d.getDate()}</div>
                    <div className={styles.dateMonth}>{MONTHS_SHORT[d.getMonth()]}</div>
                  </div>
                  <div className={styles.content}>
                    <div className={styles.artists}>{c.artists}</div>
                    {c.times && <div className={styles.meta}>{c.times}</div>}
                  </div>
                  <div className={styles.arrow}><ArrowRight /></div>
                </a>
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
