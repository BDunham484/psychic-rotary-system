import { useLocation, useNavigate } from 'react-router-dom';
import { toLocalMidnight } from '../utils/helpers';
import Auth from '../utils/auth';
import { ArrowLeft } from '@styled-icons/feather/ArrowLeft';
import { ExternalLink } from '@styled-icons/feather/ExternalLink';
import { Clock } from '@styled-icons/feather/Clock';
import { MapPin } from '@styled-icons/feather/MapPin';
import { Phone } from '@styled-icons/feather/Phone';
import { Mail } from '@styled-icons/feather/Mail';
import { Tag as TicketIcon } from '@styled-icons/feather/Tag';
import { Navigation as NavIcon } from '@styled-icons/feather/Navigation';
import ConcertRSVP from '../components/shared/ConcertRSVP';
import FriendsGoing from '../components/shared/FriendsGoing';
import DisabledConcertRSVP from '../components/DisabledConcertRSVP';
import styles from './Show.module.css';

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const Show = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { concert } = location.state || {};
  const loggedIn = Auth.loggedIn();

  if (!concert) {
    return (
      <main className={styles.main}>
        <div className={styles.page}>
          <div className={styles.empty}>Show not found.</div>
        </div>
      </main>
    );
  }

  const googleMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(concert.venue + ' ' + (concert.address || ''))}`;
  const wazeMaps   = `https://waze.com/ul?q=${encodeURIComponent(concert.venue)}&navigate=yes`;

  const d = toLocalMidnight(concert.date);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tmrw  = new Date(today); tmrw.setDate(today.getDate() + 1);
  const sameDay = (a, b) => a.toDateString() === b.toDateString();
  const dayLabel = sameDay(d, today) ? 'Today'
                 : sameDay(d, tmrw)  ? 'Tomorrow'
                 : DAYS[d.getDay()];
  const dayLabelShort = (dayLabel === 'Today' || dayLabel === 'Tomorrow')
                      ? dayLabel
                      : dayLabel.slice(0, 3);

  return (
    <main className={styles.main}>
      <div className={`${styles.page} fade-up`}>

        <div className={styles.backBar}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft /> Back
          </button>
          <div className={styles.backBarDate}>
            <span className={styles.backBarDay}>{dayLabelShort}</span>
            <span className={styles.backBarMonthDay}>{MONTHS[d.getMonth()]} {d.getDate()}</span>
          </div>
        </div>

        <section className={styles.hero}>
          <div className={styles.heroDate}>
            <strong>
            <span className={styles.dayFull}>{dayLabel}</span>
            <span className={styles.dayShort}>{dayLabelShort}</span>
          </strong> · {MONTHS[d.getMonth()]} {d.getDate()}
          </div>
          <h1 className={styles.heroArtists}>{concert.artists}</h1>
          {concert.venue && (
            <div className={styles.heroVenue}>
              <span className={styles.heroVenueAt}>at</span>
              {concert.website ? (
                <a
                  href={concert.website}
                  className={styles.heroVenueName}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {concert.venue}
                  <ExternalLink className={styles.heroVenueExt} />
                </a>
              ) : (
                <span className={styles.heroVenueName}>{concert.venue}</span>
              )}
            </div>
          )}
        </section>

        <section className={styles.details}>
          <div className={styles.detailCol}>
            {concert.times && (
              <>
                <div className={styles.sectionLabel}>When</div>
                <DetailRow icon={<Clock />} label="Showtime">{concert.times}</DetailRow>
              </>
            )}
            {concert.address && (
              <>
                <div className={styles.sectionLabel} style={{ marginTop: '1.2rem' }}>Where</div>
                <DetailRow icon={<MapPin />} label="Address" sub={concert.address2}>
                  {concert.address}
                </DetailRow>
              </>
            )}
          </div>
          <div className={styles.detailCol}>
            {(concert.phone || concert.email) && (
              <div className={styles.sectionLabel}>Contact</div>
            )}
            {concert.phone && (
              <DetailRow icon={<Phone />} label="Phone">
                <a href={`tel:${concert.phone}`}>{concert.phone}</a>
              </DetailRow>
            )}
            {concert.email && (
              <DetailRow icon={<Mail />} label="Email">
                <a href={`mailto:${concert.email}`}>{concert.email}</a>
              </DetailRow>
            )}
          </div>
        </section>

        <section className={styles.actions}>
          <div className={styles.sectionLabel} style={{ marginBottom: '1.4rem' }}>Get there</div>
          <div className={styles.actionsRow}>
            {concert.ticketLink && (
              <a href={concert.ticketLink} className={`${styles.action} ${styles.actionPrimary}`} target="_blank" rel="noopener noreferrer">
                <TicketIcon /> Get Tickets
              </a>
            )}
            {concert.venue && (
              <>
                <a href={googleMaps} className={styles.action} target="_blank" rel="noopener noreferrer">
                  <MapPin /> Google Maps
                </a>
                <a href={wazeMaps} className={styles.action} target="_blank" rel="noopener noreferrer">
                  <NavIcon /> Waze
                </a>
              </>
            )}
            {concert.phone && (
              <a href={`tel:${concert.phone}`} className={styles.action}>
                <Phone /> Call venue
              </a>
            )}
          </div>
        </section>

        <section className={styles.rsvpBlock}>
          <h2 className={styles.rsvpHeading}>
            {loggedIn ? 'Are you going?' : "Who's going"}
          </h2>
          <div className={styles.rsvpSub}>
            {loggedIn ? 'Your friends will see your response' : 'Log in to RSVP and see your friends'}
          </div>
          {loggedIn ? (
            <>
              <ConcertRSVP concertId={concert._id} />
              <FriendsGoing concertId={concert._id} />
            </>
          ) : (
            <DisabledConcertRSVP concertId={concert._id} />
          )}
        </section>

      </div>
    </main>
  );
};

const DetailRow = ({ icon, label, children, sub }) => (
  <div className={styles.detailRow}>
    <div className={styles.detailRowIcon}>{icon}</div>
    <div className={styles.detailRowBody}>
      <div className={styles.detailRowLabel}>{label}</div>
      <div className={styles.detailRowValue}>{children}</div>
      {sub && <div className={styles.detailRowSub}>{sub}</div>}
    </div>
  </div>
);

export default Show;
