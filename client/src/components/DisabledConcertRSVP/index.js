import { useQuery } from "@apollo/client";
import { GET_CONCERT_BY_ID } from "../../utils/queries";
import { CheckCircleFill } from '@styled-icons/bootstrap/CheckCircleFill';
import { XCircleFill } from '@styled-icons/bootstrap/XCircleFill';
import { QuestionCircleFill } from '@styled-icons/bootstrap/QuestionCircleFill';
import RsvpCount from "../shared/RsvpCount";

const DisabledConcertRSVP = ({ concertId }) => {
    //query concert data based on selected concerts ID
    const { data } = useQuery(GET_CONCERT_BY_ID, {
        variables: { concertId: concertId }
    });

    //save all userId in the queried concerts 'yes' field to yesData
    const yesData = data?.concert?.yes || [];
    //save all userId in the queried concerts 'no' field to noData
    const noData = data?.concert?.no || [];
    //save all userId in the queried concerts 'maybe' field to maybeData
    const maybeData = data?.concert?.maybe || [];
    //get the lengtrhs of rsvp fields from Concert model and save to variables
    const yesCount = yesData.length;
    const noCount = noData.length;
    const maybeCount = maybeData.length;


    return (
        <div className="rsvp-container">
            <div className="rsvp-wrapper">
                <CheckCircleFill className="disabled-icons" />
                <RsvpCount count={yesCount} />
            </div>
            <div className="rsvp-wrapper">
                <XCircleFill className="disabled-icons" />
                <RsvpCount count={noCount} />
            </div>
            <div className="rsvp-wrapper">
                <QuestionCircleFill className="disabled-icons" />
                <RsvpCount count={maybeCount} />
            </div>
        </div>
    )
}

export default DisabledConcertRSVP;
