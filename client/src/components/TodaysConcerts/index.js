// import { useEffect } from "react";
import { Link } from "react-router-dom";
import Auth from '../../utils/auth';
import ShowCard from "../ShowCard";
import PlusButton from "../shared/PlusButton";
import MinusButton from "../shared/MinusButton";

const ConcertList = ({ concerts, user }) => {

    const idCheck = (user, id) => {
        if (user) {
            console.log('USER');
            const concertIds = user.me.concerts
            const test = concertIds.map((ids) => {
                if (Object.values(ids).includes(id)) {
                    return true;
                } else {
                    return false;
                }
            })
            if (test.includes(true)) {
                console.log(true);
                return true
            } else {
                console.log(false);
                return false;
            }
        }
    }

    // useEffect(() => {
    //     // concerts.map((concert) => {
    //     //     return idCheck(user, concert._id)
    //     // })
    //     idCheck(user, concerts._id);
    // })

    if (!concerts.length) {
        return <h3>An error occurred. Try reloading the page.</h3>;
    }





    const loggedIn = Auth.loggedIn();

    return (
        <>
            {concerts &&
                concerts.map((concert, index) => (
                    <ShowCard key={concert._id}>
                        {/* {loggedIn && */}
                        {idCheck(user, concert._id) ? (
                            <MinusButton concertId={concert._id} />
                        ) : (
                            <PlusButton concertId={concert._id} />
                        )}
                        {/* } */}


                        <p id="showcard-data">
                            <Link to={`/show/${concert.artists}`} state={{ concert }}>
                                <span id="artists-link">{concert.artists} </span>
                            </Link>
                            at {concert.venue} | {concert.times}
                        </p>

                        {/* {loggedIn &&
                                <div>
                                    <button onClick={() => addConcertToUser(concert)}>Add to Profile</button>
                                    <button onClick={deleteConcertFromUser}>Delete from Profile</button>
                                </div>} */}
                    </ShowCard>
                ))}
        </>
    )
};

export default ConcertList;