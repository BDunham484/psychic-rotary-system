import RsvpYes from '../RsvpYes';
import RsvpNo from '../RsvpNo';
import RsvpMaybe from '../RsvpMaybe';

const ConcertRSVP = ({ concertId }) => {

    return (
        <div className='rsvp-container'>
            <RsvpYes concertId={concertId} />
            <RsvpNo concertId={concertId} />
            <RsvpMaybe concertId={concertId} />
        </div>
    )
}

export default ConcertRSVP;
