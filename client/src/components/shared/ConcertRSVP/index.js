import { useContext } from 'react';
import { ConcertContext } from '../../../utils/GlobalState';
import RsvpYes from '../RsvpYes';
import RsvpNo from '../RsvpNo';
import RsvpMaybe from '../RsvpMaybe';
import { QuestionCircleFill } from '@styled-icons/bootstrap/QuestionCircleFill';

const ConcertRSVP = ({ concertId }) => {

    const { user } = useContext(ConcertContext);

    console.log('USER IN CONCERTRSVP');
    console.log(user);

    return (
        <div className='rsvp-container'>
            <RsvpYes concertId={concertId} />
            <RsvpNo concertId={concertId} />
            <RsvpMaybe concertId={concertId} />
            <QuestionCircleFill className='rsvp-maybe' />
        </div>
    )
}

export default ConcertRSVP
