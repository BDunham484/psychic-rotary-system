import { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_CONCERT_FROM_USER } from '../../utils/mutations';
import ShowCard from "../../components/ShowCard";
import { Link } from "react-router-dom";
import Expander from "../shared/Expander";


const ProfileConcerts = ({ userParam, user }) => {
    // set state for expander icon to hide/display friendlist names
    const [expand, setExpand] = useState(true);

    //delete saved concert
    const [deleteConcert] = useMutation(DELETE_CONCERT_FROM_USER);

    //function to delete concert from user
    const deleteConcertFromUser = async (id) => {
        console.log("delete concert from user");
        console.log(id);
        try {
            await deleteConcert({
                variables: { concertId: id }
            });
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            <div className="profile-concerts-card">
                <div className="profile-concerts-card-header">
                    <h2>Concerts</h2>
                    <div id="expander">
                        <Expander expand={expand} setExpand={setExpand} />
                    </div>
                </div>
                {expand &&
                    user.concerts &&
                    user.concerts.map((concert, index) => (
                        <ShowCard key={index}>
                            <div id="profile-showcard-data">
                                <div>{concert.date}</div>
                                <Link to={`/show/${concert.artists}`} state={{ concert }}>
                                    <span id="artists-link">{concert.artists} </span>
                                </Link>
                                {concert.venue}
                                {!userParam &&
                                    <div>
                                        <button onClick={() => { deleteConcertFromUser(concert._id) }}>Remove</button>
                                    </div>
                                }
                            </div>
                        </ShowCard>
                    ))
                }
            </div>
        </div>
    )
}

export default ProfileConcerts
