import { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { ConcertContext } from '../../../utils/GlobalState';
import { XCircleFill } from '@styled-icons/bootstrap/XCircleFill';
import { RSVP_NO } from '../../../utils/mutations';

const CheckedNo = ({ concertId }) => {
    //import user query results from GlobalState
    const { user } = useContext(ConcertContext);
    //save user _id to variable: userId
    const userId = user?.me?._id || {};
    //call rsvpNo mutation
    const [rsvpNo] = useMutation(RSVP_NO);
    //function that adds (rsvp's) userId to concert's 'yes' field
    const handleClick = async (concertId, userId) => {
        console.log('userId: ' + userId + ' canceled rsvp no to concertId: ' + concertId);
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
            <XCircleFill className='rsvp-no'onClick={() => handleClick(concertId, userId)}/>
        </div>
    )
}

export default CheckedNo
