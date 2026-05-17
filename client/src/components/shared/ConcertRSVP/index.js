import { useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Check } from '@styled-icons/feather/Check';
import { X } from '@styled-icons/feather/X';
import { HelpCircle } from '@styled-icons/feather/HelpCircle';
import { ConcertContext } from '../../../utils/GlobalState';
import { GET_CONCERT_BY_ID } from '../../../utils/queries';
import {
  RSVP_YES, CANCEL_RSVP_YES,
  RSVP_NO,  CANCEL_RSVP_NO,
  RSVP_MAYBE, CANCEL_RSVP_MAYBE,
} from '../../../utils/mutations';
import styles from './ConcertRSVP.module.css';

const ConcertRSVP = ({ concertId }) => {
  const { user } = useContext(ConcertContext);
  const userId = user?.me?._id;

  const { data, refetch } = useQuery(GET_CONCERT_BY_ID, { variables: { concertId } });

  const opts = { onCompleted: refetch };
  const [rsvpYes]         = useMutation(RSVP_YES,          opts);
  const [cancelRsvpYes]   = useMutation(CANCEL_RSVP_YES,   opts);
  const [rsvpNo]          = useMutation(RSVP_NO,           opts);
  const [cancelRsvpNo]    = useMutation(CANCEL_RSVP_NO,    opts);
  const [rsvpMaybe]       = useMutation(RSVP_MAYBE,        opts);
  const [cancelRsvpMaybe] = useMutation(CANCEL_RSVP_MAYBE, opts);

  const yes   = data?.concert?.yes   || [];
  const no    = data?.concert?.no    || [];
  const maybe = data?.concert?.maybe || [];

  const myRSVP = yes.some(u => u._id === userId)   ? 'yes'
               : no.some(u => u._id === userId)    ? 'no'
               : maybe.some(u => u._id === userId) ? 'maybe'
               : null;

  const handleClick = (type) => {
    const vars = { variables: { concertId, userId } };
    if (type === myRSVP) {
      if (type === 'yes')   cancelRsvpYes(vars);
      if (type === 'no')    cancelRsvpNo(vars);
      if (type === 'maybe') cancelRsvpMaybe(vars);
    } else {
      if (type === 'yes')   rsvpYes(vars);
      if (type === 'no')    rsvpNo(vars);
      if (type === 'maybe') rsvpMaybe(vars);
    }
  };

  return (
    <div className={styles.row}>
      <RSVPOption
        type="yes"
        icon={<Check />}
        label="Yes"
        count={yes.length}
        active={myRSVP === 'yes'}
        onClick={() => handleClick('yes')}
      />
      <RSVPOption
        type="maybe"
        icon={<HelpCircle />}
        label="Maybe"
        count={maybe.length}
        active={myRSVP === 'maybe'}
        onClick={() => handleClick('maybe')}
      />
      <RSVPOption
        type="no"
        icon={<X />}
        label="No"
        count={no.length}
        active={myRSVP === 'no'}
        onClick={() => handleClick('no')}
      />
    </div>
  );
};

const RSVPOption = ({ type, icon, label, count, active, onClick }) => (
  <button
    className={`${styles.option} ${active ? styles[`active_${type}`] : ''}`}
    onClick={onClick}
  >
    <div className={styles.optionIcon}>{icon}</div>
    <div className={styles.optionBody}>
      <div className={styles.optionLabel}>{label}</div>
      <div className={styles.optionCount}>{count} {count === 1 ? 'person' : 'people'}</div>
    </div>
  </button>
);

export default ConcertRSVP;
