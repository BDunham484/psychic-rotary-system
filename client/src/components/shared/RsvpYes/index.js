import { useQuery } from "@apollo/client"
import { useContext } from 'react';
import { ConcertContext } from "../../../utils/GlobalState";
import { GET_CONCERT_BY_ID } from "../../../utils/queries"
import CheckedYes from "../CheckedYes"
import UncheckedYes from "../UncheckedYes"
import RsvpCount from "../RsvpCount"

const RsvpYes = ({ concertId }) => {
    //import user query results from GlobalState
    const { user } = useContext(ConcertContext);
    //save loggedIn user's _id to userId 
    const userId = user?.me?._id || {};
    //query concert data based on selected concerts ID
    const { data } = useQuery(GET_CONCERT_BY_ID, {
        variables: { concertId: concertId }
    });
    //save all userId in the queried concerts 'yes' field to yesData
    const yesData = data?.concert?.yes || [];
    //function to check if the current loffedIn users _id is in the concerts 'yes' field already
    const isCheckedYes = (yesData, userId) => {
        if (yesData.length === 0) {
            return false
        } else {
            const concertIdCheck = yesData.map((id) => {
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
    //save result of isCheckedYes as 'checked'
    const checked = isCheckedYes(yesData, userId);

    const count = yesData.length

    return (
        <div className="rsvp-wrapper">
            <div>
                {checked ? (
                    <CheckedYes concertId={concertId} />
                ) : (
                    <UncheckedYes concertId={concertId} />
                )}
            </div>

            <RsvpCount count={count} />
        </div>
    )
}

export default RsvpYes
