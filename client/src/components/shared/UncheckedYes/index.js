import { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { ConcertContext } from '../../../utils/GlobalState';
import { CheckCircle } from '@styled-icons/bootstrap/CheckCircle';
import {
    RSVP_YES,
    CANCEL_RSVP_NO,
    CANCEL_RSVP_MAYBE
} from '../../../utils/mutations';


const UncheckedYes = ({ concertId }) => {
    //import user query results from GlobalState
    const { user } = useContext(ConcertContext);
    //save user _id to variable: userId
    const userId = user?.me?._id || {};
    //call rsvpYes mutation
    const [rsvpYes] = useMutation(RSVP_YES);
    //call cancelRsvpNo mutation
    const [cancelRsvpNo] = useMutation(CANCEL_RSVP_NO);
    //call cancelRsvpMaybe mutation
    const [cancelRsvpMaybe] = useMutation(CANCEL_RSVP_MAYBE);
    //function that removes userId from concert's 'yes' field
    const handleClick = async (concertId, userId) => {
        console.log('userId: ' + userId + ' rsvp-ed yes to concertId: ' + concertId);
        try {
            await rsvpYes({
                variables: {
                    concertId: concertId,
                    userId: userId
                }
            })
            await cancelRsvpNo({
                variables: {
                    concertId: concertId,
                    userId: userId
                }
            })
            await cancelRsvpMaybe({
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
            <CheckCircle className='rsvp-yes' onClick={() => handleClick(concertId, userId)} />
        </>
    )
}

export default UncheckedYes
