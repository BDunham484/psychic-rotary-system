import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { DELETE_CONCERT_FROM_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import ShowCard from "../components/ShowCard";
import Friends from "../components/Friends";

const Profile = () => {

    const { username: userParam } = useParams();

    //query that checks param value then conditionally runs query based on result
    const { loading, data, startPolling, stopPolling } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam }
    });

    useEffect(() => {
        //runs the query every second
        startPolling(1000);
        return () => {
            stopPolling()
        };
    })

    //user declaration set up to handle each type of response from above useQuery
    const user = data?.me || data?.user || {};
    console.log('USER DATA FROM PROFILE.JS');
    console.log(user);

    //delete saved concert
    const [deleteConcert, { error }] = useMutation(DELETE_CONCERT_FROM_USER);
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

    //navigate to personal profile page if username is the logged-in user's
    if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
        return <Navigate to="/profile" />;
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user?._id) {
        return (
            <h4>
                You need to be logged in to see this page. Login or Signup above!
            </h4>
        );
    }

    return (
        <div className='profile-page-wrapper'>

            <div className="profile-concerts-card">
                <div className="profile-concerts-card-header">
                    <h2>Viewing {userParam ? `${user.username}'s` : 'your'} profile: {user.username}</h2>
                    <p>Concerts: {user.concertCount}</p>
                </div>

                {error && <div>An error occurred</div>}
                {user.concerts &&
                    user.concerts.map((concert, index) => (
                        <ShowCard key={index}>
                            <div id="profile-showcard-data">
                                <div>{concert.date}</div>
                                <Link to={`/show/${concert.artists}`} state={{ concert }}>
                                    <span id="artists-link">{concert.artists} </span>
                                </Link>
                                {concert.venue}
                                <div>
                                    <button onClick={() => { deleteConcertFromUser(concert._id) }}>Remove</button>
                                </div>

                            </div>
                        </ShowCard>
                    ))}


            </div>
            <Friends userParam={userParam} user={user} />
        </div>
    )
}

export default Profile;