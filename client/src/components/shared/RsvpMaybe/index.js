import { useQuery } from "@apollo/client"
import { useContext, useEffect } from 'react';
import { ConcertContext } from "../../../utils/GlobalState";
import { GET_CONCERT_BY_ID } from "../../../utils/queries"
import CheckedMaybe from "../CheckedMaybe";
import UncheckedMaybe from "../UncheckedMaybe";

const RsvpMaybe = ({ concertId }) => {

    //import user query results from GlobalState
    const { user } = useContext(ConcertContext);
    //save loggedIn user's _id to userId 
    const userId = user?.me?._id || {};
    //query concert data based on selected concerts ID
    const { data, startPolling, stopPolling } = useQuery(GET_CONCERT_BY_ID, {
        variables: { concertId: concertId }
    });
    useEffect(() => {
        startPolling(250)
        return () => {
            stopPolling()
        }
    })
    //save all userId in the queried concerts 'maybe' field to noData
    const maybeData = data?.concert?.maybe || [];
    //function to check if the current loggedIn users _id is in the concerts 'maybe' field already
    const isCheckedMaybe = (maybeData, userId) => {
        if (maybeData.length === 0) {
            return false
        } else {
            const concertIdCheck = maybeData.map((id) => {
                if (id._id === userId) {
                    return true;
                } else {
                    return false;
                }
            });
            if (concertIdCheck.includes(true)) {
                return true;
            } else {
                return false;
            };
        };
    };
    //save result of isCheckedNo as 'checked'
    const checked = isCheckedMaybe(maybeData, userId);

    return (
        <div>
            {checked ? (
                <CheckedMaybe concertId={concertId} />
            ) : (
                <UncheckedMaybe concertId={concertId} />
            )}
        </div>
    )
}

export default RsvpMaybe
