import CheckedYes from "../CheckedYes"
import UncheckedYes from "../UncheckedYes"

const RsvpYes = ({ concertId }) => {
    return (
        <div>
            <CheckedYes concertId={concertId} />
            <UncheckedYes concertId={concertId} />
        </div>
    )
}

export default RsvpYes
