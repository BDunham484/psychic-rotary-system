import { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { ConcertContext } from '../../../utils/GlobalState';
import { CheckCircleFill } from '@styled-icons/bootstrap/CheckCircleFill';
import { RSVP_YES } from '../../../utils/mutations';

const CheckedYes = ({ concertId }) => {

    const { user } = useContext(ConcertContext);
    
    const userId = user?.me?._id || {};

    const [rsvpYes] = useMutation(RSVP_YES);

    const handleClick = async (concertId, userId) => {
        console.log('CheckedYes click handler has been clicked: ' + concertId + ' and ' + userId);
        try {
            await rsvpYes({
                variables: { 
                    concertId: concertId,
                    userId: userId
                }
            })
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <CheckCircleFill className='rsvp-yes' onClick={() => handleClick(concertId, userId)} />
        </>
    )
}

export default CheckedYes
