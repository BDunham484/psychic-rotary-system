import { useQuery } from "@apollo/client"
import { GET_CONCERT_BY_ID } from "../../../utils/queries"
import CheckedYes from "../CheckedYes"
import UncheckedYes from "../UncheckedYes"

const RsvpYes = ({ concertId }) => {

    const { data } = useQuery(GET_CONCERT_BY_ID, {
        variables: { concertId: concertId }
    });

    const concertData = data || {};

    console.log('concert in rsvpyes');
    console.log(concertData);

    return (
        <div>
            <CheckedYes concertId={concertId} />
            <UncheckedYes concertId={concertId} />
        </div>
    )
}

export default RsvpYes
