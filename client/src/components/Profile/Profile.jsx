import { useEffect, useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../../utils/queries';
import Auth from '../../utils/auth';
import Friends from '../Friends/Friends';
import ProfileConcerts from './ProfileConcerts';
import BackButton from '../shared/BackButton';
// @ts-ignore
import styles from './Profile.module.css';
import Tabs from '../shared/Tabs/Tabs';

const Profile = () => {
    const { username: userParam } = useParams();
    const {
        profilePageWrapper,
        profilePageHeader,
        profileUserTitle,
        concertFriendWrapper
    } = styles;

    const { loading, data, startPolling, stopPolling } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam }
    });

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling()
        };
    });

    const user = useMemo(() => data?.me || data?.user || {}, [data?.me, data?.user]);

    // Navigate to personal profile page if username === loggedInUser
    // @ts-ignore
    if (Auth.loggedIn() && Auth.getProfile()?.data.username === userParam) {
        return <Navigate to='/profile' />;
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user?._id) {
        return (
            <h4>
                You need to be logged in to see this page. Login or Sign Up above!
            </h4>
        );
    }

    const tabData = [
        {
            label: 'Concerts',
            content:
                <div className={concertFriendWrapper}>
                    <ProfileConcerts userParam={userParam} user={user} />
                </div>
        },
        {
            label: 'Friends',
            content:
                <div className={concertFriendWrapper}>
                    <Friends userParam={userParam} user={user} />
                </div>
        },
    ];

    return (
        <div className={profilePageWrapper}>
            <div className={profilePageHeader}>
                <div className='back-button'>
                    <BackButton />
                </div>
                <div className={profileUserTitle}>
                    <h2>{user.username}</h2>
                </div>
            </div>
            {userParam ? (
                <div className={concertFriendWrapper}>
                    <ProfileConcerts userParam={userParam} user={user} />
                </div>
            ) : (
                <Tabs tabs={tabData} />
            )}
        </div>
    );
};

export default Profile;