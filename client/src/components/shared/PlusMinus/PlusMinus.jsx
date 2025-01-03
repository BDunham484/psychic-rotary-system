import { useContext } from 'react';
import PlusButton from "../PlusButton/PlusButton";
import MinusButton from "../MinusButton/MinusButton";
import { ConcertContext } from '../../../utils/GlobalState';

const PlusMinus = ({ concertId }) => {
    const { user } = useContext(ConcertContext);
    // Check if concertId is in User's concert field.
    const concertIdCheck = (user, id) => {
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
                return true;
            } else {
                return false;
            }
        }
    };

    let concertSavedToUser = concertIdCheck(user, concertId);

    return (

        <div>
            {concertSavedToUser ? (
                <MinusButton concertId={concertId} />
            ) : (
                <PlusButton concertId={concertId} />
            )}
        </div>
    )
}

export default PlusMinus
