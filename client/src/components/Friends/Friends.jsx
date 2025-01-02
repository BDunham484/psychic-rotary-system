// @ts-ignore
import styles from './styles/Friends.module.css';
import { useState, useEffect } from 'react';
import FriendList from './FriendList';
import FriendSearch from './FriendSearch';
// import Expander from '../shared/Expander';
import Switch from 'react-switch';

const Friends = ({ user }) => {
    const [friendSwitch, setFriendSwitch] = useState(true);
    const [expand, setExpand] = useState(false);
    const {
        friendListWrapper,
        profileFriendsSubHeader,
        friendsSubTitles,
        friendCount,
        friendListIcons
    } = styles;

    const handleFriendSwitch = () => {
        friendSwitch ? setFriendSwitch(false) : setFriendSwitch(true)
    }

    useEffect(() => {
        if (user.friendCount === 0) {
            setExpand(false);
        }
    }, [user])

    return (
        <div id={`${friendListWrapper} display-flex`}>
            <FriendSearch user={user} />
            <FriendList user={user} />
        </div>
    )
}

export default Friends;