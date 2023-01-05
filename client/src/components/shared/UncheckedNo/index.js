import { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { ConcertContext } from '../../../utils/GlobalState';
import { XCircle } from '@styled-icons/bootstrap/XCircle';
import { RSVP_NO } from '../../../utils/mutations';

const UncheckedNo = ({ concertId }) => {
    //import user query results from GlobalState
    const { user } = useContext(ConcertContext);
    //save user _id to variable: userId
    const userId = user?.me?._id || {};
    //call cancelRsvpYes mutation
    const [rsvpNo] = useMutation(RSVP_NO);
    //function that removes userId from concert's 'yes' field
    const handleClick = async (concertId, userId) => {
        console.log('userId: ' + userId + ' rsvp-ed yes to concertId: ' + concertId);
        try {
            await rsvpNo({
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
            <XCircle className='rsvp-no' onClick={() => handleClick(concertId, userId)}/>
        </div>
    )
}

export default UncheckedNo
