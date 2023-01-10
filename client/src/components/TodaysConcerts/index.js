// import { useQuery } from "@apollo/client";
// import { GET_CONCERTS_BY_DATE } from "../../utils/queries";
// import { useEffect } from "react";
import { Link } from "react-router-dom";
import Auth from '../../utils/auth';
import ShowCard from "../ShowCard";
import PlusMinus from "../shared/PlusMinus";
import { SquaredPlus } from '@styled-icons/entypo/SquaredPlus';
// import ConcertRSVP from "../shared/ConcertRSVP";


const ConcertList = ({ concerts }) => {
// const ConcertList = ({ date }) => {

    //use useQuery hook to make query request with dynamic date
    // const { data, startPolling, stopPolling } = useQuery(GET_CONCERTS_BY_DATE, {
    //     variables: { date: date }
    // });

    // useEffect(() => {
    //     startPolling(250)
    //     return () => {
    //         stopPolling()
    //     }
    // })

    //assign data to variable if present
    // const concerts = data?.concertsFromDb || [];

    if (!concerts.length) {
        return <h3>An error occurred. Try reloading the page.</h3>;
    }

    const loggedIn = Auth.loggedIn();

    return (
        <>
            {concerts &&
                concerts.map((concert, index) => (
                    <ShowCard key={concert._id}>
                        <div id="show-card-contents">
                            <div>
                                {loggedIn
                                    ? <PlusMinus concertId={concert._id} />
                                    : <SquaredPlus id="plus-sign-logged-out" />
                                }
                            </div>
                            <p id="show-card-data">
                                <Link to={`/show/${concert.artists}`} state={{ concert }}>
                                    <span id="artists-link">{concert.artists} </span>
                                </Link>
                                <span id="at-venue">at</span> <span id="venue">{concert.venue}</span> <span id="divider">|</span> {concert.times}
                            </p>
                        </div>
                        <div>
                            {/* <ConcertRSVP concertId={concert._id} /> */}
                        </div>
                    </ShowCard>
                ))}
        </>
    )
};

export default ConcertList;