import { useContext } from 'react';
// import PlusButton from "../PlusButton";
// import MinusButton from "../MinusButton";
import { SquaredPlus } from '@styled-icons/entypo/SquaredPlus';
import { SquaredMinus } from '@styled-icons/entypo/SquaredMinus';
import { 
    ADD_CONCERT_TO_USER,
    DELETE_CONCERT_FROM_USER
} from "../../../utils/mutations";
import { useMutation } from "@apollo/client";
import { ConcertContext } from '../../../utils/GlobalState';

const PlusMinus = ({ concertId }) => {

    const { user } = useContext(ConcertContext);
    const [addConcertToUser] = useMutation(ADD_CONCERT_TO_USER);
    const [deleteConcertFromUser] = useMutation(DELETE_CONCERT_FROM_USER);

    const handlePlusClick = async (id) => {
        console.log(id + ' has been added to user profile');
        try {
            await addConcertToUser({
                variables: { concertId: id }
            })
        } catch (e) {
            console.error(e)
        };
        // window.location.reload();
    };

    const handleMinusClick = async (id) => {
        console.log(id + ' has been removed from user profile');
        try {
            await deleteConcertFromUser({
                variables: { concertId: id }
            })
        } catch (e) {
            console.error(e)
        };
    };

    const idCheck = (user, id) => {
        if (Object.keys(user).length === 0) {
            console.log('hang tight');
        } else {
            const concertIds = user.me.concerts
            const test = concertIds.map((ids) => {
                if (Object.values(ids).includes(id)) {
                    return true;
                } else {
                    return false;
                }
            })
            if (test.includes(true)) {
                return true
            } else {
                return false;
            }
        }
    };

    const result = idCheck(user, concertId);


    return (

        // <div>
        //     {result ? (
        //         <MinusButton concertId={concertId} />
        //     ) : (
        //         <PlusButton concertId={concertId} />
        //     )}
        // </div>
        <div>
            {result ? (
                <SquaredMinus className='minus-sign' onClick={() => handleMinusClick(concertId)}/>
            ) : (
                <SquaredPlus className='plus-sign' onClick={() => handlePlusClick(concertId)}/>
            )}
        </div>
    )
}

export default PlusMinus
