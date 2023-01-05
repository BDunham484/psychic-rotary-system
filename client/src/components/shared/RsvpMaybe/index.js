import CheckedMaybe from "../CheckedMaybe";
import UncheckedMaybe from "../UncheckedMaybe";

const RsvpMaybe = (concertId) => {
    return (
        <div>
            <CheckedMaybe concertId={concertId} />
            <UncheckedMaybe concertId={concertId} />
        </div>
    )
}

export default RsvpMaybe
