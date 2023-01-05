import { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { ConcertContext } from '../../../utils/GlobalState';
import { QuestionCircleFill } from '@styled-icons/bootstrap/QuestionCircleFill';
import { CANCEL_RSVP_MAYBE } from '../../../utils/mutations';

const CheckedMaybe = ({ concertId }) => {
    //import user query results from GlobalState
    const { user } = useContext(ConcertContext);
    //save user _id to variable: userId
    const userId = user?.me?._id || {};
    //call rsvpNo mutation
    const [cancelRsvpMaybe] = useMutation(CANCEL_RSVP_MAYBE);
    //function that adds (rsvp's) userId to concert's 'yes' field
    const handleClick = async (concertId, userId) => {
        console.log('userId: ' + userId + ' canceled rsvp no to concertId: ' + concertId);
        try {
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
        <div>
            <QuestionCircleFill className='rsvp-maybe' onClick={() => handleClick(concertId, userId)} />
        </div>
    )
}

export default CheckedMaybe
