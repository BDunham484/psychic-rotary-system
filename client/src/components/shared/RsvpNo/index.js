import CheckedNo from "../CheckedNo";
import UncheckedNo from "../UncheckedNo";

const RsvpNo = ({ concertId }) => {
    return (
        <div>
            <CheckedNo concertId={concertId}/>
            <UncheckedNo concertId={concertId}/>
        </div>
    )
}

export default RsvpNo
