import { useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Check } from '@styled-icons/feather/Check';
import { X } from '@styled-icons/feather/X';
import { ConcertContext } from '../../../utils/GlobalState';
import { GET_CONCERT_BY_ID } from '../../../utils/queries';
import {
  RSVP_YES,
  RSVP_NO,
  RSVP_MAYBE,
  CLEAR_RSVP,
  ADD_CONCERT_TO_USER,
  DELETE_CONCERT_FROM_USER,
} from '../../../utils/mutations';
import styles from './ConcertRSVP.module.css';

const ConcertRSVP = ({ concertId }) => {
  const { user } = useContext(ConcertContext);
  const userId = user?.me?._id;

  const { data, refetch } = useQuery(GET_CONCERT_BY_ID, { variables: { concertId } });

  const opts = { onCompleted: refetch };
  const [rsvpYes]              = useMutation(RSVP_YES,                 opts);
  const [rsvpNo]               = useMutation(RSVP_NO,                  opts);
  const [rsvpMaybe]            = useMutation(RSVP_MAYBE,               opts);
  const [clearRsvp]            = useMutation(CLEAR_RSVP,               opts);
  const [addConcertToUser]     = useMutation(ADD_CONCERT_TO_USER);
  const [deleteConcertFromUser] = useMutation(DELETE_CONCERT_FROM_USER);

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
      // Cancelling the active RSVP also removes the show from the user's list.
      clearRsvp(vars);
      deleteConcertFromUser({ variables: { concertId } });
    } else {
      // Any RSVP selection saves the show to the user's list.
      if (type === 'yes')   rsvpYes(vars);
      if (type === 'no')    rsvpNo(vars);
      if (type === 'maybe') rsvpMaybe(vars);
      addConcertToUser({ variables: { concertId } });
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
        icon={<span className={styles.textIcon}>?</span>}
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
