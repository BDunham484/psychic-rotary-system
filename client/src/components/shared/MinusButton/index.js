import { useMutation } from "@apollo/client";
import { DELETE_CONCERT_FROM_USER } from "../../../utils/mutations";
import { SquaredMinus } from '@styled-icons/entypo/SquaredMinus';

const MinusButton = ({ concertId }) => {
    const [deleteConcertFromUser] = useMutation(DELETE_CONCERT_FROM_USER);

    const handleClick = async (id) => {
        console.log(id + ' has been removed from user profile');
        try {
            await deleteConcertFromUser({
                variables: { concertId: id }
            })
        } catch (e) {
            console.error(e)
        };
    };

    return (
        <>
            <SquaredMinus className="minus-sign" onClick={() => handleClick(concertId)} />
        </>
    )
};

export default MinusButton