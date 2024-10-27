import { useContext } from 'react';
import { useMutation } from "@apollo/client";
import { ConcertContext } from '../../../utils/GlobalState';
import {
    DELETE_CONCERT_FROM_USER,
    RSVP_NO,
    CANCEL_RSVP_YES
} from "../../../utils/mutations";
import { SquaredMinus } from '@styled-icons/entypo/SquaredMinus';

const MinusButton = ({ concertId }) => {
    const { user } = useContext(ConcertContext);
    const userId = user?.me?._id || {};
    // Mutation calls
    const [rsvpNo] = useMutation(RSVP_NO);
    const [deleteConcertFromUser] = useMutation(DELETE_CONCERT_FROM_USER);
    const [cancelRsvpYes] = useMutation(CANCEL_RSVP_YES);


    const handleClick = async (id, userId) => {
        console.log(id + ' has been removed from user profile');
        try {
            await deleteConcertFromUser({
                variables: { concertId: id }
            })
            await rsvpNo({
                variables: {
                    concertId: id,
                    userId: userId
                }
            })
            await cancelRsvpYes({
                variables: {
                    concertId: id,
                    userId: userId
                }
            })
        } catch (err) {
            console.error(err);
        };
    };

    return (
        <div>
            <SquaredMinus className="minus-sign" onClick={() => handleClick(concertId, userId)} />
        </div>
    );
};

export default MinusButton