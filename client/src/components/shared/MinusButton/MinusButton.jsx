import { useContext } from 'react';
import { useMutation } from "@apollo/client";
import { ConcertContext } from '../../../utils/GlobalState';
import {
    DELETE_CONCERT_FROM_USER,
    RSVP_NO,
    CANCEL_RSVP_YES
} from "../../../utils/mutations";
import { Dash } from '@styled-icons/bootstrap/Dash';

const MinusButton = ({ concertId }) => {
    const { user } = useContext(ConcertContext);
    const userId = user?.me?._id || {};
    const [rsvpNo] = useMutation(RSVP_NO);
    const [deleteConcertFromUser] = useMutation(DELETE_CONCERT_FROM_USER);
    const [cancelRsvpYes] = useMutation(CANCEL_RSVP_YES);

    const handleClick = async (id, userId) => {
        try {
            await deleteConcertFromUser({ variables: { concertId: id } });
            await rsvpNo({ variables: { concertId: id, userId: userId } });
            await cancelRsvpYes({ variables: { concertId: id, userId: userId } });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <button className="minus-sign" onClick={() => handleClick(concertId, userId)}>
            <Dash />
        </button>
    );
};

export default MinusButton;
