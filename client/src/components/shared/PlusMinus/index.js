import PlusButton from "../PlusButton";
import MinusButton from "../MinusButton";


const PlusMinus = ({ user, concertId }) => {

    const idCheck = (user, id) => {
        if (user === undefined) {
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
    }

    return (
        <div>
            {idCheck(user, concertId) ? (
                <MinusButton concertId={concertId} />
            ) : (
                <PlusButton concertId={concertId} />
            )}
        </div>
    )
}

export default PlusMinus
