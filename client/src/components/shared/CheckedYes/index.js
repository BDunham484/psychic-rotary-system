import { useContext } from 'react';
import { ConcertContext } from '../../../utils/GlobalState';
import { CheckCircleFill } from '@styled-icons/bootstrap/CheckCircleFill';

const CheckedYes = ({ concertId }) => {

    const { user } = useContext(ConcertContext);
    // console.log('user within CheckedYes');
    // console.log(user);

    const handleClick = (concertId) => {
        console.log('CheckedYes click handler has been clicked: ' + concertId)
    }

    return (
        <>
            <CheckCircleFill className='rsvp-yes' onClick={() => handleClick(concertId)} />
        </>
    )
}

export default CheckedYes
