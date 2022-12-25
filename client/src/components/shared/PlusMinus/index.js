import { useContext, useState } from 'react';
import PlusButton from "../PlusButton";
import MinusButton from "../MinusButton";
import { ConcertContext } from '../../../utils/GlobalState';

const PlusMinus = ({ concertId }) => {

    const { user, userConcerts, setUserConcerts } = useContext(ConcertContext);

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

    // TRY SETTING THIS AS GLOBAL STATE!!!!!!!!!!! AND PASSING IT TO THE BUTTONS/SETSTATE ONCLICK!!!!!!!
    // const [test, setTest] = useState(result);

    setUserConcerts(result);

    return (

        <div>
            {userConcerts ? (
                <MinusButton concertId={concertId} />
            ) : (
                <PlusButton concertId={concertId} idCheck={idCheck} />
            )}
        </div>
    )
}

export default PlusMinus
