import { useContext } from "react";
import { useMutation } from "@apollo/client";
import { ADD_CONCERT_TO_USER } from "../../../utils/mutations";
import { SquaredPlus } from '@styled-icons/entypo/SquaredPlus';
import { ConcertContext } from "../../../utils/GlobalState";




const PlusButton = ({ concertId, idCheck }) => {
    const { user, setUserConcerts } = useContext(ConcertContext);

    const [addConcertToUser] = useMutation(ADD_CONCERT_TO_USER);


    const handleClick = async (id) => {
        console.log(id + ' has been added to user profile');
        try {
            await addConcertToUser({
                variables: { concertId: id }
            })
            setUserConcerts(idCheck(user, concertId))
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
