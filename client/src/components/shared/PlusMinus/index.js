import PlusButton from "../PlusButton";
import MinusButton from "../MinusButton";


const PlusMinus = (user) => {


    const idCheck = (user, id) => {
        if (user.user === undefined) {
            console.log('hang tight');
        } else {
            const concertIds = user.user.me.concerts
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
            {idCheck(user, user.concertId) ? (
                <MinusButton concertId={user.concertId} />
            ) : (
                <PlusButton concertId={user.concertId} />
            )}
        </div>
    )
}

export default PlusMinus
