import { useContext } from 'react';
import { useMutation } from "@apollo/client";
import { ConcertContext } from '../../../utils/GlobalState';
import {
    DELETE_CONCERT_FROM_USER,
    CLEAR_RSVP
} from "../../../utils/mutations";
import { Dash } from '@styled-icons/bootstrap/Dash';

const MinusButton = ({ concertId }) => {
    const { user } = useContext(ConcertContext);
    const userId = user?.me?._id || {};
    const [deleteConcertFromUser] = useMutation(DELETE_CONCERT_FROM_USER);
    const [clearRsvp] = useMutation(CLEAR_RSVP);

    const handleClick = async (id, userId) => {
        try {
            await deleteConcertFromUser({ variables: { concertId: id } });
            await clearRsvp({ variables: { concertId: id, userId: userId } });
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
