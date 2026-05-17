import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CONCERT_BY_ID } from '../../utils/queries';
import styles from './DisabledConcertRSVP.module.css';

const DisabledConcertRSVP = ({ concertId }) => {
  const { data } = useQuery(GET_CONCERT_BY_ID, { variables: { concertId } });
  const yesCount   = data?.concert?.yes?.length   || 0;
  const noCount    = data?.concert?.no?.length    || 0;
  const maybeCount = data?.concert?.maybe?.length || 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.counts}>
        <Count val={yesCount}   label="Yes" />
        <Count val={maybeCount} label="Maybe" />
        <Count val={noCount}    label="No" />
      </div>
      <Link to="/login" className={styles.cta}>Log in to RSVP</Link>
    </div>
  );
};

const Count = ({ val, label }) => (
  <div className={styles.count}>
    <div className={styles.countVal}>{val}</div>
    <div className={styles.countLabel}>{label}</div>
  </div>
);

export default DisabledConcertRSVP;
