import { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { ConcertContext } from '../../../utils/GlobalState';
import { CheckCircle } from '@styled-icons/bootstrap/CheckCircle';
import { CANCEL_RSVP_YES } from '../../../utils/mutations';

const UncheckedYes = ({ concertId }) => {
    //import user query results from GlobalState
    const { user } = useContext(ConcertContext);
    //save user _id to variable: userId
    const userId = user?.me?._id || {};
    //call cancelRsvpYes mutation
    const [cancelRsvpYes] = useMutation(CANCEL_RSVP_YES);
    //function that removes userId from concert's 'yes' field
    const handleClick = async (concertId, userId) => {
        console.log('userId: ' + userId + ' cancel rsvp yes to concertId: ' + concertId);
        try {
            await cancelRsvpYes({
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
            <CheckCircle className='rsvp-yes' onClick={() => handleClick(concertId, userId)}/>
        </>
    )
}

export default UncheckedYes
