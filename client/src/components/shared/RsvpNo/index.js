import { useQuery } from "@apollo/client"
import { useContext, useEffect } from 'react';
import { ConcertContext } from "../../../utils/GlobalState";
import { GET_CONCERT_BY_ID } from "../../../utils/queries"
import CheckedNo from "../CheckedNo";
import UncheckedNo from "../UncheckedNo";
import RsvpCount from "../RsvpCount";

const RsvpNo = ({ concertId }) => {
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
    //save all userId in the queried concerts 'no' field to noData
    const noData = data?.concert?.no || [];
    //function to check if the current loggedIn users _id is in the concerts 'no' field already
    const isCheckedNo = (noData, userId) => {
        if (noData.length === 0) {
            return false
        } else {
            const concertIdCheck = noData.map((id) => {
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
    const checked = isCheckedNo(noData, userId);

    const count = noData.length;

    return (
        <div className="rsvp-wrapper">
            <div>
                {checked ? (
                    <CheckedNo concertId={concertId} />
                ) : (
                    <UncheckedNo concertId={concertId} />
                )}
            </div>

            <RsvpCount count={count} />
        </div>
    )
}

export default RsvpNo
