import { useContext } from 'react';
import { useMutation } from "@apollo/client";
import { ConcertContext } from '../../../utils/GlobalState';
import {
    ADD_CONCERT_TO_USER,
    RSVP_YES,
} from "../../../utils/mutations";
import { Plus } from '@styled-icons/bootstrap/Plus';

const PlusButton = ({ concertId }) => {
    const { user } = useContext(ConcertContext);
    const userId = user?.me?._id || {};
    const [addConcertToUser] = useMutation(ADD_CONCERT_TO_USER);
    const [rsvpYes] = useMutation(RSVP_YES);

    const handleClick = async (id, userId) => {
        try {
            await addConcertToUser({ variables: { concertId: id } });
            await rsvpYes({ variables: { concertId: id, userId: userId } });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <button className="plus-sign" onClick={() => handleClick(concertId, userId)}>
            <Plus />
        </button>
    );
};

export default PlusButton;
