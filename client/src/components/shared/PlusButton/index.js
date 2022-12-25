import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_CONCERT_TO_USER } from "../../../utils/mutations";
import { SquaredPlus } from '@styled-icons/entypo/SquaredPlus';




const PlusButton = ({ concertId }) => {


    const [test, setTest] = useState(false)
    console.log('PLUSBUTTON TEST');
    console.log(test);

    const [addConcertToUser] = useMutation(ADD_CONCERT_TO_USER);


    const handleClick = async (id) => {
        console.log(id + ' has been added to user profile');
        try {
            await addConcertToUser({
                variables: { concertId: id }
            })
            setTest(true);
        } catch (e) {
            console.error(e)
        };
        
        // window.location.reload();
    };

    return (
        <>
            <SquaredPlus className="plus-sign" onClick={() => handleClick(concertId)} />
        </>
    )
}

export default PlusButton
