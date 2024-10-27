import { useContext } from 'react';
import { useMutation } from "@apollo/client";
import { ConcertContext } from '../../../utils/GlobalState';
import { 
    ADD_CONCERT_TO_USER,
    RSVP_MAYBE,
} from "../../../utils/mutations";
import {  SquaredPlus } from '@styled-icons/entypo/SquaredPlus';

const PlusButton = ({ concertId }) => {
    const { user } = useContext(ConcertContext);
    const userId = user?.me?._id || {};
    //call mutations
    const [addConcertToUser] = useMutation(ADD_CONCERT_TO_USER);
    const [rsvpMaybe] = useMutation(RSVP_MAYBE);

    const handleClick = async (id, userId) => {
        console.log(id + ' has been added to user profile');
        try {
            await addConcertToUser({
                variables: { concertId: id }
            })
            await rsvpMaybe({
                variables: {
                    concertId: id,
                    userId: userId
                }
            })
        } catch (e) {
            console.error(e)
        };
    };

    return (
        <>
            <SquaredPlus className="plus-sign" onClick={() => handleClick(concertId, userId)} />
        </>
    )
}

export default PlusButton
