import { useEffect } from "react";
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';
import Friends from "../components/Friends";
import ProfileConcerts from "../components/ProfileConcerts";

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
            <div className="profile-page-header">
                <h2>Viewing {userParam ? `${user.username}'s` : 'your'} profile: {user.username}</h2>
            </div>
            <div className="concert-friend-wrapper">
                <ProfileConcerts user={user} />
                <Friends userParam={userParam} user={user} />
            </div>

        </div>
    )
}

export default Profile;