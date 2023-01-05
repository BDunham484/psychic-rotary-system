import { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { ConcertContext } from '../../../utils/GlobalState';
import { QuestionCircle } from '@styled-icons/bootstrap/QuestionCircle';
import { RSVP_MAYBE } from '../../../utils/mutations';


const UncheckedMaybe = ({ concertId }) => {
    //import user query results from GlobalState
    const { user } = useContext(ConcertContext);
    //save user _id to variable: userId
    const userId = user?.me?._id || {};
    //call cancelRsvpYes mutation
    const [rsvpMaybe] = useMutation(RSVP_MAYBE);
    //function that removes userId from concert's 'yes' field
    const handleClick = async (concertId, userId) => {
        console.log('userId: ' + userId + ' rsvp-ed maybe to concertId: ' + concertId);
        try {
            await rsvpMaybe({
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
            <QuestionCircle className='rsvp-maybe' onClick={() => handleClick(concertId, userId)} />
        </div>
    )
}

export default UncheckedMaybe
