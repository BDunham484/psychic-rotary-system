import { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { ConcertContext } from '../../../utils/GlobalState';
import { CheckCircleFill } from '@styled-icons/bootstrap/CheckCircleFill';
import { RSVP_YES } from '../../../utils/mutations';

const CheckedYes = ({ concertId }) => {
    //import user query results from GlobalState
    const { user } = useContext(ConcertContext);
    //save user _id to variable: userId
    const userId = user?.me?._id || {};
    //call rsvpYes mutation
    const [rsvpYes] = useMutation(RSVP_YES);
    //function that adds (rsvp's) userId to concert's 'yes' field
    const handleClick = async (concertId, userId) => {
        console.log('userId: ' + userId + ' rsvp-ed yes to concertId: ' + concertId);
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
