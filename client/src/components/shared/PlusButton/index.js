import { useMutation } from "@apollo/client";
import { ADD_CONCERT_TO_USER } from "../../../utils/mutations";

import { SquaredPlus } from '@styled-icons/entypo/SquaredPlus';
// import { SquaredMinus } from '@styled-icons/entypo/SquaredMinus';
// @styled-icons/boxicons-solid/MinusSquare

const PlusButton = ({ concertId }) => {
    const [addConcertToUser] = useMutation(ADD_CONCERT_TO_USER);


    const handleClick = async (id) => {
        console.log(id + ' added to user profile');
        try {
            await addConcertToUser({
                variables: { concertId: id }
            })
        } catch (e) {
            console.error(e)
        };
    };

    return (
        <>
            <SquaredPlus className="plus-sign" onClick={() => handleClick(concertId)} />
        </>
    )
}

export default PlusButton
