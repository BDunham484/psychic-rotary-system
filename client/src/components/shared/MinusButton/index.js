import { useContext } from 'react';
import { useMutation } from "@apollo/client";
import { ConcertContext } from '../../../utils/GlobalState';
import {
    DELETE_CONCERT_FROM_USER,
    RSVP_NO
} from "../../../utils/mutations";
import { SquaredMinus } from '@styled-icons/entypo/SquaredMinus';

const MinusButton = ({ concertId }) => {
    //import user query results from GlobalState
    const { user } = useContext(ConcertContext);
    //save user _id to variable: userId
    const userId = user?.me?._id || {};
    //call rsvpNo mutation
    const [rsvpNo] = useMutation(RSVP_NO);
    const [deleteConcertFromUser] = useMutation(DELETE_CONCERT_FROM_USER);

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
        } catch (e) {
            console.error(e)
        };
    };

    return (
        <>
            <SquaredMinus className="minus-sign" onClick={() => handleClick(concertId, userId)} />
        </>
    )
};

export default MinusButton