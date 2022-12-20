import { useMutation } from "@apollo/client";
import { ADD_CONCERT_TO_USER } from "../../../utils/mutations";

import { PlusSquareFill } from '@styled-icons/bootstrap/PlusSquareFill';
// import { SquaredMinus } from '@styled-icons/entypo/SquaredMinus';

const PlusButton = ({ concertId }) => {
    const [addConcertToUser] = useMutation(ADD_CONCERT_TO_USER);


    const handleClick = async (id) => {
        console.log(id)
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
            <PlusSquareFill className="plus-sign" onClick={() => handleClick(concertId)} />
        </>
    )
}

export default PlusButton
